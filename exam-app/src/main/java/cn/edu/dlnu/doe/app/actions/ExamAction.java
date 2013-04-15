package cn.edu.dlnu.doe.app.actions;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import cn.edu.dlnu.doe.app.actions.stuexam.StuExamAction;
import cn.edu.dlnu.doe.app.actions.stuexam.StuStat;
import cn.edu.dlnu.doe.app.task.PrepareExamTask;
import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.dal.bo.Exam;
import cn.edu.dlnu.doe.dal.bo.Class;
import cn.edu.dlnu.doe.dal.bo.College;
import cn.edu.dlnu.doe.dal.bo.Course;
import cn.edu.dlnu.doe.dal.bo.Major;
import cn.edu.dlnu.doe.dal.bo.Paper;
import cn.edu.dlnu.doe.dal.bo.Student;
import cn.edu.dlnu.doe.dal.bo.StudentAnswer;
import cn.edu.dlnu.doe.dal.relation.ExamStudent;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.ParamUtil;
import cn.edu.dlnu.doe.util.StringUtil;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.sql.SqlCallback;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Ok("ioc:template")
@Fail("json")
@IocBean
@At("/exam")
@AdaptBy(type = PairAdaptor.class)
@InjectName("examAction")
@SuppressWarnings({ "unchecked", "unused" })
public class ExamAction {
	private static final Log log = Logs.getLog(ExamAction.class);
	private Dao rDao;
	private Dao wDao;
	private StudentAction studentAction;
	private Cache cache;
	private static final String EXAMING = "examing";
	private static final String SIZE = "size";

	@At("/add")
	public Object add(@Param("name") String name, @Param("paperid") Long paperid, @Param("starttime") String starttime,
			@Param("duration") Integer duration, @Param("mintime") Integer mintime, @Param("iprooms") Long[] iprooms,
			@Param("creator") String creator, HttpServletRequest req) throws ParseException {
		checkParam(name, paperid, starttime, duration, mintime, iprooms, creator);
		Exam exam = new Exam();
		exam.setCreateTime(new Date());
		exam.setCreator(creator);
		exam.setDuration(duration);
		exam.setIprooms(longToString(iprooms));
		exam.setMinTime(mintime);
		exam.setName(name);
		Paper paper = rDao.fetch(Paper.class, paperid);
		if (paper == null) {
			throw new RuntimeException("CANT NOT FIND PAPER BY ID:[" + paperid + ']');
		}

		exam.setPaperid(paperid);
		exam.setCourseid(paper.getCid());
		exam.setStartTime(transDate(starttime));
		wDao.insert(exam);
		log.info("Insert a Exam to DB[" + Json.toJson(exam) + "]");
		SessionUtil.removeSession("paperid", req);
		SessionUtil.removeSession("paper", req);
		return exam;

	}

