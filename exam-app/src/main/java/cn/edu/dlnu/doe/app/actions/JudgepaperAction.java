package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.dal.bo.StudentAnswer;
import cn.edu.dlnu.doe.dal.relation.ExamStudent;
import cn.edu.dlnu.doe.util.ParamUtil;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
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
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA. User: Cheshun Date: 13-3-27 Time: 下午12:26
 */

@Ok("ioc:template")
@Fail("ioc:errorjson")
@IocBean
@At("/judge")
@AdaptBy(type = PairAdaptor.class)
@InjectName("judgepaperAction")
public class JudgepaperAction {
	private static final Log log = Logs.getLog(JudgepaperAction.class);
	private Dao rDao;
	private Dao wDao;

    @At("/students")
    public Object getStudents (Long collegeid, Long majorid, Long classid, Long examid, Integer status) {

        if (ParamUtil.isNull(collegeid, majorid, classid, examid, status)) {
            log.error("PARAM ERROR collegeid:[" + collegeid + "], majorid:[" + majorid + "], classid:[" + classid + "], examid:[" + examid + "], status:[" + status + "]");
            throw new RuntimeException("PARAM ERROR collegeid:[" + collegeid + "], majorid:[" + majorid + "], classid:[" + classid + "], examid:[" + examid + "], status:[" + status + "]");
        }

        //查询某场考试对应学院、专业、班级的学生
        Sql sql = Sqls.create("SELECT t_student.id from t_student, t_exam_student WHERE t_student.id=t_exam_student.studentid AND t_exam_student.examid=@examid" +
                " AND t_student.collegeid=@collegeid AND t_student.majorid=@majorid " +
                " AND t_student.classid=@classid AND t_exam_student.status=@status");
        sql.params().set("examid", examid);
        sql.params().set("collegeid", collegeid);
        sql.params().set("majorid", majorid);
        sql.params().set("classid", classid);
        sql.params().set("status", status);
        sql.setCallback(new SqlCallback() {

            @Override
            public Object invoke(Connection conn, ResultSet resultSet, Sql sql) throws SQLException {
                List<String> students = new ArrayList<String>();
                while (resultSet.next()) {
                    students.add(resultSet.getString("id"));
                }
                return students;
            }
        });
        rDao.execute(sql);
        return sql.getList(String.class);
    }

	@At("/answers")
	public Object getAnswers(@Param("examid") Long examid, @Param("studentid") String studentid) {
		if (ParamUtil.isNull(examid, studentid)) {
			log.error("PARAM ERROR examid:[" + examid + "], studentid:[" + studentid + "]");
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "], studentid:[" + studentid + "]");
		}
		SqlExpression e1 = Cnd.exps("examid", "=", examid);
		SqlExpression e2 = Cnd.exps("studentid", "=", studentid);
		List<StudentAnswer> studentAnswers = rDao.query(StudentAnswer.class, Cnd.where(e1).and(e2));
		Map<Long, String> map = new HashMap<Long, String>();
		if (null != studentAnswers && !studentAnswers.isEmpty()) {
			for (StudentAnswer answer : studentAnswers) {
				map.put(answer.getQuestionid(), answer.getAnswer());
			}
		}
		log.debug("testeste" + Json.toJson(map));
		return map;
	}

	@SuppressWarnings("unchecked")
	@At("/score")
	public void addScore(@Param("examid") Long examid, @Param("studentid") String studentid,
			@Param("questionid") Long questionid, @Param("score") Integer score) {
		if (ParamUtil.isNull(examid, studentid, questionid, score)||examid<=0||questionid<=0||score<0) {
			log.error("PARAM ERROR examid:[" + examid + "], studentid:[" + studentid + "], qusetionid:[" + questionid
					+ "], score:[" + score + "]");
			throw new RuntimeException("PARAM ERROR examid:[" + examid + "], studentid:[" + studentid
					+ "], qusetionid:[" + questionid + "], score:[" + score + "]");
		}
		SqlExpression e1 = Cnd.exps("examid", "=", examid);
		SqlExpression e2 = Cnd.exps("studentid", "=", studentid);
		List<ExamStudent> examStudents = rDao.query(ExamStudent.class, Cnd.where(e1).and(e2));
		if (null == examStudents || examStudents.isEmpty()) {
			return;
		}
		ExamStudent examStudent = examStudents.get(0);
		String eachquestion = examStudent.getEachquestionMark();
		Map<String, Integer> map;
		if (null == eachquestion || eachquestion.isEmpty()) {
			map = new HashMap<String, Integer>();
		} else {
			map = (Map<String, Integer>) Json.fromJson(eachquestion);
		}
		map.put(questionid.toString(), score);
		int scoresum = 0;
		for (String qid : map.keySet()) {
			scoresum += map.get(qid);
		}
		examStudent.setEachquestionMark(Json.toJson(map));
		examStudent.setSubjectiveMark(scoresum);
		wDao.update(examStudent);
	}

	
	public void setrDao(Dao rDao) {
		this.rDao = rDao;
	}

	public void setwDao(Dao wDao) {
		this.wDao = wDao;
	}

}
