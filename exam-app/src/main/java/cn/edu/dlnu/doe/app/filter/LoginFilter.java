/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.filter;

import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.util.PropertiesReader;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.ActionContext;
import org.nutz.mvc.ActionFilter;
import org.nutz.mvc.View;
import org.nutz.mvc.view.VoidView;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-24
 * Time: 下午12:47
 */
@SuppressWarnings({"unchecked", "unused"})
public class LoginFilter implements ActionFilter {
    private final String teacherLoginPage = PropertiesReader.getProperties("doe.tealogin");
    private final String studentLoginPage = PropertiesReader.getProperties("doe.stulogin");
    private Set<String> excludePaths = new HashSet<String>();

    public void init() {
        String exclude = PropertiesReader.getProperties("doe.url.pass");
        Collections.addAll(excludePaths, exclude.trim().split(","));
    }

    private static final Log log = Logs.getLog(LoginFilter.class);

    @Override
    public View match(ActionContext actionContext) {
        String path = actionContext.getRequest().getServletPath();
        if (excludePaths.contains(path)) {
            log.info("[pass] path:[" + path + "]");
            return null;
        }

        if (SessionUtil.getFromSession("self", actionContext.getRequest()) == null) {

            if (path.endsWith(".do")) {
                log.info("[rejected] send error message path[" + path + "]");
                try {
                    actionContext.getResponse().getWriter().append("{\"success\":false,\"message\":\"亲爱的用户，请你登陆后再试\"}");
                } catch (IOException e) {
                    log.error(e);
                    throw new RuntimeException(e);
                }

            } else {
                log.info("[rejected] send redirect path:[" + path + "]");
                try {
                    actionContext.getResponse().sendRedirect(actionContext.getRequest().getContextPath() + studentLoginPage);
                } catch (IOException e) {
                    log.error(e);
                    throw new RuntimeException(e);
                }
            }
            return new VoidView();
        }

        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
