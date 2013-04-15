package cn.edu.dlnu.doe.app.scheduler;

import cn.edu.dlnu.doe.app.task.SessionClearTask;
import cn.edu.dlnu.doe.app.task.SyncAswToDBTask;

import java.util.Timer;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-24
 * Time: 上午11:43
 */
@SuppressWarnings({"unchecked","unused"})
public class TaskScheduler {
    private static final Long ONE_MINS = 60*1000L;
    private static final Long TEN_MINS = 10* ONE_MINS;
    private SessionClearTask sessionClearTask;
    private SyncAswToDBTask syncAswToDBTask;
    public void run(){
        Timer timer = new Timer();
        timer.schedule(sessionClearTask,0, 3*ONE_MINS);
        timer.schedule(syncAswToDBTask,0,100);
    }

    public void setSessionClearTask(SessionClearTask sessionClearTask) {
        this.sessionClearTask = sessionClearTask;
    }

    public void setSyncAswToDBTask(SyncAswToDBTask syncAswToDBTask) {
        this.syncAswToDBTask = syncAswToDBTask;
    }
}