	private Date transDate(String date) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.parse(date);
	}

	@At("/mod")
	public void mod(long id, String name, Long paperid, String startTime, Integer duration, Integer minTime,
			@Param("iproom") Long[] iproom, String creator) throws ParseException {
		checkParam(name, paperid, startTime, duration, minTime, iproom, creator);
		Exam exam = rDao.fetch(Exam.class, id);
		if (null == exam) {
			log.error("CAN NOT FIND Exam BY id:[" + id + "]");
			throw new RuntimeException("CAN NOT FIND Exam BY id:[" + id + "]");
		}
		if (exam.getStatus() != 1) {
			throw new RuntimeException("CANT NOT DELETE A EXAM WHICH STATUS IS NOT [NOT BEGIN]");
		}
		exam.setCreator(creator);
		exam.setDuration(duration);
		exam.setIprooms(longToString(iproom));
		exam.setMinTime(minTime);
		exam.setName(name);
		if (exam.getPaperid() != paperid) {
			Paper paper = rDao.fetch(Paper.class, paperid);
			if (paper == null) {
				throw new RuntimeException("CANT NOT FIND PAPER BY ID:[" + paperid + ']');
			}
			exam.setPaperid(paperid);
			exam.setCourseid(paper.getCid());
		}
		exam.setStartTime(transDate(startTime));
		wDao.update(exam);
		log.info("UPDATE a EXAM to DB[" + Json.toJson(exam) + "]");

	}

	@At("/get")
	public Exam getExam(Long examid) {
		final String PREFIX = "exam_";
		Cache cache = Cache.getInstance();
		Exam exam = (Exam) cache.get(PREFIX + examid);
		if (exam == null) {
			exam = rDao.fetch(Exam.class, examid);
			cache.put(PREFIX + examid, exam, 3600 * 3);
		}
		return exam;
	}

	@At("/list")
	public Object list(@Param("courseid") Long courseid, @Param("key") String key, @Param("page") Integer page,
			@Param("limit") Integer limit) {
		if (ParamUtil.isNull(courseid, page, limit) || page < 1 || limit < 1 || courseid < -1) {
			log.error("PARAM ERROR  page:[" + page + "] limit:[" + limit + "] courseid:[" + courseid + "]");
			throw new RuntimeException("PARAM ERROR  page:[" + page + "] limit:[" + limit + "] courseid:[" + courseid
					+ "]");
		}
		Integer count;
		List<Exam> list;
		Pager pager = rDao.createPager(page, limit);

		if (StringUtil.isEmpty(key)) {
			if (courseid == -1) {
				list = rDao.query(Exam.class, Cnd.orderBy(), pager);
				count = rDao.count(Exam.class, Cnd.orderBy());
			} else {
				list = rDao.query(Exam.class, Cnd.where("courseid", "=", courseid), pager);
				count = rDao.count(Exam.class, Cnd.where("courseid", "=", courseid));
			}

		} else {
			key = "%" + key + "%";
			SqlExpression e1 = Cnd.exps("id", "LIKE", key);
			SqlExpression e2 = Cnd.exps("name", "LIKE", key);
			SqlExpression e3 = Cnd.exps("creator", "LIKE", key);
			SqlExpression e4 = Cnd.exps("courseid", "LIKE", key);
			SqlExpression e5 = Cnd.exps("courseid", "=", key);
			if (courseid == -1) {
				list = rDao.query(Exam.class, Cnd.where(e1).or(e2).or(e3).or(e4), pager);
				count = rDao.count(Exam.class, Cnd.where(e1).or(e2).or(e3).or(e4));
			} else {
				list = rDao.query(Exam.class, Cnd.where(e5).and(Cnd.exps(e1).or(e2).or(e3)), pager);
				count = rDao.count(Exam.class, Cnd.where(e5).and(Cnd.exps(e1).or(e2).or(e3)));
			}
		}
		for (Exam exam : list) {
			rDao.fetchLinks(exam, "courseid");
			exam.setCourse(rDao.fetch(Course.class, exam.getCourseid()));
		}

		log.debug("Got Exam list:[" + Json.toJson(list) + "]");
		log.info("Got Exam list size:[" + list.size() + "]");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("total", count);
		return map;

	}

	@At("/stu/add")
	public void addStudentsToExam(@Param("examid") Long examid, @Param("studentids") String[] studentids,
			@Param("classids") Long classids[]) {

		if (null == examid || (null == studentids && classids == null)) {
			log.error("PARAM ERROR examid:[" + examid + "]+studentid:+[" + Json.toJson(studentids) + "]");
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "]+studentid:+[" + Json.toJson(studentids)
					+ "]");
		}
		if (rDao.fetch(Exam.class, examid) == null) {
			throw new RuntimeException("CAN NOT FIND EXAM BY ID:[" + examid + "]");
		}
		List<String> stuIds = new LinkedList<String>();
		Collections.addAll(stuIds, studentids);
		if (classids != null && classids.length != 0) {
			List<Student> students = rDao.query(Student.class, Cnd.where("classid", "in", classids));
			for (Student s : students) {
				stuIds.add(s.getId());
			}
		}

		for (String sid : stuIds) {
			wDao.insert(new ExamStudent(examid, sid));
		}

	}

	@At("/stu/list")
	public Object getExamStudents(@Param("examid") Long examid, @Param("collegeid") Long collegeid,
			@Param("majorid") Long majorid, @Param("classid") Long classid, @Param("key") String key,
			@Param("page") Integer page, @Param("limit") Integer limit) {
		if (examid == null || examid < 0) {
			throw new RuntimeException("PARAM ERROR examid:[" + examid + ']');
		}
		if (ParamUtil.isNull(collegeid, majorid, classid, key, page, limit) || page < 1 || limit < 1) {
			log.error("PARAM ERROR collegeid:" + collegeid + ",key:" + key + ",page:" + page + ",limit:" + limit);
			throw new RuntimeException("PARAM ERROR collegeid:" + collegeid + ", majorid:" + majorid + ", classid:"
					+ classid + ", key:" + key + ", page:" + page + ", limit:" + limit);
		}
		List<Map> list = new LinkedList<Map>();
		Map<String, Object> examstu = null;
		Sql sql = Sqls.create("select studentid from t_exam_student where examid=@examid");
		sql.params().set("examid", examid);
		int Count = 0;
		Exam exam = rDao.fetch(Exam.class, examid);
		if (exam == null) {
			throw new RuntimeException("對不起，您請求的考試不存在");
		}
		sql.setCallback(new SqlCallback() {
			@Override
			public Object invoke(Connection conn, ResultSet rs, Sql sql) throws SQLException {
				List<String> sidList = new LinkedList<String>();
				while (rs.next()) {
					sidList.add(rs.getString(1));

				}

				return sidList;
			}
		});
		rDao.execute(sql);
		List<String> sidList = sql.getList(String.class);
		List<Student> stuListFirst = rDao.query(Student.class, Cnd.where("id", "in", sidList));
		Map<String, Object> studentlist = (Map<String, Object>) studentAction.list(collegeid, majorid, classid, key,
				page, limit);
		List<Student> stuListSecond = (List<Student>) studentlist.get("list");
		List<Student> stuList = new LinkedList<Student>();
		for (Student studentone : stuListSecond) {
			for (Student studenttwo : stuListFirst) {
				if (studenttwo.getId().equals(studentone.getId())) {
					stuList.add(studentone);
					break;
				}
			}
		}
		Count = stuList.size();
		if (0 != Count) {
			for (Student student : stuList) {
				student.setPassword(null);
				examstu = new HashMap<String, Object>();
				examstu.put("stuid", student.getId());
				examstu.put("name", student.getName());
				examstu.put("collegename", student.getCollege().getName());
				examstu.put("clazz", student.getClazz().getName());
				examstu.put("major", student.getMajor().getName());
				examstu.put("status", rDao.fetchx(ExamStudent.class, examid, student.getId()).getStatus());
				list.add(examstu);
			}
		}
		Map<String, Object> res = new HashMap<String, Object>();
		res.put("list", list);
		res.put("total", Count);
		return res;
	}

	@At("/stu/del")
	public void delStudent(@Param("examid") Long examid, @Param("stuid") String stuid) {
		Condition cnd;
		SqlExpression e1 = Cnd.exps("examid", "=", examid);
		SqlExpression e2 = Cnd.exps("studentid", "=", stuid);
		cnd = Cnd.where(e1).and(e2);
		if (rDao.count(ExamStudent.class, cnd) == 0) {
			throw new RuntimeException("本厂考试，该学生没有参加");

		} else {
			wDao.deletex(ExamStudent.class, examid, stuid);

		}

	}

	@At("/stu/toadd")
	public Object getStuToAdd(@Param("collegeid") Long collegeid, @Param("majorid") Long majorid,
			@Param("classid") Long classid, @Param("key") String key, @Param("page") Integer page,
			@Param("limit") Integer limit, @Param("examid") Long examid) {
		if (examid == null || examid < 0) {
			throw new RuntimeException("Param Error examid:[" + examid + ']');
		}
		Map<String, Object> res = (Map<String, Object>) studentAction.list(collegeid, majorid, classid, key, page,
				limit);
		List<Student> stuList = (List<Student>) res.get("list");
		Sql sql = Sqls.create("select studentid from t_exam_student where examid=@examid");
		sql.params().set("examid", examid);
		sql.setCallback(new SqlCallback() {
			@Override
			public Object invoke(Connection conn, ResultSet rs, Sql sql) throws SQLException {
				List<String> sidList = new LinkedList<String>();
				while (rs.next())
					sidList.add(rs.getString(0));
				return sidList;
			}
		});
		rDao.execute(sql);
		List<String> sidList = sql.getList(String.class);
		Set<String> sidSet = new HashSet<String>();
		sidSet.addAll(sidList);
		Integer count = (Integer) res.get("total");
		int c = 0;
		for (Student s : stuList) {
			if (sidSet.contains(s.getId())) {
				stuList.remove(c);
				count--;
			}
			c++;
		}
		res.put("list", stuList);
		res.put("total", count);
		return res;
	}

	@At("/examing/addstu")
	public void examingAdd(@Param("examid") Long examid, @Param("studentids") String[] studentids,
			@Param("classids") Long[] classids) {
		SqlExpression e1 = Cnd.exps("examid", "=", examid);
		Map examInfo = (Map) cache.get(PrepareExamTask.EXAM_PREFIX + examid);
		List<Long> qis = (List<Long>) examInfo.get("qids");
		List<String> student = new LinkedList<String>();
		student = (List<String>) examInfo.get("stu");
		if (null == examInfo) {
			throw new RuntimeException("对不起 本场考试已经结束！添加了也不能考！");
		}

		for (int i = 0; i < studentids.length; i++) {
			int count = rDao.count(ExamStudent.class, Cnd.where(e1).and(Cnd.exps("studentid", "=", studentids[i])));
			log.debug("===========================count:" + count);
			Student stu = rDao.fetch(Student.class, studentids[i]);
			examInfo.put("stu", student);
			if (count == 0 && stu != null) {
				student.add(studentids[i]);
				examInfo.put("stu",student);
				addStudentsToExaming(examid, studentids[i], classids[i]);
				for (Long qid : qis) {
					StudentAnswer sa = new StudentAnswer();
					sa.setExamid(examid);
					sa.setStudentid(studentids[i]);
					sa.setQuestionid(qid);
					if (rDao.count(
							StudentAnswer.class,
							Cnd.where("examid", "=", examid).and("studentid", "=", studentids[i])
									.and("questionid", "=", qid)) == 0) {
						wDao.insert(sa);
						log.info("create stu:[" + studentids[i] + "] examid:[" + examid + "] in DB");
					}
				}
			}
		}
		log.debug("testtest" + Json.toJson(examInfo));
	}

	@At("/examing")
	@GET
	public Object getExaming(@Param("page") Integer page, @Param("limit") Integer limit) {
		if (page == null || limit == null || page < 0 || limit < 0) {
			log.error("PARAM ERROR page:" + page + "+limit:+" + limit + "");
			throw new RuntimeException("PARAM ERROR page:" + page + "");
		}
		boolean flag = false;
		Pager pager = rDao.createPager(page, limit);
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd%");
		String starttime = format.format(new Date());
		SqlExpression e1 = Cnd.exps("starttime", "LIKE", starttime);
		List<Exam> exam = rDao.query(Exam.class, Cnd.where(e1), pager);
		Map<String, Object> res = new HashMap<String, Object>();
		Map<String, Object> total = new HashMap<String, Object>();
		List<Map> list = new LinkedList<Map>();
		if (null == cache.get(SIZE)) {
			cache.put(SIZE, exam.size());
		} else {
			if (exam.size() != (Integer) cache.get(SIZE)) {
				cache.put(SIZE, exam.size());
				flag = true;
			}
		}
		for (Exam examlist : exam) {
			if (examlist.getStartTime().getTime() + examlist.getDuration() * 60000 + 180000 < new Date().getTime()) {
				if (examlist.getStatus() != 3) {
					examlist.setStatus(3);
					wDao.update(examlist);
					flag = true;
				}
			}
			if (examlist.getStartTime().before(new Date())
					&& (examlist.getStartTime().getTime() + examlist.getDuration() * 60000 + 180000 > new Date()
							.getTime())) {
				if (examlist.getStatus() != 2) {
					examlist.setStatus(2);
					wDao.update(examlist);
					flag = true;
				}
			}
		}
		if (flag) {
			if (null != cache.get(EXAMING)) {
				cache.del(EXAMING);
			}
		}

		int count = rDao.count(Exam.class, Cnd.where(e1));
		if (exam == null) {
			throw new RuntimeException("今日没有考试");
		} else {
			if (null == cache.get(EXAMING)) {
				for (Exam examuse : exam) {
					Map<String, Object> examMap = new HashMap<String, Object>();
					Paper paper = rDao.fetch(Paper.class, examuse.getPaperid());
					examMap.put("id", examuse.getId());
					examMap.put("name", examuse.getName());
					examMap.put("duration", examuse.getDuration());
					examMap.put("startTime", examuse.getStartTime());
					examMap.put("creator", examuse.getCreator());
					examMap.put("status", examuse.getStatus());
					examMap.put("papername", paper.getTitle());
					list.add(examMap);
				}
				res.put("list", list);
				res.put("total", count);
				cache.put(EXAMING, res);
			} else {
				res = (Map<String, Object>) cache.get(EXAMING);
			}

		}
		return res;
	}

	private void addStudentsToExaming(Long examid, String studentid, Long classid) {

		if (null == examid || (null == studentid && classid == null)) {
			log.error("PARAM ERROR examid:[" + examid + "]+studentid:+[" + Json.toJson(studentid) + "]");
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "]+studentid:+[" + Json.toJson(studentid)
					+ "]");
		}
		Exam exam = rDao.fetch(Exam.class, examid);
		if (exam.getStartTime().getTime() + exam.getDuration() * 60000 + 10000 < new Date().getTime()) {
			throw new RuntimeException("对不起 本场考试已经结束！添加了也不能考！");
		}
		if (exam == null) {
			throw new RuntimeException("CAN NOT FIND EXAM BY ID:[" + examid + "]");
		}
		if (classid != null) {
			int count = rDao.count(Student.class, Cnd.where("classid", "=", classid));
			if (0 != count) {
				wDao.insert(new ExamStudent(examid, studentid));
			}

		}

	}

	private String longToString(Long[] rooms) {
		String iproom = "";
		int k = rooms.length;
		for (int i = 0; i < k - 1; i++) {
			iproom = iproom + rooms[i].toString() + ",";
		}
		iproom = iproom + rooms[k - 1].toString();
		return iproom;
	}

	private void checkParam(String name, Long paperid, String startTime, Integer duration, Integer minTime,
			Long[] iproom, String creator) {
		if (null == name || null == paperid || null == startTime || null == duration || null == minTime
				|| null == iproom || paperid < 0 || duration <= 0) {
			log.error("PARAM ERROR name:[" + name + "]  paperid: [" + paperid + "] startTime:[" + startTime
					+ "]  duration:[" + duration + "]  mintime:[" + minTime + "] iproom:[" + iproom + "]+creator:["
					+ creator + "]");
			throw new RuntimeException("PARAM ERROR name:[" + name + "]  paperid: [" + paperid + "] startTime:["
					+ startTime + "]  duration:[" + duration + "]  mintime:[" + minTime + "] iproom:[" + iproom
					+ "]+ creator:[" + creator + "]");
		}
		if (duration < minTime) {
			log.error("考试时间不能小于至少答题时间");
			throw new RuntimeException("考试时间不能小于至少答题时间");
		}

	}

	@At("/cheating")
	public void cheating(Long examid, String studentid, Integer status) {
		if (null == examid || null == studentid || null == status) {
			log.debug("examid:" + '[' + examid + ']' + "studentid:" + '[' + studentid + ']');
			throw new RuntimeException("请输入考试的id和stuentid");
		}
		Exam exam = rDao.fetch(Exam.class, examid);
		if (null == exam) {
			throw new RuntimeException("對不起，你請求的考試不存在");
		}
		if (exam.getStartTime().getTime() + exam.getDuration() * 60000 + 180000 < new Date().getTime()) {
			throw new RuntimeException("对不起本场考试已经结束，不能更改学生状态了");
		}
		studentid = studentid.trim();
		ExamStudent es = rDao.fetch(ExamStudent.class, Cnd.where("examid", "=", examid)
				.and("studentid", "=", studentid));
		if (null == es) {
			throw new RuntimeException("对不起您要操作的考生不在本场考试中，请查看本场考生信息后继续操作");
		}
		if (status.equals(StuStat.EXAMING)) {
			cache.put(StuExamAction.STU_STAT_PREFIX + examid + "_" + studentid, StuStat.CHEATING);
			es.setStatus(StuStat.CHEATING);
			log.info("CHANGE student status to [" + StuStat.CHEATING + ']');
		} else {
			if (status.equals(StuStat.CHEATING)) {
				cache.put(StuExamAction.STU_STAT_PREFIX + examid + "_" + studentid, StuStat.EXAMING);
				es.setStatus(StuStat.EXAMING);
				log.info("CHANGE student status to [" + StuStat.EXAMING + ']');
			}
		}
		wDao.update(es);
	}

	public Dao getrDao() {
		return rDao;
	}

	public void setrDao(Dao rDao) {
		this.rDao = rDao;
	}

	public Dao getwDao() {
		return wDao;
	}

	public void setwDao(Dao wDao) {
		this.wDao = wDao;
	}

}
