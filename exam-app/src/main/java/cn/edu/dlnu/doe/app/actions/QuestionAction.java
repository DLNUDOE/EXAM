package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.app.util.PathUtil;
import cn.edu.dlnu.doe.biz.tag.TagTip;
import cn.edu.dlnu.doe.dal.bo.Question;
import cn.edu.dlnu.doe.util.ParamUtil;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.*;
import org.nutz.mvc.upload.TempFile;
import org.nutz.mvc.upload.UploadAdaptor;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/question")
@AdaptBy(type = PairAdaptor.class)
@InjectName("questionAction")
@SuppressWarnings({"unchecked", "unused"})
public class QuestionAction {

    public static final int BLANK_TYPE = 3;
    public static final int RADIO_TYPE = 1;
    public static final int T_F_TYPE = 4;
    public static final int OBJ_TYPE = 5;
    public static final int CHECKBOX_TYPE = 2;
    public static final int OTHER_TYPE = 6;
    private static final Log log = Logs.getLog(QuestionAction.class);
    private Dao rDao;
    private Dao wDao;
    private PathUtil pathUtil;
    private TagTip tagTip;

    @At("/add")
    @POST
    public Object add(@Param("type") Integer type, @Param("stem") String stem, @Param("kp") String[] kp, @Param("answer") String answer, @Param("courseid") Long courseid) {
    	
        checkParam(type, stem, kp, answer, courseid);
        Question question = new Question();
        question.setType(type);
        question.setStem(stem);
        question.setKp(kpToString(kp));
        question.setAnswer(answer);
        question.setCourseid(courseid);

        wDao.insert(question);
        return question;
    }

    @At("/mod")
    @POST
    public void mod(Long id, Integer type, String stem, String[] kp, String answer, Long courseid) {

        if (null == id || id < 0) {
            log.error("PARAM ERROR : id:" + id);
            throw new RuntimeException("PARAM ERROR : id:" + id);
        }
        checkParam(type, stem, kp, answer, courseid);

        Question question = rDao.fetch(Question.class, id);
        if (null == question) {
            log.error("CAN NOT FIND QUESTION BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND QUESTION BY ID:[" + id + "]");
        }

        question.setId(id);
        question.setType(type);
        question.setStem(stem);
        question.setKp(kpToString(kp));
        question.setAnswer(answer);
        question.setCourseid(courseid);

        wDao.update(question);
        log.info("UPDATE a Question to DB[" + Json.toJson(question) + "]");
    }

    @At("/del")
    @POST
    public void del(Long id) {

        if (null == id || id < 0) {
            log.error("PARAM ERROR : id:" + id);
            throw new RuntimeException("PARAM ERROR : id:" + id);
        }
        if (1 != wDao.delete(Question.class, id)) {
            log.error("CAN NOT FIND QUESTION BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND QUESTION BY ID:[" + id + "]");
        }
    }

