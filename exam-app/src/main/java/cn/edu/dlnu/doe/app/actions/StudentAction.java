package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.app.actions.stuexam.StuStat;
import cn.edu.dlnu.doe.app.util.IpUtil;
import cn.edu.dlnu.doe.app.util.PathUtil;
import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.dal.bo.Class;
import cn.edu.dlnu.doe.dal.bo.College;
import cn.edu.dlnu.doe.dal.bo.Major;
import cn.edu.dlnu.doe.dal.bo.Student;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.MD5Util;
import cn.edu.dlnu.doe.util.ParamUtil;
import cn.edu.dlnu.doe.util.PropertiesReader;
import jxl.Workbook;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.read.biff.BiffException;
import jxl.write.*;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.adaptor.VoidAdaptor;
import org.nutz.mvc.annotation.*;
import org.nutz.mvc.upload.TempFile;
import org.nutz.mvc.upload.UploadAdaptor;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.lang.Boolean;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Ok("ioc:template")
@Fail("ioc:errorjson")
@IocBean
@At("/student")
@AdaptBy(type = PairAdaptor.class)
@InjectName("studentAction")
@SuppressWarnings({"unchecked", "unused"})
public class StudentAction {
    private static final Log log = Logs.getLog(StudentAction.class);

    public static final String SID_IP_M = "sid_ip";
    private Dao rDao;
    private Dao wDao;
    private PathUtil pathUtil;
    private Cache cache;
    private PaperAction paperAction;

    @At("/add") 
    public Object add(String id, String name, Long collegeid, Long majorid, Long classid) {
        checkParam(id, name, collegeid, majorid, classid);
        String password = Student.DEFAULTPASSWD;
        password = MD5Util.generalMD5E2(password);
        Integer complete = Student.COMP_NO;
        Student student = setStudent(id, name, password, collegeid, majorid, classid, null, null, complete);

        student = wDao.insert(student);
        log.info("Insert a Student to DB[" + Json.toJson(student) + "]");
        return student;
    }

    @At("/mod")
    public void mod(String id, String name, String password, Long collegeid, Long majorid, Long classid, String email, String img) {
        Integer complete;
        complete = checkParam(id, name, password, collegeid, majorid, classid, email, img);
        Student student = rDao.fetch(Student.class, id);
        if (null == student) {
            log.error("CAN NOT FIND STUDENT BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND STUDENT BY ID:[" + id + "]");
        }
        password = MD5Util.generalMD5E2(password);
        student = setStudent(id, name, password, collegeid, majorid, classid, email, img, complete);

        wDao.update(student);
        log.info("UPDATE a Student to DB[" + Json.toJson(student) + "]");
    }

    @At("/del")
    public void del(String id) {
        if (null == id || ParamUtil.isEmpty(id)) {
            log.error("PARAM ERROR id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR id:[" + id + "]");
        }
        if(1 != wDao.delete(Student.class, id)){
        	log.error("PARAM ERROR id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR id:[" + id + "]");
        }

        log.info("DELETE a Student to DB [id:" + id + "]");
    }

    @At("/del/batch")
    public void del(String id[]) {
        if (null == id || id.length<1) {
            log.error("PARAM ERROR id:[" + Json.toJson(id) + "]");
            throw new RuntimeException("PARAM ERROR id:[" + Json.toJson(id) + "]");
        }
        wDao.clear(Student.class, Cnd.where("id", "in", id));
        log.info("DELETE a Student to DB id:[" + Json.toJson(id) + "]");
    }

