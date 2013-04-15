package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.dal.bo.College;
import cn.edu.dlnu.doe.dal.bo.Course;
import cn.edu.dlnu.doe.util.ParamUtil;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Ok("ioc:template")
@Fail("json")
@IocBean
@At("/course")
@AdaptBy(type = PairAdaptor.class)
@InjectName("courseAction")
@SuppressWarnings({"unchecked", "unused"})
public class CourseAction {
    public static final int COURSE_ACTIVED = 1;
    public static final int COURSE_DELETED = 0;
    private static final Log log = Logs.getLog(CourseAction.class);
    private Dao rDao;
    private Dao wDao;

    @At("/add")
    public Object add(String name, Long collegeid, String subCollege) {
        checkParam(name, collegeid);
        Course course = new Course();
        course.setCollegeid(collegeid);

        course.setName(name);
        if (subCollege == null) {
            course.setSubcollege("");
        } else {
            course.setSubcollege(subCollege);
        }
        wDao.insert(course);
        return course;
    }

    @At("/mod")
    public void mod(Long id, String name, Long collegeid, String subCollege, Integer active) {
        if (ParamUtil.isNull(id, name, collegeid, subCollege, active) || ParamUtil.isEmpty(name) || collegeid < 0 || id < 0 || active < 0 || active > 1) {
            log.error("PARAM ERROR id:[" + id + "] name:[" + name + "]" + "] collegeid:[" + collegeid + "]" + "] subCollege:[" + subCollege + "]" + "] active:[" + active + "]");
            throw new RuntimeException("PARAM ERROR id:[" + id + "] name:[" + name + "]" + "] collegeid:[" + collegeid + "]" + "] subCollege:[" + subCollege + "]" + "] active:[" + active + "]");
        }
        Course course = rDao.fetch(Course.class, id);
        if (course == null) {
            log.error("CAN NOT FIND COLLEGE BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND COLLEGE BY ID:[" + id + "]");
        }
        course.setCollegeid(collegeid);
        course.setName(name);
        course.setSubcollege(subCollege);
        course.setActive(active);
        wDao.update(course);
        //删除教师和课程的关联
        if (active == COURSE_ACTIVED) {
            wDao.execute(Sqls.create("DELETE FROM t_teacher_course WHERE courseid=" + id));
        }
        log.debug("Update COURSE:[" + Json.toJson(course) + "]");

    }

    @At("/del")
    public void del(Long id) {
        if (null == id) {
            log.error("PARAM ERROR id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR id:[" + id + "]");
        }
        Course coures = rDao.fetch(Course.class, id);
        coures.setActive(COURSE_DELETED);
        wDao.update(coures);

    }

    @At("/list")
    public Object list(@Param("collegeid") Long collegeid, @Param("key") String key, @Param("page") Integer page, @Param("limit") Integer limit) {

        if (ParamUtil.isNull(collegeid, key, page, limit) && collegeid < 0 && page < 1 && limit < 1) {
            log.error("PARAM ERROR collegeid:{" + collegeid + "] key:[" + key + "] page:[" + page + "] limit:[" + limit + ']');
            throw new RuntimeException("PARAM ERROR collegeid:{" + collegeid + "] key:[" + key + "] page:[" + page + "] limit:[" + limit + ']');
        }
        page -= 1;
        Pager paper = rDao.createPager(page, limit);
        if (null == key) {
            key = "";
        }
        key = "%" + key + "%";
        List<Course> list;
        Integer count;
        Condition cnd;
        SqlExpression e1 = Cnd.exp("collegeid", "=", collegeid);
        SqlExpression e2 = Cnd.exp("subcollege", "LIkE", key);
        SqlExpression e4 = Cnd.exp("name", "LIKE", key);
        SqlExpression e3;
        List<String> id = new ArrayList<String>();
        for (String ids : key.replaceAll("[^0-9]", ",").split(",")) {
            if (ids.length() > 0)
                id.add(ids);
        }
        if (id.size() == 0) {


            if (key.isEmpty()) {
                if (collegeid == -1L) {
                    cnd = Cnd.orderBy();
                } else {
                    cnd = Cnd.where(e1);
                }
            } else {
                if (collegeid == -1L) {
                    cnd = Cnd.where(e2).or(e4);

                } else {
                    cnd = Cnd.where(e1).and(Cnd.exps(e2).or(e4));
                }
            }


        } else {
            e3 = Cnd.exp("id", "=", Integer.parseInt(id.get(0)));
            if (key.isEmpty()) {
                if (collegeid == -1L) {
                    cnd = Cnd.orderBy();
                } else {
                    cnd = Cnd.where(e1);
                }
            } else {
                if (collegeid == -1L) {
                    cnd = Cnd.where(e2).or(e3).or(e4);

                } else {
                    cnd = Cnd.where(e1).and(Cnd.exps(e2).or(e4).or(e3));
                }
            }

        }

        list = rDao.query(Course.class, cnd, paper);
        count = rDao.count(Course.class, cnd);
        for (Course course : list) {
            rDao.fetchLinks(course, "collegid");
            course.setCollege((rDao.fetch(College.class, course.getCollegeid())));
        }

        Map<String, Object> res = new HashMap<String, Object>();
        res.put("list", list);
        res.put("total", count);
        return res;

    }


    private void checkParam(String name, Long collegeid) {
        if (collegeid == null || name == null) {
            log.error("PARAM ERROR:name:" + name + "collegeid:" + collegeid + "");
            throw new RuntimeException("PARAM ERROR:name:[" + name + "] collegeid:[" + collegeid + "]");
        }
        if (name.trim().isEmpty()) {
            log.error("PARAM ERROR:name:" + " + name +");
            throw new RuntimeException("PARAM ERROR:name:[" + name + "]");
        }
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }
}
