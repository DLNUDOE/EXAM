package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.dal.bo.College;
import cn.edu.dlnu.doe.dal.bo.Course;
import cn.edu.dlnu.doe.dal.bo.Exam;
import cn.edu.dlnu.doe.dal.bo.Paper;
import cn.edu.dlnu.doe.dal.bo.StudentAnswer;
import cn.edu.dlnu.doe.dal.bo.Teacher;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.MD5Util;
import cn.edu.dlnu.doe.util.ParamUtil;
import cn.edu.dlnu.doe.util.StringUtil;
import org.nutz.dao.*;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.sql.SqlCallback;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.adaptor.VoidAdaptor;
import org.nutz.mvc.annotation.*;
import org.nutz.trans.Atom;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA. User: upupxjg Date: 13-3-7 Time: 下午6:49
 */
@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/teacher")
@AdaptBy(type = PairAdaptor.class)
@InjectName("teacherAction")
@SuppressWarnings({ "unchecked", "unused" })
public class TeacherAction {
    private static final Log log = Logs.getLog(TeacherAction.class);
    private Dao rDao;
    private Dao wDao;
    private PaperAction paperAction;
    private Cache cache;
    private  static final String  READOVER="readover";
    private static final String  READSIZE="readsize";
    @At("/add")
    @POST
    public Object add(String id, String name, String password, Long collegeid, String email, String tel, Integer role) {

        checkParam(id, name, password, collegeid, email, tel, role);

        password = MD5Util.generalMD5E2(password);
        Teacher teacher = new Teacher();
        teacher.setId(id);
        teacher.setName(name);
        teacher.setPassword(password);
        teacher.setCollegeid(collegeid);
        teacher.setEmail(email);
        teacher.setTel(tel);
        teacher.setRole(role);

        wDao.insert(teacher);
        log.info("Insert a Teacher to DB[" + Json.toJson(teacher) + "]");
        return teacher;
    }

    @At("/mod")
    @POST
    public void mod(String id, String name, String password, Long collegeid, String email, String tel, Integer role) {
        checkParam(id, name, password, collegeid, email, tel, role);
        Teacher teacher = rDao.fetch(Teacher.class, id);
        if (null == teacher) {
            log.error("CAN NOT FIND TEACHER BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND TEACHER BY ID:[" + id + "]");
        }
        password = MD5Util.generalMD5E2(password);
        teacher.setId(id);
        teacher.setName(name);
        teacher.setPassword(password);
        teacher.setCollegeid(collegeid);
        teacher.setEmail(email);
        teacher.setTel(tel);
        teacher.setRole(role);

        wDao.update(teacher);
        log.info("UPDATE a Teacher to DB[" + Json.toJson(teacher) + "]");
    }

    @At("/del")
    @POST
    public void del(String id) {
        if (null == id) {
            log.error("PARAM ERROR id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR id:[" + id + "]");
        }
        if (1 != wDao.delete(Teacher.class, id)) {
            log.error("CAN NOT FIND TEACHER BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND TEACHER BY ID:[" + id + "]");
        }
    }

    @At("/list")
    public Object list(@Param("collegeid") Long collegeid, @Param("key") String key, @Param("page") Integer page, @Param("limit") Integer limit) {
        if (ParamUtil.isNull(collegeid, key, page, limit) || page < 1 || limit < 1) {
            log.error("PARAM ERROR collegeid:" + collegeid + ",key:" + key + ",page:" + page + ",limit:" + limit);
            throw new RuntimeException("PARAM ERROR collegeid:" + collegeid + ",key:" + key + ",page:" + page + ",limit:" + limit);
        }
        //page should start at 0,but FE start by 1,so cut 1 for page
        List<Teacher> list;
        Integer count;
        Condition cnd;
        Pager paper = rDao.createPager(page, limit);
        //page should start at 0,but FE start by 1,so cut 1 for page
        if (key.trim().equalsIgnoreCase("")) {
            if (collegeid == -1L) {
                list = rDao.query(Teacher.class, Cnd.orderBy(), paper);
                count = rDao.count(Teacher.class);
            } else {
                SqlExpression e3 = Cnd.exps("collegeid", "=", collegeid);
                list = rDao.query(Teacher.class, Cnd.where(e3), paper);
                count = rDao.count(Teacher.class, Cnd.where(e3));
            }
        } else {
            key = "%" + key + "%";
            SqlExpression e1 = Cnd.exps("id", "like", key);
            SqlExpression e2 = Cnd.exps("name", "like", key);
            SqlExpression e3 = Cnd.exps("collegeid", "=", collegeid);
            if (key.trim().equalsIgnoreCase("")) {
                if (collegeid == -1L) {
                    cnd = Cnd.orderBy();
                } else {
                    cnd = Cnd.where(e3);
                }
            } else if (collegeid == -1) {
                cnd = Cnd.where(e1).or(e2);
            } else {
                cnd = Cnd.where(e3).and(Cnd.exps(e1).or(e2));
            }
            list = rDao.query(Teacher.class, cnd, paper);
            count = rDao.count(Teacher.class, cnd);
        }
        for (Teacher teacher : list) {
            rDao.fetchLinks(teacher, "courses");
            teacher.setCollege(rDao.fetch(College.class, teacher.getCollegeid()));
        }
        log.debug("Got Teacher list:[" + Json.toJson(list) + "]");
        log.info("Got Teacher list size:[" + list.size() + "]");
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("list", list);
        res.put("total", count);
        return res;

    }

