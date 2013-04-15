package cn.edu.dlnu.doe.app;

import cn.edu.dlnu.doe.app.actions.JudgepaperAction;
import cn.edu.dlnu.doe.app.actions.QuestionAction;
import cn.edu.dlnu.doe.app.actions.StudentAction;
import cn.edu.dlnu.doe.app.filter.SessionAddFilter;
import cn.edu.dlnu.doe.app.scheduler.TaskScheduler;
import cn.edu.dlnu.doe.app.task.PrepareExamTask;
import cn.edu.dlnu.doe.app.task.SyncAswToDBTask;
import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.app.views.DispatchView;
import cn.edu.dlnu.doe.biz.tag.TagTip;
import cn.edu.dlnu.doe.dal.bo.*;
import cn.edu.dlnu.doe.dal.relation.ExamStudent;
import cn.edu.dlnu.doe.dal.relation.StudentPaper;
import cn.edu.dlnu.doe.dal.relation.TeacherCourse;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.PropertiesReader;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.NutConfig;
import org.nutz.mvc.Setup;

import javax.servlet.ServletContext;
import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.LinkedHashMap;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-6
 * Time: 上午11:23
 */
@SuppressWarnings({"unchecked", "unused"})
public class SetupApp implements Setup {
    private static final transient Log log = Logs.getLog(SetupApp.class);
//    private Dao bo;

    @Override
    public void init(NutConfig config) {
        DispatchView dispatchView;
        log.info("\t\t\n=====================EXAM HELLO ALL=====================\t\t\n");
        dispatchView = config.getIoc().get(DispatchView.class,"template");
        ServletContext servletContext = config.getServletContext();
        try {
            dispatchView.init(servletContext);
        } catch (FileNotFoundException e) {
            log.error("Application Startup failed by:["+e.getMessage()+"]");
            System.exit(1);
        }
        config.getIoc().get(SessionUtil.class,"sessionUtil");
        if (PropertiesReader.getPropertiesBool("doe.debug")){
            //create database
            Dao dao = config.getIoc().get(NutDao.class,"wDao");
            dao.create(College.class,false);
            dao.create(Major.class,false);
            dao.create(cn.edu.dlnu.doe.dal.bo.Class.class,false);
            dao.create(TeacherCourse.class,false);
            dao.create(Teacher.class,false);
            dao.create(Student.class, false);
            dao.create(Course.class, false);
            dao.create(IpRoom.class, false);
            dao.create(Question.class, false);
            dao.create(Paper.class, false);
            dao.create(StudentPaper.class, false);
            dao.create(Exam.class, false);
            dao.create(ExamStudent.class, false);
            dao.create(StudentAnswer.class, false);
        }
        TagTip tagTip = new TagTip();
        tagTip.setrDao(config.getIoc().get(NutDao.class,"rDao"));
        tagTip.init();
        QuestionAction qa = config.getIoc().get(QuestionAction.class,"questionAction");
        qa.setTagTip(tagTip);
        JudgepaperAction judgepaperAction=config.getIoc().get(JudgepaperAction.class,"judgepaperAction");
        //judgepaperAction.setTagTip(tagTip);
        Cache cache = Cache.getInstance();
        cache.put(StudentAction.SID_IP_M, new LinkedHashMap<String, String>(), 0);
        cache.put(SessionAddFilter.CACHE_ALL_SESSION,new HashSet<String>());
        cache.put(PrepareExamTask.ON_GOING_EXAM,new HashSet<Long>());
        TaskScheduler ts = config.getIoc().get(TaskScheduler.class,"taskScheduler");
        ts.run();
     }

    @Override
    public void destroy(NutConfig config) {
    }
}