    @At("/list")
    public Object list(@Param("collegeid") Long collegeid, @Param("majorid") Long majorid, @Param("classid") Long classid, @Param("key") String key, @Param("page") Integer page, @Param("limit") Integer limit) {
        if (ParamUtil.isNull(collegeid, majorid, classid, key, page, limit) || page < 1 || limit < 1) {
            log.error("PARAM ERROR collegeid:" + collegeid + ",key:" + key + ",page:" + page + ",limit:" + limit);
            throw new RuntimeException("PARAM ERROR collegeid:" + collegeid + ", majorid:" + majorid + ", classid:" + classid + ", key:" + key + ", page:" + page + ", limit:" + limit);
        }

        Pager paper = rDao.createPager(page, limit);
        List<Student> list;
        Integer count;
        key = "%" + key.trim() + "%";
        SqlExpression e1 = Cnd.exps("id", "like", key);
        SqlExpression e2 = Cnd.exps("name", "like", key);
        SqlExpression e3 = Cnd.exps("collegeid", "=", collegeid);
        SqlExpression e4 = Cnd.exps("majorid", "=", majorid);
        SqlExpression e5 = Cnd.exps("classid", "=", classid);
        if (key.trim().equalsIgnoreCase("%%") && collegeid == -1) {
            list = rDao.query(Student.class, Cnd.orderBy(), paper);
            count = rDao.count(Student.class, Cnd.orderBy());
        } else if (collegeid == -1) {
            list = rDao.query(Student.class, Cnd.where(e1).or(e2), paper);
            count = rDao.count(Student.class, Cnd.where(e1).or(e2));
        } else {
            if (majorid == -1) {
                list = rDao.query(Student.class, Cnd.where(e3).and(Cnd.exps(e1).or(e2)), paper);
                count = rDao.count(Student.class, Cnd.where(e3).and(Cnd.exps(e1).or(e2)));
            } else {
                if (classid == -1) {
                    list = rDao.query(Student.class,
                            Cnd.where(e4).and(e3).and(Cnd.exps(e1).or(e2)), paper);
                    count = rDao.count(Student.class,
                            Cnd.where(e4).and(e3).and(Cnd.exps(e1).or(e2)));
                } else {
                    list = rDao.query(Student.class,
                            Cnd.where(e5).and(e4).and(e3).and(Cnd.exps(e1).or(e2)), paper);
                    count = rDao.count(Student.class,
                            Cnd.where(e5).and(e4).and(e3).and(Cnd.exps(e1).or(e2)));
                }
            }
        }
        for (Student student : list) {
            student.setCollege(rDao.fetch(College.class, student.getCollegeid()));
            student.setMajor(rDao.fetch(Major.class, student.getMajorid()));
            student.setClazz(rDao.fetch(Class.class, student.getClassid()));
        }
        log.debug("Got Student list:[" + Json.toJson(list) + "]");
        log.info("Got Student list size:[" + list.size() + "]");
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("list", list);
        res.put("total", count);
        return res;
    }

