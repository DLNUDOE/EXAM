/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.task;

import cn.edu.dlnu.doe.app.actions.ExamAction;
import cn.edu.dlnu.doe.app.actions.PaperAction;
import cn.edu.dlnu.doe.app.actions.QuestionAction;
import cn.edu.dlnu.doe.dal.bo.Exam;
import cn.edu.dlnu.doe.dal.bo.StudentAnswer;
import cn.edu.dlnu.doe.dal.relation.ExamStudent;
import cn.edu.dlnu.doe.util.Cache;
import org.apache.log4j.helpers.LogLog;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-24
 * Time: 上午10:55
 */
@SuppressWarnings({"unchecked", "unused"})
public class PrepareExamTask {
    private static final Log log = Logs.getLog(PrepareExamTask.class);
    public static final String ON_GOING_EXAM = "on_going_exam";
    private Cache cache;
    private Dao rDao;
    private Dao wDao;
    private PaperAction paperAction;
    private ExamAction examAction;
    public static final String EXAM_PREFIX = "examinfo_";

    public void prepareExam(final Long examid) {
        try {
            if (null == cache.get(EXAM_PREFIX + examid)) {
                cache.put(EXAM_PREFIX + examid, "preparing", 10);
                Exam exam = examAction.getExam(examid);
                final List<String> stu = new LinkedList<String>();
                List<ExamStudent> es = rDao.query(ExamStudent.class, Cnd.where("examid", "=", examid));
                for (ExamStudent e : es) {
                    stu.add(e.getStudentid());
                }
                Map paper = (Map) paperAction.get(exam.getPaperid());
                List<Map> groups = (List<Map>) paper.get("groups");
                Map<String, Map> questions = (Map<String, Map>) paper.get("questions");
                Map<Long, String> asws = new HashMap<Long, String>();
                Map<Long, Long> allScoreMap = new HashMap<Long, Long>();
                List<Long> objectQuestion = new LinkedList<Long>();
                final List<Long> qids = new LinkedList<Long>();
                for (Map group : groups) {
                    List<Map<String, Long>> scoreMaps = (List<Map<String, Long>>) group.get("scoreMap");
                    for (Map<String, Long> scoreMap : scoreMaps) {
                        Long id = Long.valueOf(scoreMap.get("id") + "");
                        Long score = Long.valueOf(scoreMap.get("score") + "");
                        allScoreMap.put(id, score);
                        Map question = questions.get(String.valueOf(id)); 

                        int type = ((Integer) question.get("type"));
                        if (type != QuestionAction.BLANK_TYPE) {
                            asws.put(id, (String) question.get("answer"));
                        } else {
                            asws.put(id, Json.toJson(question.get("answer")));
                        }
                        if (type == QuestionAction.RADIO_TYPE || type == QuestionAction.CHECKBOX_TYPE || type == QuestionAction.T_F_TYPE) {
                            //单选 多选 判断
                            objectQuestion.add(id);
                        }
                        qids.add(id);
                    }
                }
                //init stu db!
                for (String sid : stu) {
                    for (Long qid : qids) {
                        StudentAnswer sa = new StudentAnswer();
                        sa.setExamid(examid);
                        sa.setStudentid(sid);
                        sa.setQuestionid(qid);
                        if (rDao.count(StudentAnswer.class, Cnd.where("examid", "=", examid).and("studentid", "=", sid).and("questionid", "=", qid)) == 0) {
                            wDao.insert(sa);
                            log.info("create stu:["+sid+"] examid:["+examid+"] in DB");
                        }
                    }
                }

                Map<String, Object> examInfo = new HashMap<String, Object>();
                examInfo.put("score", allScoreMap);
                examInfo.put("asw", asws);
                examInfo.put("obj", objectQuestion);
                examInfo.put("info", exam);
                examInfo.put("qids", qids);
                examInfo.put("stu", stu);
                log.info("put  Examinfo in  memcached "+exam.getId()+" into memcached");
                cache.put(EXAM_PREFIX + exam.getId(), examInfo, exam.getDuration() * 60 + 600);
                Set<Long> onGoingExam = (Set<Long>) cache.get(ON_GOING_EXAM);
                onGoingExam.add(examid);
                cache.put(ON_GOING_EXAM, onGoingExam);
            }
        } catch (Exception e) {
            log.error(e);
        }

    }
//
//    @Override
//    public void run() {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd%");
//        String today = sdf.format(new Date());
//        List<Exam> examList = rDao.query(Exam.class, Cnd.where("starttime", "LIKE", today));
//        for (Exam exam : examList) {
//            if (null == cache.get(EXAM_PREFIX + exam.getId())) {
//                Map paper = (Map) paperAction.get(exam.getPaperid());
//                List<Map> groups = (List<Map>) paper.get("groups");
//                Map<Long, Map> questions = (Map<Long, Map>) paper.get("questions");
//                Map<Long, String> asws = new HashMap<Long, String>();
//                Map<Long, Long> allScoreMap = new HashMap<Long, Long>();
//                List<Long> objectQuestion = new LinkedList<Long>();
//                for (Map group : groups) {
//                    List<Map<String, Long>> scoreMaps = (List<Map<String, Long>>) group.get("scoreMap");
//                    for (Map<String, Long> scoreMap : scoreMaps) {
//                        Long id = scoreMap.get("id");
//                        Long score = scoreMap.get("score");
//                        allScoreMap.put(id, score);
//                        Map question = questions.get(id);
//                        asws.put(id, (String) question.get("answer"));
//                        int type = ((Integer) question.get("type"));
//                        if (type == QuestionAction.RADIO_TYPE || type == QuestionAction.CHECKBOX_TYPE || type == QuestionAction.T_F_TYPE) {
//                            //单选 多选 判断
//                            objectQuestion.add(id);
//                        }
//                    }
//                }
//                Map<String, Object> examInfo = new HashMap<String, Object>();
//                examInfo.put("score", allScoreMap);
//                examInfo.put("asw", asws);
//                examInfo.put("obj", objectQuestion);
//                examInfo.put("info", exam);
//                cache.put(EXAM_PREFIX + exam.getId(), examInfo, 3600 * 18);
//            }
//        }
//    }

    public void setCache(Cache cache) {
        this.cache = cache;
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }

    public void setPaperAction(PaperAction paperAction) {
        this.paperAction = paperAction;
    }

    public void setExamAction(ExamAction examAction) {
        this.examAction = examAction;
    }
}
