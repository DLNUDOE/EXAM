/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.task;

import cn.edu.dlnu.doe.app.actions.stuexam.StuExamAction;
import cn.edu.dlnu.doe.app.actions.stuexam.StuStat;
import cn.edu.dlnu.doe.dal.bo.StudentAnswer;
import cn.edu.dlnu.doe.queue.RQueue;
import cn.edu.dlnu.doe.redis.RedisClient;
import cn.edu.dlnu.doe.util.Cache;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import java.util.List;
import java.util.Map;
import java.util.TimerTask;

/**
 * Created with IntelliJ IDEA. User: upupxjg Date: 13-3-24 Time: 下午5:10
 */

public class SyncAswToDBTask extends TimerTask {
	private Cache cache;
	private Dao wDao;
	private StuExamAction stuExamAction;
	private RQueue queue;
	private RedisClient redisClient;
	private static final Log log = Logs.getLog(SyncAswToDBTask.class);

	@Override
	public void run() {
		log.info("===================[start sync asw thread...]====================");
		while (true) {
			try {
				String examStuStr = queue.pop(RQueue.EXAM_STU_TO_CMT);
				if (null == examStuStr) {
					log.error("GET ERROR WHEN Sync ASW exiting");
					return;
				}
				log.debug("========GET FROM REDIS EXAM STUDENT ANSWER:[" + examStuStr + "]===========");
				String exam_stu[] = examStuStr.split("_");
				if (exam_stu.length == 2) {
					sync(Long.valueOf(exam_stu[0]), exam_stu[1]);
				} else {
					log.error("=============GET INVAILD DATA FROM REDIS :[" + examStuStr + "}======");
					return;
				}


			} catch (Exception e) {
				log.error(e);
				return;
			}
		}
	}

private void sync(Long examid, String sid) {
		log.info(String.format("===============  start answer sync (exam:[%d] stu[%s])  ===============", examid, sid));
		Map examInfo = (Map) cache.get(PrepareExamTask.EXAM_PREFIX + examid);
		List<Long> qids = (List<Long>) examInfo.get("qids");
		for (Long qid : qids) {
			StudentAnswer sa = new StudentAnswer();
			String asw = redisClient.get(examid + "_" + sid + "_" + qid);
			sa.setAnswer(asw);
			sa.setExamid(examid);
			sa.setStudentid(sid);
			sa.setQuestionid(qid);
			wDao.update(sa);
			log.info(String.format("get answer:[%s] by examid:[%d] studentid:[%s] questionid:[%d]", asw, examid, sid,
					qid));
		}
		// Sql sql =
		// Sqls.create("update t_exam_student set status=@status where studentid=@sid and examid=@eid");
		// sql.params().set("status", StuStat.COMMITTED);
		// sql.params().set("sid", sid);
		// sql.params().set("eid", examid);
		// wDao.execute(sql);
	}

	// public void run() {
	// log.info("===============  start answer sync  ===============");
	// Set<Long> onGoingExam = (Set<Long>)
	// cache.get(PrepareExamTask.ON_GOING_EXAM);
	// for (Long examid : onGoingExam) {
	// Map examInfo = (Map) cache.get(PrepareExamTask.EXAM_PREFIX + examid);
	// if (null == examInfo) {
	// onGoingExam.remove(examid);
	// } else {
	// List<Long> qids = (List<Long>) examInfo.get("qids");
	// List<String> stu = (List<String>) examInfo.get("qids");
	// for (String s : stu) {
	// Integer status = stuExamAction.getStatus(s);
	// if (!status.equals(StuStat.COMMITTED) &&
	// !status.equals(StuStat.CHEATING)) {
	// for (Long qid : qids) {
	// String asw = (String) cache.get(examid + '_' + s + '_' + qid);
	// if (asw != null) {
	// StudentAnswer sa = new StudentAnswer();
	// sa.setExamid(examid);
	// sa.setStudentid(s);
	// sa.setQuestionid(qid);
	// sa.setAnswer(asw);
	// wDao.update(sa);
	//
	// }
	// }
	// }
	// }
	// log.info("==== sync exam:[" + examid + "] answer to DB ====");
	// }
	// }
	// log.info("===============  start answer sync  ===============");
	// }

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	public void setwDao(Dao wDao) {
		this.wDao = wDao;
	}

	public void setStuExamAction(StuExamAction stuExamAction) {
		this.stuExamAction = stuExamAction;
	}

	public void setQueue(RQueue queue) {
		this.queue = queue;
	}
}
