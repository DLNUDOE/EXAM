/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.task;

import cn.edu.dlnu.doe.app.actions.stuexam.StuExamAction;
import cn.edu.dlnu.doe.app.actions.stuexam.StuStat;
import cn.edu.dlnu.doe.app.filter.SessionAddFilter;
import cn.edu.dlnu.doe.dal.bo.Student;
import cn.edu.dlnu.doe.util.Cache;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import java.util.Iterator;
import java.util.Set;
import java.util.TimerTask;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-24
 * Time: 下午3:14
 */
@SuppressWarnings({"unchecked", "unused"})
public class SessionClearTask extends TimerTask {
    private Cache cache;
    private StuExamAction stuExamAction;
    private static final Log log = Logs.getLog(SessionClearTask.class);

    @Override
    public void run() {
        Set<String> sessions = (Set<String>) cache.get(SessionAddFilter.CACHE_ALL_SESSION);
  //    Iterator<String> i = sessions.iterator();
        long now = System.currentTimeMillis();
        for (String sessionid : sessions) {
            Long lastBreathTime = (Long) cache.get(sessionid);
            Object self = cache.get(sessionid + "_self");
            if (now - lastBreathTime >  10*60 * 1000) {
//
//                if (self != null) {
//                    if (self instanceof Student) {
//                        Student student = (Student) self;
//                        Integer status = stuExamAction.getStatus(((Student) self).getId());
//                        if (status.equals(StuStat.EXAMING)){
//                            stuExamAction.setStatus(student.getId(),StuStat.ABNORMAL_EXIT);
//                        }else if(status < StuStat.EXAMING){
//                            stuExamAction.setStatus(student.getId(),StuStat.NOT_LOG);
//                        }
//                    }
//           	   }
//              }
                if (self!= null && (self instanceof Student)){
                    return;
                }
                cache.del(sessionid + "_role");
                cache.del(sessionid + "_self");
                log.info("================ remove session id:[" + sessionid + "] ===============");
            }
        }
    }


    public void setCache(Cache cache) {
        this.cache = cache;
    }
}