    @At("/login")
    @AdaptBy(type = VoidAdaptor.class)
    public Object login(HttpServletRequest req) {
        String user = req.getParameter("user");
        String password = req.getParameter("password");
        String address = IpUtil.getIpAddr(req);
        Map<String, Object> result = new HashMap<String, Object>();

        result.put("pass", false);
        if (user == null || password == null || user.trim().isEmpty() || password.trim().isEmpty()) {
            log.error("PARAM ERROR user:[" + user + "] password:[" + password + "]");
            throw new RuntimeException("用户名/密码不能为空！");
        }

        if (PropertiesReader.getPropertiesBool("doe.auth.ip.enable")) {
            Map<String, String> map = (Map<String, String>) cache.get(SID_IP_M);
            String addr = map.get(user);
            log.debug("取出的地址是: [" + addr + "]");

            if (null == addr || addr.isEmpty()) {
                boolean flag = true;
                for (Map.Entry<String, String> entry : map.entrySet()) {
                    if (entry.getValue().equals(address)) {
                        result.put("msg", "当前IP:[" + address + "]已被ID:[" + entry.getKey() + "]登录,请注销后再登录!");
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    result = check(result, user, password, req);
                    if ((Boolean)result.get("pass")) {
                        map.put(user, address);
                        cache.put(SID_IP_M, map, 0);
                        cache.put(StuStat.STU_STAT_PREFIX + user, StuStat.ONLINE);
                        log.info("添加地址:[" + address + "]");
                    }
                }
            } else if (address.equals(addr)) {
                result = check(result, user, password, req);
                if ((Boolean)result.get("pass")) {
                    map.put(user, address);
                    cache.put(SID_IP_M, map, 0);
                    cache.put(StuStat.STU_STAT_PREFIX + user, StuStat.ONLINE);
                    log.info("覆盖地址:[" + address + "]");
                }
            } else {
                result.put("msg", "用户已在IP: " + addr + "登陆");
            }
        } else {
            log.info("=========学生登录ip检测已关闭=========");
            result = check(result, user, password, req);
            cache.put(StuStat.STU_STAT_PREFIX + user, StuStat.ONLINE);
        }
        return result;
    }

    private Map<String, Object> check (Map<String, Object> result, String user, String password, HttpServletRequest req) {
        SqlExpression e1 = Cnd.exps("id", "=", user);
        SqlExpression e2 = Cnd.exps("email", "=", user);
        SqlExpression e3 = Cnd.exps("password", "=", MD5Util.generalMD5E2(password));
        List<Student> students = rDao.query(Student.class, Cnd.where(e3).and(Cnd.exps(e2).or(e1)));
        if (students == null || students.size() != 1) {
            result.put("msg", "用户名与密码不匹配");
        } else {
            result.put("pass", true);
            SessionUtil.addToSession("userid", students.get(0).getId(), 0, req);
            SessionUtil.addToSession("username", students.get(0).getName(), 0, req);
            SessionUtil.addToSession("self", students.get(0), 0, req);
            SessionUtil.addToSession("role", Student.ROLE_ID, 0, req);
            log.info("Login success for student:[" + Json.toJson(students.get(0)) + "]");
        }
        return result;
    }

    @At("/add/batch")
    @AdaptBy(type = UploadAdaptor.class, args = {"ioc:fileUpload"})
    public Object batch(@Param("xls") TempFile tempFile) {
        File file = tempFile.getFile();
        String url = "";
        Workbook workbook = null;
        WritableWorkbook errbook = null;

        String filename = "errStudents" + System.currentTimeMillis() + ".xls";
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
            String id = sheet.getCell(0, i).getContents().trim();
            String name = sheet.getCell(1, i).getContents().trim();
            String college = sheet.getCell(2, i).getContents().trim();
            String major = sheet.getCell(3, i).getContents().trim();
            String clazz = sheet.getCell(4, i).getContents().trim();

            Map state = (Map) checkParam(id, name, college, major, clazz);
            if (!(Boolean) state.get("flag")) {
                try {
                    errsheet.addCell(new Label(5, errNum, "学生信息有误: " + state.get("msg").toString(), getBodyCellStyle()));
                } catch (WriteException e) {
                    log.warn("faid to add a student by id:[" + id + ']');
                }
                errNum++;
                url = filename;
                continue;
            }

            Long collegeid = Long.parseLong(college);
            Long majorid = Long.parseLong(major);
            Long classid = Long.parseLong(clazz);

            String password = Student.DEFAULTPASSWD;
            password = MD5Util.generalMD5E2(password);
            Integer complete = Student.COMP_NO;
            Student student = setStudent(id, name, password, collegeid, majorid, classid, null, null, complete);

            try {
                wDao.fastInsert(student);
            } catch (Exception e) {
                try {
                    errsheet.addCell(new Label(5, errNum, "该学生已存在", getBodyCellStyle()));
                } catch (WriteException e1) {
                    log.warn("faid to add a student:[" + student.getId() + "]");
                }
                errNum++;
                url = filename;
                log.error("PARAM ERROR id:[" + id + "] " + e.getMessage());
                continue;
            }
            errsheet.removeRow(errNum);
            count++;
        }

        try {
            errbook.write();
            errbook.close();
        } catch (Exception e) {
            log.error(e);
            throw new RuntimeException(e);
        }
        Map<String, Object> res = new HashMap<String, Object>();

        res.put("linkurl", url);
        res.put("total", count);
        return res;

    }

    @At("/download")
    @Ok("raw:InputStream")
    public File getFile(String filename) {
        return new File(pathUtil.getPath("/download") + "/" + filename);
    }

