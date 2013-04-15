/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.actions.stuexam;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-24
 * Time: 下午5:33
 */
public interface StuStat {
    public static final Integer NOT_LOG = 0;
    public static final Integer ONLINE = 1;
    public static final Integer EXAMING = 2;
    public static final Integer ABNORMAL_EXIT = 4;
    public static final Integer CHEATING = 6;
    public static final Integer COMMITTED = 5;
    public static final String STU_STAT_PREFIX = "stu_status_";
}
