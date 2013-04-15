package cn.edu.dlnu.doe.app.actions;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.AdaptBy;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Fail;
import org.nutz.mvc.annotation.GET;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.Param;

import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.dal.bo.Exam;
import cn.edu.dlnu.doe.dal.bo.Paper;
import cn.edu.dlnu.doe.dal.bo.StudentAnswer;
import cn.edu.dlnu.doe.dal.relation.ExamStudent;
import cn.edu.dlnu.doe.util.Cache;


@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/check")
@AdaptBy(type = PairAdaptor.class)
@InjectName("checkPaperAction")
public class CheckPaperAction {
	
	private static final Log log = Logs.getLog(CheckPaperAction.class);
	
	private Dao rDao;
	private Cache cache;
    
    @At("/exams")
    @GET
    public Object getExams(@Param("page") Integer page, @Param("limit") Integer limit, HttpServletRequest req){
    	
    	String stuid = (String) SessionUtil.getFromSession("userid", req);
   
    	if(null == stuid || stuid.equals("")){
    		log.error("PARAM ERROR stuid:[" + stuid + "]");
    		throw new RuntimeException("PARAM ERROR stuid:[" + stuid + "]");
    	}
    	
    	Pager pager = rDao.createPager(page, limit);
    	Integer total = null;
    	
    	List<ExamStudent> examStudentList = rDao.query(ExamStudent.class, Cnd.where("studentid", "=", stuid), pager);
    	total = rDao.count(ExamStudent.class, Cnd.where("studentid", "=", stuid));
    	
    	List<Map<String, Object>> examList = new ArrayList<Map<String,Object>>();
    	
    	Exam exam;
    	
    	for (ExamStudent examStudent : examStudentList) {
    		Map<String, Object> exams = new HashMap<String, Object>();
    		exam = rDao.fetch(Exam.class, Cnd.where("id", "=", examStudent.getExamid()));
    		
    		Date startTime = exam.getStartTime();
    		Date nowTime = new Date();
    		
    		if(exam != null && (nowTime.getTime()-startTime.getTime()>exam.getDuration()*60*10+10*60*1000)){
    			exams.put("examid", examStudent.getExamid());
        		exams.put("score", examStudent.getObjectiveMark() + examStudent.getSubjectiveMark());
        		exams.put("name", exam.getName());
        		exams.put("startTime", exam.getStartTime());
        		exams.put("duration", exam.getDuration());
    			examList.add(exams);
    		}
		}
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("list", examList);
    	map.put("total", total);
    	return map;
    }
    
	@SuppressWarnings("unchecked")
	@At("/paper/content")
    @GET
    public Object getPaperContent(@Param("examid") Long examid, HttpServletRequest req){
    		
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String examtime = df.format(new Date());
		examtime = "%" + examtime + "%";
		
		if(null != rDao.fetch(Exam.class, Cnd.where("startTime", "like", examtime))){
			log.error("TODAY HAS EXAM, CONT SEE PAPER");
			throw new RuntimeException("TODAY HAS EXAM, CONT SEE PAPER");
		}
		
    	final String CHECK_PAPER_HEADER = "doe_check_paper_";
        final int DEFUALT_PAPER_TIME = 3600 * 4; //4hours
        
        if (null == examid || examid < 0) {
            log.error("PARAM ERROR: examid:[" + examid + "]");
            throw new RuntimeException("PARAM ERROR: examid:[" + examid + "]");
        }
        
        Exam exam = rDao.fetch(Exam.class, Cnd.where("id", "=", examid));
        if(null == exam){
        	log.error("CONT FOUND EXAM BY ID:[" + examid + "] ");
        	throw new RuntimeException("CONT FOUND EXAM BY ID:[" + examid + "] ");
        }
        Long paperid = exam.getPaperid();
        
        String stuid = null;
        stuid = (String) SessionUtil.getFromSession("userid", req);
        
        if(null == stuid){
        	log.error("请从学生端登陆");
        	throw new RuntimeException("请从学生端登陆");
        }
        
        String key = CHECK_PAPER_HEADER + paperid + "_" + stuid;
        Map<String, Object> paperMap = null;
        
        paperMap = (Map<String, Object>) cache.get(key);
        
        if (null != paperMap) {
            return paperMap;
        }
       
        Paper paper = rDao.fetch(Paper.class, paperid);
        if (null == paper) {
            log.error("CAN NOT FIND PAPER BY ID [" + paperid + "]");
            throw new RuntimeException("CAN NOT FIND PAPER BY ID [" + paperid + "]");
        }
        paperMap = new LinkedHashMap<String, Object>();

        paperMap.put("id", paper.getId());
        paperMap.put("title", paper.getTitle());

        paperMap.put("groups", Json.fromJson(List.class, paper.getGroups()));
        paperMap.put("questions", Json.fromJson(Map.class, paper.getQuestions()));
        paperMap.put("score", paper.getScore());
        List<StudentAnswer>  studentAnswers = null;
        
        studentAnswers = rDao.query(StudentAnswer.class, Cnd.where("examid", "=", examid).and("studentid", "=", stuid));
        
        Map<Object, Object> answerMap = new HashMap<Object, Object>();
        for (StudentAnswer studentAnswer : studentAnswers) {
        	
        	answerMap.put(studentAnswer.getQuestionid(), studentAnswer.getAnswer());
		}
        paperMap.put("myanswer", answerMap);
        
        cache.put(key, paperMap, DEFUALT_PAPER_TIME);
    	return paperMap;
    }
    
    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

}