    /*//    @AdaptBy(type = ParamAdaptor.class)
    //    @Params(names = {"user","password"})
        public Object login(String user,String password) {*/
    @At("/login")
    @AdaptBy(type = VoidAdaptor.class)
    public Object login(HttpServletRequest req) {
        String user = req.getParameter("user");
        String password = req.getParameter("password");

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("pass", false);
        if (ParamUtil.isNull(user, password) || ParamUtil.isEmpty(user, password)) {
            log.error("PARAM ERROR user:[" + user + "] password:[" + password + "]");
            throw new RuntimeException("用户名/密码不能为空！");
        }
        SqlExpression e1 = Cnd.exps("id", "=", user);
        SqlExpression e2 = Cnd.exps("email", "=", user);
        SqlExpression e3 = Cnd.exps("password", "=", MD5Util.generalMD5E2(password));
        List<Teacher> teachers = rDao.query(Teacher.class, Cnd.where(e3).and(Cnd.exps(e2).or(e1)));
        if (teachers == null || teachers.size() != 1) {
            result.put("msg", "用户名与密码不匹配");
        } else {
            result.put("pass", true);
            teachers.get(0).setPassword(null);
            SessionUtil.addToSession("userid", teachers.get(0).getId(), req);
            SessionUtil.addToSession("username", teachers.get(0).getName(), req);
            SessionUtil.addToSession("role", teachers.get(0).getRole(), req);
            teachers.get(0).setCollege(rDao.fetch(College.class, teachers.get(0).getCollegeid()));
            Teacher self = teachers.get(0);
            self.setCollege(rDao.fetch(College.class,self.getCollegeid()));
            SessionUtil.addToSession("self", self, req);
        }
        return result;

    }

    @At("/course/mod")
    public void addCourse(@Param("teacherid") String teacherid, @Param("courseids") Long[] courseids) {
        if (StringUtil.isEmpty(teacherid) || courseids == null) {
            log.error("PARAM ERROR teacherid:[" + teacherid + "] courseid:[" + Json.toJson(courseids) + "]");
            throw new RuntimeException("PARAM ERROR teacherid:[" + teacherid + "] courseid:[" + Json.toJson(courseids) + "]");
        }
        List<Teacher> teachers = rDao.query(Teacher.class, Cnd.where("id", "=", teacherid));
        if (teachers.isEmpty()) {
            log.error("CAN NOT FIND TEACHER BY ID:[" + teacherid + "]");
            throw new RuntimeException("CAN NOT FIND TEACHER BY ID:[" + teacherid + "]");
        }
        StringBuffer sb = new StringBuffer();
        for (Long courseid : courseids) {
            sb.append(courseid).append(',');
        }
        sb.deleteCharAt(sb.length() - 1);
        List<Course> courses = rDao.query(Course.class, Cnd.wrap("where id in(" + sb.toString() + ")"));
        log.debug("GET COURSES:" + Json.toJson(courses));

        Teacher teacher = teachers.get(0);
        teacher.setCourses(courses);
        wDao.execute(Sqls.create("DELETE FROM t_teacher_course WHERE teacherid='" + teacher.getId() + "'"));
        wDao.insertRelation(teacher, "courses");
    }

