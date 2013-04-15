/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.filter;

import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.util.PropertiesReader;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-24
 * Time: 下午2:48
 */
@SuppressWarnings({"unchecked", "unused"})
public class StaticLoginFilter implements Filter {
    private final String teacherLoginPage = PropertiesReader.getProperties("doe.tealogin");
    private final String studentLoginPage = PropertiesReader.getProperties("doe.stulogin");
    private Set<String> excludePaths = new HashSet<String>();
    private static final Log log = Logs.getLog(StaticLoginFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        String exclude = PropertiesReader.getProperties("doe.url.pass");
        Collections.addAll(excludePaths, exclude.trim().split(","));
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if (SessionUtil.getFromSession("self", (HttpServletRequest) servletRequest) == null) {
            String path = ((HttpServletRequest) servletRequest).getServletPath();
            if (path.endsWith(".do") || path.endsWith(".html") || path.endsWith("/")) {
                if (excludePaths.contains(path)) {
                    log.info("[pass] path:[" + path + "]");
                    filterChain.doFilter(servletRequest, servletResponse);
                    return;
                }
                if (path.endsWith(".do")) {
                    log.info("[rejected] send error message path[" + path + "]");
                    return;
                } else {
                    log.info("[rejected] send redirect path:[" + path + "]");
                    try {
                        ((HttpServletResponse) servletResponse).sendRedirect(((HttpServletRequest) servletRequest).getContextPath() + studentLoginPage);
                        return;
                    } catch (IOException e) {
                        log.error(e);
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
    }
}
