/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.actions.stuexam;

import cn.edu.dlnu.doe.app.actions.ExamAction;
import cn.edu.dlnu.doe.app.actions.PaperAction;
import cn.edu.dlnu.doe.app.task.PrepareExamTask;
import cn.edu.dlnu.doe.app.task.SyncAswToDBTask;
import cn.edu.dlnu.doe.app.util.SessionUtil;

import cn.edu.dlnu.doe.dal.bo.Exam;

import cn.edu.dlnu.doe.dal.bo.Student;

import cn.edu.dlnu.doe.dal.relation.ExamStudent;
import cn.edu.dlnu.doe.queue.RQueue;
import cn.edu.dlnu.doe.redis.RedisClient;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.ParamUtil;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.sql.SqlCallback;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created with IntelliJ IDEA. User: upupxjg Date: 13-3-23 Time: 下午2:03
 */

@Ok("ioc:template")
@Fail("ioc:errorjson")
@AdaptBy(type = PairAdaptor.class)
@InjectName("stuExamAction")
@SuppressWarnings({ "unchecked", "unused" })
public class StuExamAction implements StuStat {
	private static final int ASW_KEEP_TIME = 10800;// s
	
	private static final Log log = Logs.getLog(StuExamAction.class);
	private PrepareExamTask prepareExamTask;
	private Dao rDao;
	private Dao wDao;
	private PaperAction paperAction;
	private ExamAction examAction;
	private Cache cache;
	private RedisClient redisClient;
	private RQueue queue;
    private SyncAswToDBTask syncAswToDBTask;
	@At("/submit/asw")
	public Object submitAnswer(@Param("examid") Long examid, @Param("questionid") Long questionid,
			@Param("asw") String asw, HttpServletRequest req) {
		if (ParamUtil.isNull(examid, questionid, asw)) {
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "] questionId:[" + questionid + "] asw:["
					+ asw + "]");
		}
		Student self = (Student) SessionUtil.getFromSession("self", req);
		String stuid = self.getId();
		Integer status = getStatus(examid,stuid);
		if (status == StuStat.COMMITTED) {
			throw new RuntimeException("对不起，你已经参加过此场考试了。");
		} else if (status == StuStat.CHEATING) {
			throw new RuntimeException("对不起，由于您在考试过程中行为不规范，无法进入此场考试。");
		}
		redisClient.put(examid + "_" + stuid + "_" + questionid, asw);
		return null;
	}

	@At("/commit")
	public Integer commit(@Param("examid") Long examid, HttpServletRequest req) {

		Student student = (Student) SessionUtil.getFromSession("self", req);
		String sid = student.getId();
		Integer status = getStatus(examid,sid);
		if (StuStat.COMMITTED.equals(status)) {
			throw new RuntimeException("您的试卷已经提交过了");
		}
		if (status.equals(StuStat.CHEATING)) {
			throw new RuntimeException("对不起，由于您在考试过程中行为不规范，无法提交");
		}

		log.info("add to commit queue examid:{" + examid + "] stuid:[" + sid + ']');
		Map examInfo = (Map) cache.get(PrepareExamTask.EXAM_PREFIX + examid);
		
		Exam exam = (Exam) examInfo.get("info");
		Date startDate = exam.getStartTime();
		if((new Date().getTime() - startDate.getTime()) < exam.getMinTime()*60*1000){
			throw new RuntimeException("对不起，还没有到最短交卷时间，请稍后再交");
		}
		
		List<Long> objectQuestion = (List<Long>) examInfo.get("obj");
		Map<Long, String> asws = (Map<Long, String>) examInfo.get("asw");
		Map<Long, Long> allScoreMap = (Map<Long, Long>) examInfo.get("score");
		int score = 0;
		for (Long qid : objectQuestion) {
			String aswStu = redisClient.get(examid + "_" + sid + "_" + qid);
			String asw = asws.get(qid);
			Long qscore = allScoreMap.get(qid);
			if (aswStu != null && aswStu.equals(asw)) {
				score += qscore;
			}
			log.info("get score:[" + qscore + "] asw:[" + asw + "] stuAsw:[" + aswStu + "] by examid:[" + examid
					+ "] stuid:[" + sid + "] qid:[" + qid + ']');
		}
		log.info("stu:[" + sid + "] in exam:[" + examid + "] score:[" + score + ']');
		setStatus(examid,sid, StuStat.COMMITTED);
		ExamStudent es = rDao.fetch(ExamStudent.class, Cnd.where("examid", "=", examid).and("studentid", "=", sid));
		es.setObjectiveMark(score);
        wDao.update(es);

        //commit answer
        queue.push(examid + "_" + sid, RQueue.EXAM_STU_TO_CMT);
       // syncAswToDBTask.sync(examid, sid);
		return score;
	}

	public void setStatus(Long examid,String studentid, Integer status) {
		log.info("CHANGE student status to [" + status + ']');
		cache.put(STU_STAT_PREFIX + examid+"_"+studentid, status);
        ExamStudent es = rDao.fetch(ExamStudent.class, Cnd.where("examid", "=", examid).and("studentid", "=", studentid));
        es.setStatus(status);
        wDao.update(es);
	}

	public Integer getStatus(Long examid,String studentid) {
		Integer status = (Integer) cache.get(STU_STAT_PREFIX +examid+"_"+studentid);
		if (null == status) {
            ExamStudent es = rDao.fetch(ExamStudent.class, Cnd.where("examid", "=", examid).and("studentid", "=", studentid));
            status = es.getStatus();
          //setStatus(examid,studentid,status);
            cache.put(STU_STAT_PREFIX + examid+"_"+studentid, status);
		}
		return status;
	}

	@At("/prexam")
	public Long prexam(@Param("examid") Long examid, HttpServletRequest req) {
		Student student = (Student) SessionUtil.getFromSession("self", req);
		String sid = student.getId();
		Integer status = getStatus(examid,sid);
		if (StuStat.COMMITTED.equals(status)) {
			throw new RuntimeException("您的试卷已经提交过了");
		}
		if (status.equals(StuStat.CHEATING)) {
			throw new RuntimeException("对不起，由于您在考试过程中行为不规范，无法提交");
		}
		setStatus(examid,sid, StuStat.ONLINE);
		prepareExamTask.prepareExam(examid);
		Exam exam = examAction.getExam(examid);
		Date starttime = exam.getStartTime();
		Date now = new Date();
		long diff = starttime.getTime() - now.getTime();
		return diff / 1000+3+Math.round(3);
	}

	@At("/panel")
	public Object panel(HttpServletRequest req) {
		Map res = new HashMap();
		res.put("self", SessionUtil.getFromSession("self", req));
		res.put("exams", this.getExamList(req));
		return res;
	}

	@At("/BeHappy")
	public Object beHappy(@Param("examid") Long examid, HttpServletRequest req) {
		Map res = new HashMap();
		Student self = (Student) SessionUtil.getFromSession("self", req);
		res.put("self", self);
		Exam exam = examAction.getExam(examid);
		if (exam.getStartTime().after(new Date())) {
			throw new RuntimeException("对不起 考试还未开始！");
		}
		if (exam.getStartTime().getTime() + exam.getDuration() * 60000 + 180000 < new Date().getTime()) {
			throw new RuntimeException("对不起 考试已经结束！");
		}
		Integer status = getStatus(examid,self.getId());
		if (status == StuStat.COMMITTED) {
			throw new RuntimeException("对不起，你已经参加过此场考试了。");
		} else if (status == StuStat.CHEATING) {
			throw new RuntimeException("对不起，由于您在考试过程中行为不规范，无法进入此场考试。");
		}
		res.put("exam", exam);
		Object paper = paperAction.get(exam.getPaperid());
		res.put("paper", paper);
		res.put("paperid", exam.getPaperid());
		res.put("timeRemaining", exam.getDuration() * 60 - (new Date().getTime() - exam.getStartTime().getTime())
				/ 1000);
		res.put("role", SessionUtil.getFromSession("role", req));
		res.put("webroot", req.getContextPath());
		return res;
	}

	public Object getExamList(HttpServletRequest req) {
		String id = (String) SessionUtil.getFromSession("userid", req);
		SqlExpression e1 = Cnd.exps("studentid", "=", id);
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd%");
		String starttime = format.format(new Date());
		Sql sql = Sqls.create("select id from t_exam where starttime LIKE '" + starttime + "'");
		sql.setCallback(new SqlCallback() {
			List<Long> list = new LinkedList<Long>();

			@Override
			public Object invoke(Connection conn, ResultSet rs, Sql sql) throws SQLException {
				while (rs.next()) {
					list.add(rs.getLong("id"));
				}
				return list;
			}
		});
		rDao.execute(sql);
		List<Long> examList = sql.getList(Long.class);
		if (examList == null || examList.size() == 0) {
			return new LinkedList<Exam>();
		}
		List<ExamStudent> examStudents = rDao.query(ExamStudent.class, Cnd.where(e1).and("examid", "in", examList));
		if (examStudents == null || examStudents.size() == 0) {
			return new LinkedList<Exam>();
		}
		examList = new LinkedList<Long>();
		for (ExamStudent es : examStudents) {
			if (es.getStatus() < StuStat.COMMITTED)
				// 如果学生还没考试则可以显示
				examList.add(es.getExamid());
		}
		return rDao.query(Exam.class, Cnd.where("id", "in", examList));
	}

	@At("/sync/asw")
	public Object SyncAsw(@Param("examid") Long examid, HttpServletRequest req) {

		if (ParamUtil.isNull(examid) || examid < 0) {
			log.error("PARAM ERROR examid:[" + examid + "]");
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "]");
		}
		Map examInfo = (Map) cache.get(PrepareExamTask.EXAM_PREFIX + examid);
		log.error(Json.toJson(examInfo) + " [examinfo]");
		List<Long> qids = (List<Long>) examInfo.get("qids");
		Student self = (Student) SessionUtil.getFromSession("self", req);
		String sid = self.getId();
		log.error(Json.toJson(qids) + " [qids]");
		Map<Long, String> map = new HashMap<Long, String>();

		for (Long qid : qids) {

			String asw = redisClient.get(examid + "_" + sid + "_" + qid);
			map.put(qid, asw);
			log.info(String.format("get answer:[%s] by examid:[%d] studentid:[%s] questionid:[%d]", asw, examid, sid,
					qid));
		}

		return map;
	}

	/**************************************************************************************************************************/

	@At("/readover")
	public Object ReadOver(@Param("examid") Long examid, HttpServletRequest req) {
		@SuppressWarnings("rawtypes")
		Map res = new HashMap();
		if (examid == null || ParamUtil.isNull(examid)) {
			throw new RuntimeException("PARAM ERROR ! examid:{" + examid + "]");
		}
		Exam exam = examAction.getExam(examid);
		res.put("exam", exam);
		res.put("role", SessionUtil.getFromSession("role", req));
		res.put("self", SessionUtil.getFromSession("self", req));
		res.put("webroot", req.getContextPath());
		res.put("paper", paperAction.get(exam.getPaperid()));
		res.put("paperid",exam.getPaperid());
		return res;

	}

	/***************************************************************************************************************************/
	
	

	@At("/exam/status")
	public void examstatus(@Param("examid") Long examid, @Param("status") Integer status){
		if(ParamUtil.isNull(examid, status) || status<1 || status>3 || examid<0){
			log.error("PARAM ERROR examid:[" + examid + "],status:[" + status + "]");
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "],status:[" + status + "]");
		}
		if(null != cache.get(PrepareExamTask.EXAM_PREFIX + examid)){
			Map<String, Object> examInfo = (Map<String, Object>) cache.get(PrepareExamTask.EXAM_PREFIX + examid);
			Exam exam = (Exam) examInfo.get("info");
			exam.setStatus(status);
			wDao.update(exam);
			examInfo.put("info", exam);
			cache.replace(PrepareExamTask.EXAM_PREFIX + examid, examInfo);
		}else{
			Exam exam = rDao.fetch(Exam.class, Cnd.where("id", "=", examid));
			if(null == exam){
				log.error("CONT FIND EXAM BY ID:[" + examid + "]");
				throw new RuntimeException("CONT FIND EXAM BY ID:[" + examid + "]");
			}
			exam.setStatus(status);
			wDao.update(exam);
		}
	}
	
	@At("exam/stu/status")
	public Object studentstatus(@Param("examid") Long examid){
		if(null==examid || examid<0){
			log.error("PARAM ERROR examid:[" + examid + "]");
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "]");
		}
		List<Map<String, Object>> statusMaps = new ArrayList<Map<String, Object>>();
		if(null != cache.get(PrepareExamTask.EXAM_PREFIX + examid)){
	    	Map<String, Object> examInfo = (Map<String, Object>) cache.get(PrepareExamTask.EXAM_PREFIX + examid);
	    	List<String> stus = new LinkedList<String>();
	    	stus = (List<String>) examInfo.get("stu");
	    	Integer status;
	    	for (String stu : stus) {
	    		Map<String, Object> statusMap = new HashMap<String, Object>();
	    		status = (Integer) cache.get(STU_STAT_PREFIX + examid+"_"+stu);
	    		if(null == status){
	    			ExamStudent examStudent = rDao.fetch(ExamStudent.class, Cnd.where("examid", "=", examid).and("studentid", "=", stu));
	    			status = examStudent.getStatus();
	    		}
	    	//	statusMap.put(stu, status);
	    		statusMap.put("id", stu);
	    		statusMap.put("status", status);
	    		statusMaps.add(statusMap);
			}
		}
		return statusMaps;
	}
	
	
	
	public void setrDao(Dao rDao) {
		this.rDao = rDao;
	}

	public void setPaperAction(PaperAction paperAction) {
		this.paperAction = paperAction;
	}

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	public void setExamAction(ExamAction examAction) {
		this.examAction = examAction;
	}

	public void setPrepareExamTask(PrepareExamTask prepareExamTask) {
		this.prepareExamTask = prepareExamTask;
	}

	public void setwDao(Dao wDao) {
		this.wDao = wDao;
	}

	public void setRedisClient(RedisClient redisClient) {
		this.redisClient = redisClient;
	}

	public void setQueue(RQueue queue) {
		this.queue = queue;
	}
}