    @At("/get")
    public Object get(String id) {
        if (StringUtil.isEmpty(id)) {
            log.error("PARAM ERROR id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR id:[" + id + "]");
        }
        Teacher teacher = new Teacher();
        teacher.setId(id);
        teacher = rDao.fetch(teacher);
        College college = rDao.fetch(College.class, teacher.getCollegeid());
        teacher.setCollege(college);
        log.info("GET TEACHER:[" + Json.toJson(teacher) + "]");
        return teacher;
    }

    @At("/course/list")
    public Object courselist(@Param("id") String id) {
        if (ParamUtil.isEmpty("id") || ParamUtil.isNull("id")) {
            log.error("PARAM ERROR ID:" + id);
            throw new RuntimeException("PARAM ERROR ID:" + id);
        }
        Teacher teacher = rDao.fetch(Teacher.class, id);
        if (null == teacher) {
            log.error("PARAM ERROA ID:" + id);
            throw new RuntimeException("PARAM ERROA ID:" + id);
        }
        rDao.fetchLinks(teacher, "courses");

        if (teacher.getCourses().size() < 1) {
            log.error("This teacher do not choice course");
            throw new RuntimeException("This teacher do not choice course");
        }
        return teacher.getCourses();
    }

    @At("/get/paper")
    public Object getPaper(Long paperid, HttpServletRequest req) {
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("self", SessionUtil.getFromSession("self", req));
        res.put("paper", paperAction.get(paperid));
        res.put("role", SessionUtil.getFromSession("role", req));
        res.put("paperid", paperid);
        res.put("webroot",req.getContextPath());
        log.debug("getPaper: "+ Json.toJson(res));
        return res;
    }

    @At("/intel/paper")
    public Object getIntelPaper(@Param("reload") Integer reload, @Param("name") String name, @Param("courseid") Long courseid, @Param("course") String course, @Param("radio") Integer radio, @Param("checkbox") Integer checkbox, @Param("judge") Integer judge, @Param("blank") Integer blank, @Param("subject") Integer subject, @Param("score") Integer score, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Long paperid = (Long) SessionUtil.getFromSession("paperid", req);
        Map<String, Object> res = new HashMap<String, Object>();
        Teacher t = (Teacher) SessionUtil.getFromSession("self", req);
        res.put("self", t);
        Object paper;

        if (paperid == null || (reload != null && reload == 1)) {
            paper = paperAction.intelligent(name, t.getName(), courseid, course, radio, checkbox, judge, blank, subject, score);
            paperid = System.currentTimeMillis();
            SessionUtil.addToSession("paperid", paperid, req);
            SessionUtil.addToSession(paperid + "", paper, req);
            log.debug("REQ REFERER :[" + req.getRequestURL() + "?" + req.getQueryString() + "]");
            Cookie cookie = new Cookie("refresh_url", req.getRequestURL() + "?" + req.getQueryString());
            resp.addCookie(cookie);
            resp.sendRedirect("paper.html");
        } else {
            paper = SessionUtil.getFromSession(paperid + "", req);
        }
        res.put("paper", paper);
        res.put("role", SessionUtil.getFromSession("role", req));
        res.put("paperid", paperid);
        res.put("webroot",req.getContextPath());
        return res;
    }


    @At("/login/user")
    @AdaptBy(type = VoidAdaptor.class)
    public Teacher getSelf(HttpServletRequest req) {
        return (Teacher) SessionUtil.getFromSession("self", req);
    }