	@At("/get/paper")
	public Object getPaper(Long paperid, HttpServletRequest req) {
		Map<String, Object> res = new HashMap<String, Object>();
		res.put("self", SessionUtil.getFromSession("self", req));
		res.put("paper", paperAction.get(paperid));
		res.put("role", SessionUtil.getFromSession("role", req));
		res.put("paperid", paperid);
		res.put("webroot", req.getContextPath());
		log.debug("getPaper: " + Json.toJson(res));
		return res;
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

    public void setCache(Cache cache) {
        this.cache = cache;
    }

    public void setPaperAction(PaperAction paperAction){
    	this.paperAction = paperAction;
    }
    
    private void checkParam(String id, String name, Long collegeid, Long majorid, Long classid) {
        if (null == id || null == name || null == collegeid || null == majorid || null == classid) {
            log.error("PARAM ERROR:id:" + id + ", name:" + name + ", collegeid:" + collegeid +
                    ", majorid:" + majorid + ", classid:" + classid);
            throw new RuntimeException("PARAM ERROR:id:" + id + ", name:" + name + ", collegeid:" + collegeid +
                    ", majorid:" + majorid + ", classid:" + classid);
        }
        if (id.trim().isEmpty() || name.trim().isEmpty()) {
            log.error("PARAM ERROR:id:" + id + ", name:" + name);
            throw new RuntimeException("PARAM ERROR:id:" + id + ", name:" + name);
        }

        if (!id.matches("^[0-9]{10}$")) {
            log.error("PARAM ERROR:id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR:id:[" + id + "]");
        }
    }

    private Integer checkParam(String id, String name, String password, Long collegeid, Long majorid, Long classid, String email, String img) {
        if (null == id || null == name || null == password || null == collegeid || null == majorid || null == classid) {
            log.error("PARAM ERROR:id:" + id + ", name:" + name + ", password:" + password + ", collegeid:" + collegeid +
                    ", majorid:" + majorid + ", classid:" + classid);
            throw new RuntimeException("PARAM ERROR:id:" + id + ", name:" + name + ", password:" + password + ", collegeid:" + collegeid +
                    ", majorid:" + majorid + ", classid:" + classid);
        }
        if (id.trim().isEmpty() || name.trim().isEmpty() || password.trim().isEmpty()) {
            log.error("PARAM ERROR:id:" + id + ", name:" + name + ", password:" + password);
            throw new RuntimeException("PARAM ERROR:id:" + id + ", name:" + name + ", password:" + password);
        }
        if (null == email || null == img || email.trim().isEmpty() || img.trim().isEmpty()) {
            return Student.COMP_NO;
        }
        return Student.COMP_YES;
    }

    private Object checkParam(String id, String name, String college, String major, String clazz) {
        Boolean flag = true;
        String msg;
        StringBuilder str = new StringBuilder();
        if (null == id || id.isEmpty()) {
            str.append("账号为空 |");
            flag = false;
        } else {
            if (!id.matches("^[0-9]{10}$")) {
                str.append("账号格式错误(应为10位数字) |");
                flag = false;
            }
        }
        if (null == name || name.isEmpty()) {
            str.append("姓名为空 |");
            flag = false;
        }
        if (null == college || college.isEmpty()) {
            str.append("学院id为空 |");
            flag = false;
        }
        if (null == major || major.isEmpty()) {
            str.append("专业id为空 |");
            flag = false;
        }
        if (null == clazz || clazz.isEmpty()) {
            str.append("班级id为空 |");
            flag = false;
        }
        if (flag) {
            Long classid = Long.parseLong(clazz);
            Long majorid = Long.parseLong(major);
            Long collegeid = Long.parseLong(college);
            List<Class> cla = rDao.query(Class.class, Cnd.where("id", "=", classid));
            List<Major> maj = rDao.query(Major.class, Cnd.where("id", "=", majorid));
            List<College> coll = rDao.query(College.class, Cnd.where("id", "=", collegeid));
            if (coll.isEmpty()) {
                str.append("学院id不存在 |");
                flag = false;
            }
            if (maj.isEmpty()) {
                str.append("专业id不存在 |");
                flag = false;
            } else if (!collegeid.equals(maj.get(0).getCollegeid())) {
                str.append("专业与学院不对应 |");
                flag = false;
            }
            if (cla.isEmpty()) {
                str.append("班级id不存在 |");
                flag = false;
            } else if (!majorid.equals(cla.get(0).getMajorid())) {
                str.append("班级与专业不对应 |");
                flag = false;
            }
        }
        msg = str.toString();
        Map<String, Object> state = new HashMap<String, Object>();
        state.put("msg", msg);
        state.put("flag", flag);
        return state;
    }

    private Student setStudent(String id, String name, String password, Long collegeid, Long majorid, Long classid, String email, String img, Integer complete) {
        Student student = new Student();
        student.setId(id);
        student.setName(name);
        student.setPassword(password);
        student.setCollegeid(collegeid);
        student.setMajorid(majorid);
        student.setClassid(classid);
        student.setEmail(email);
        student.setImg(img);
        student.setComplete(complete);
        return student;
    }

    public WritableCellFormat getBodyCellStyle() {

        /*
         * WritableFont.createFont("宋体")：设置字体为宋体
         * 10：设置字体大小
         * WritableFont.NO_BOLD:设置字体非加粗（BOLD：加粗     NO_BOLD：不加粗）
         * false：设置非斜体
         * UnderlineStyle.NO_UNDERLINE：没有下划线
         */
        WritableFont font = new WritableFont(WritableFont.createFont("宋体"),
                12,
                WritableFont.NO_BOLD,
                false,
                UnderlineStyle.NO_UNDERLINE);

        WritableCellFormat bodyFormat = new WritableCellFormat(font);
        try {
            //设置单元格背景色：表体为白色
            bodyFormat.setBackground(Colour.YELLOW);

            //设置表头表格边框样式
            //整个表格线为细线、黑色
            bodyFormat.setBorder(Border.NONE, BorderLineStyle.NONE);

        } catch (WriteException e) {
//            System.out.println("表体单元格样式设置失败！");
        }
        return bodyFormat;
    }

}
