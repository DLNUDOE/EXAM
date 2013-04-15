/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.app.actions.stuexam.StuExamAction;
import cn.edu.dlnu.doe.app.actions.stuexam.StuStat;
import cn.edu.dlnu.doe.dal.relation.ExamStudent;
import cn.edu.dlnu.doe.util.Cache;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-25
 * Time: 下午6:01
 */
@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/manage")
@AdaptBy(type = PairAdaptor.class)
@SuppressWarnings({"unchecked", "unused"})
@InjectName("majorAction")
public class ManageAction {
    private Cache cache;
    private Dao rDao;
    private StuExamAction stuExamAction;

    @At("/stu/stat")
    public Object stuStat(@Param("examid") Long exaid) {
        List<ExamStudent> list = rDao.query(ExamStudent.class, Cnd.where("examid", "=", exaid));
        Map<String, Integer> res = new LinkedHashMap<String, Integer>();
        for (ExamStudent es : list) {
            Integer status = stuExamAction.getStatus(exaid,es.getStudentid());
            status = status == null ? StuStat.NOT_LOG : status;
            res.put(es.getStudentid(), status);
        }
        return res;
    }

    public void setCache(Cache cache) {
        this.cache = cache;
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setStuExamAction(StuExamAction stuExamAction) {
        this.stuExamAction = stuExamAction;
    }
}