    @At("/list")
    @GET
    public Object list(@Param("type") Integer type, @Param("courseid") Long courseid, @Param("key") String key, @Param("page") Integer page, @Param("limit") Integer limit) {

        if (ParamUtil.isNull(type, courseid, page, limit) || page.intValue() < 1 || limit.intValue() < 0) {
            log.error("PARAM ERROR : type:" + type + "courseid:" + courseid + "page:" + page + "limit:" + limit);
            throw new RuntimeException("PARAM ERROR : type:" + type + "courseid:" + courseid + "page:" + page + "limit:" + limit);
        }

        List<Question> list = null;
		Integer count = 0;
		Pager pager = rDao.createPager(page, limit);
		
		SqlExpression etype = Cnd.exps("type", "=", type);
		SqlExpression ecourseid = Cnd.exps("courseid", "=", courseid);
		
		if(key.trim().equalsIgnoreCase("")){
			if(-1 == type){
				if(-1 == courseid){
					list = rDao.query(Question.class, Cnd.orderBy().desc("id"), pager);
					count = rDao.count(Question.class);
				}else{
					list = rDao.query(Question.class, Cnd.where(ecourseid).desc("id"), pager);
					count = rDao.count(Question.class, Cnd.where(ecourseid));
				}
			}else{
				if(-1 == courseid){
					list = rDao.query(Question.class, Cnd.where(etype).desc("id"), pager);
					count = rDao.count(Question.class, Cnd.where(etype));
				}else{
					list = rDao.query(Question.class, Cnd.where(ecourseid).and(etype).desc("id"), pager);
					count = rDao.count(Question.class, Cnd.where(ecourseid).and(etype));
				}
			}
		}else{
			key = "%" + key.trim() + "%";
			SqlExpression ekey1 = Cnd.exps("stem", "like", key);
			SqlExpression skey2 = Cnd.exps("kp", "like", key);
			if(-1 == type){
				if(-1 == courseid){
					list = rDao.query(Question.class, Cnd.where(ekey1).or(skey2).desc("id"), pager);
					count = rDao.count(Question.class, Cnd.where(ekey1).or(skey2));
				}else{
					list = rDao.query(Question.class, Cnd.where(ecourseid).and(Cnd.exps(ekey1).or(skey2)).desc("id"), pager);
					count = rDao.count(Question.class, Cnd.where(ecourseid).and(Cnd.exps(ekey1).or(skey2)));
				}
			}else{
				if(-1 == courseid){
					list = rDao.query(Question.class, Cnd.where(etype).and(Cnd.exps(ekey1).or(skey2)).desc("id"), pager);
					count = rDao.count(Question.class, Cnd.where(etype).and(Cnd.exps(ekey1).or(skey2)));
				}else{
					list = rDao.query(Question.class, Cnd.where(ecourseid).and(etype).and(Cnd.exps(ekey1).or(skey2)).desc("id"), pager);
					count = rDao.count(Question.class, Cnd.where(ecourseid).and(etype).and(Cnd.exps(ekey1).or(skey2)));
				}
			}
		}
		
		log.debug("Got Question list:[" + Json.toJson(list) + "]");
		log.info("Got Question list size:[" + list.size() + "]");
		
		Map<String, Object> res = new HashMap<String, Object>();
		res.put("list", list);
		res.put("total", count);
		return res;
    }

    @At("/add/batch")
    @AdaptBy(type = UploadAdaptor.class, args = {"ioc:fileUpload"})
    public Object batch (@Param("xls")TempFile tempFile) {
        File file = tempFile.getFile();
        Workbook workbook = null;
        WritableWorkbook errbook = null;
        String filename = "errQuestions" + System.currentTimeMillis() + ".xls";
        String path = pathUtil.getPath("/download") + "/";
        File errfile = new File(path + filename);
        try {
            workbook = Workbook.getWorkbook(file);
            errbook = Workbook.createWorkbook(errfile, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (BiffException e) {
            e.printStackTrace();
        }
        jxl.Sheet sheet = workbook.getSheet(0);
        WritableSheet errsheet = errbook.getSheet(0);
        int errNum = 1;
        int rowNum = sheet.getRows();
        int count = 0;
        for (int i = 1; i < rowNum; i++) {
            
        }

        return null;
    }

    public static final Map<String,Object> Qustion2Map(Question q){
        Map<String,Object> map = new HashMap<String, Object>();
        map.put("id",q.getId());
        map.put("type",q.getType());
        map.put("crouseid",q.getCourseid());
        map.put("kp",q.getKp().split(","));
        if (q.getType().intValue() == BLANK_TYPE){
            List<String> aswList = (List<String>) Json.fromJson(q.getAnswer());
            map.put("answer",aswList);
        }else{
            map.put("answer",q.getAnswer());
        }
        map.put("stem",Json.fromJson(q.getStem()));

        return  map;
    }

    @At("/kp/tip")
    public Object kpTip(String word){
        return tagTip.search(word);
    }

    public String kpToString(String[] kp){
    	int i;
    	StringBuffer kpString = new StringBuffer();
    	for(i=0; i<kp.length-1; i++){
    		kpString.append(kp[i]).append(",");
            tagTip.addToSet(kp[i]);
    	}
    	kpString.append(kp[i]);
        return kpString.toString();
    }
    
    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }

    public void setPathUtil(PathUtil pathUtil) {
        this.pathUtil = pathUtil;
    }

    public void checkParam(Integer type, String stem, String[] kp, String answer, Long courseid) {
        if (ParamUtil.isNull(type, stem, answer, courseid) || ParamUtil.isEmpty(stem, answer) || type.intValue() < 1 || type.intValue() > 6 || kp.length < 1) {
            log.error("PARAM ERROR : type:" + type + "stem:" + stem + "kp:" + kp + "answer:" + answer + "courseid:" + courseid);
            throw new RuntimeException("PARAM ERROR : type:" + type + "stem:" + stem + "kp:" + kp + "answer:" + answer + "courseid:" + courseid);
        }
    }

   public void setTagTip(TagTip tagTip) {
        this.tagTip = tagTip;
    }
}