    @At("/passwd")
    @POST
    public Object passwd(String id, String pwold, final String pwnew) {

        if (ParamUtil.isNull(id, pwold, pwnew) || ParamUtil.isEmpty(id, pwold, pwnew)) {
            log.error("PARAM ERROR: id:" + id + "pwold:" + pwold + "pwnew" + pwnew);
            throw new RuntimeException("PARAM ERROR: id:" + id + "pwold:" + pwold + "pwnew" + pwnew);
        }

        final Teacher teacher = rDao.fetch(Teacher.class, id);

        if (null == teacher) {
            log.error("CAN NOT FIND TEACHER BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND TEACHER BY ID:[" + id + "]");
        }

        if (!teacher.getPassword().equals(MD5Util.generalMD5E2(pwold))) {
            log.error("PASSWORD IS ERROR PWOLD:[" + pwold + "]");
            return 0;
        }

        FieldFilter.create(Teacher.class, "^password$").run(new Atom() {
            public void run() {
                teacher.setPassword(MD5Util.generalMD5E2(pwnew));
                wDao.update(teacher);
            }
        });

        return 1;
    }
    @At("/readover")
    public Object getExaming(@Param("page") Integer page, @Param("limit") Integer limit, @Param("key") String key) {
        if (page == null || limit == null || page < 0 || limit < 0 || null == key) {
            log.error("PARAM ERROR page:" + page + "+limit:+" + limit + "");
            throw new RuntimeException("PARAM ERROR page:" + page + "key: " + key + "");
        }
        boolean flag = false;
        List<Exam> examList = null;
        Pager pager = rDao.createPager(page, limit);
        SqlExpression e1 = Cnd.exps("status", "=", 3);
        List<Exam> exam = rDao.query(Exam.class, Cnd.orderBy());
        Map<String, Object> res = new HashMap<String, Object>();
        List<Map> list = new LinkedList<Map>();
        if (StringUtil.isEmpty(key)) {
            examList = rDao.query(Exam.class, Cnd.where(e1), pager);
        } else {
            key = "%" + key + "%";
            SqlExpression e2 = Cnd.exps("name", "LIKE", key);
            examList = rDao.query(Exam.class, Cnd.where(e1).and(e2), pager);
        }

        for (Exam examlist : exam) {
            if (examlist.getStartTime().getTime() + examlist.getDuration() * 60000 + 180000 < new Date().getTime()) {
                if (examlist.getStatus() != 3) {
                    examlist.setStatus(3);
                    wDao.update(examlist);

                }

            }
            if (examlist.getStartTime().before(new Date())
                    && (examlist.getStartTime().getTime() + examlist.getDuration() * 60000 + 180000 > new Date()
                    .getTime())) {
                if (examlist.getStatus() != 2) {
                    examlist.setStatus(2);
                    wDao.update(examlist);
                }
            }
        }

        int count = rDao.count(Exam.class, Cnd.where(e1));
        if (examList == null) {
            throw new RuntimeException("没有待批阅的试卷");
        } else {

            for (Exam examuse : examList) {
                Map<String, Object> examMap = new HashMap<String, Object>();
                Paper paper = rDao.fetch(Paper.class, examuse.getPaperid());
                Course course = rDao.fetch(Course.class, examuse.getCourseid());
                examMap.put("id", examuse.getId());
                examMap.put("name", examuse.getName());
                examMap.put("startTime", examuse.getStartTime());
                examMap.put("creator", examuse.getCreator());
                examMap.put("papername", paper.getTitle());
                examMap.put("coursename", course.getName());
                list.add(examMap);
            }
            res.put("list", list);
            res.put("total", count);
            cache.put(READOVER, res);
        }

        return res;
    }

    @At("/get/stuAnswer")
    public Object getAnswer(@Param("examid")Long examid){
        if(null==examid){
            log.debug("You are wrong because  examid:"+'['+examid+']');
            throw new RuntimeException("对不起没有没有这场考试，请查询你的信息");
        }
        int count=rDao.count(StudentAnswer.class, Cnd.where("examid", "=", examid));
        if(0==count){
            log.debug("You are wrong because  studentanswer:"+'['+count+']');
            throw new RuntimeException("对不起没有没有这场考试，请查询你的信息");
        }
        Exam exam = rDao.fetch(Exam.class, examid);
        if (exam == null) {
            throw new RuntimeException("對不起，您請求的考試不存在");
        }
        Sql sql = Sqls.create("select distinct (studentid) from t_student_answer where examid=@examid");
        sql.params().set("examid", examid);
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
        log.debug("==================="+Json.toJson(sidList));
        return null;
    }
    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }

    private void checkParam(String id, String name, String password, Long collegeid, String email, String tel, Integer role) {
        if (ParamUtil.isNull(id, name, password, collegeid, email, tel, role)
                || ParamUtil.isEmpty(id, name, password, email, tel) || collegeid < 0
                || role < 0 || role > 2 || !StringUtil.isEmail(email) || !StringUtil.isTel(tel)) {
            log.error("PARAM ERROR:id:" + id + ",name:" + name + ",password:" + password +
                    ",collegeid:" + collegeid + ",email:" + email + ",tel:" + tel + ",role:" + role);
            throw new RuntimeException("PARAM ERROR:id:" + id + ",name:" + name + ",password:" + password +
                    ",collegeid:" + collegeid + ",email:" + email + ",tel:" + tel + ",role:" + role);
        }
    }

    public void setPaperAction(PaperAction paperAction) {
        this.paperAction = paperAction;
    }

}
