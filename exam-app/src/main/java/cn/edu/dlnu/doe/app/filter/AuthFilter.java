package cn.edu.dlnu.doe.app.filter;

import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.util.PropertiesReader;
import org.nutz.json.Json;
import org.nutz.lang.Files;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.ActionContext;
import org.nutz.mvc.ActionFilter;
import org.nutz.mvc.View;
import org.nutz.mvc.view.VoidView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-9
 * Time: 上午10:29
 */
public class AuthFilter implements ActionFilter {
    private static final Log log = Logs.getLog(AuthFilter.class);
    private LinkedHashMap<String, Integer> authMap;
    private Map<String, Pattern> patternMap;
    private String redirectPage = PropertiesReader.getProperties("doe.redirect");
    private String studentligin = PropertiesReader.getProperties("doe.stulogin");
    private Set<String> excludePaths;
    private boolean enable = PropertiesReader.getPropertiesBool("doe.auth.enable");

    @SuppressWarnings({"unchecked"})
    public void init() throws FileNotFoundException {

        File config = Files.findFile("auth.json");
        if (null == config) {
            log.error("Can not find path:[classpath:auth.json]");
            throw new FileNotFoundException("[classpath:auth.json]");
        }

        FileReader reader = new FileReader(config);
        authMap = new LinkedHashMap<String, Integer>();
        authMap = Json.fromJson(authMap.getClass(), reader);
        log.info("Get url mapping:[" + authMap + "]");
        patternMap = new LinkedHashMap<String, Pattern>();
        if (!authMap.isEmpty()) {
            for (String url : authMap.keySet()) {
                patternMap.put(url, Pattern.compile(url));
            }
        }

        excludePaths = new HashSet<String>();
        Collections.addAll(excludePaths, PropertiesReader.getProperties("doe.url.pass").trim().split(","));
//          System.out.println(Json.toJson(excludePaths));
    }

    @Override
    public View match(ActionContext actionContext) {

        if (!enable) {
            return null;
        }
        String sessionID = SessionUtil.getSessionId(actionContext.getRequest());
        String path = actionContext.getRequest().getServletPath();

        log.info("Auth for PATH:[" + path + "]");
       System.out.println("excludePaths:" +Json.toJson(excludePaths));
        if (excludePaths.contains(path)) {
            log.info("[pass] path:[" + path + "]");
            return null;
        }

        if (sessionID == null || sessionID.trim().equals("")) {
            handleResponse(actionContext.getRequest(), actionContext.getResponse());
            return new VoidView();
        }
        for (String url : patternMap.keySet()) {
            Matcher matcher = patternMap.get(url).matcher(path);
            if (matcher.find()) {
                int auth = authMap.get(url);
                log.debug("Path:{"+url+"] auth:["+auth+']');
                Integer sessionAuth = (Integer) SessionUtil.getFromSession("role", actionContext.getRequest());
                if (sessionAuth == null || sessionAuth > auth) {
                    handleResponse(actionContext.getRequest(), actionContext.getResponse());
                    return new VoidView();
                } else {
                    log.info("[pass] path:[" + path + "]");
                    return null;
                }
            }
        }

        //not find matcher

        int auth = PropertiesReader.getPropertiesInt("doe.defaultrole");
        Integer sessionAuth = (Integer) SessionUtil.getFromSession("role", actionContext.getRequest());
        log.info("sessionAuth: " + sessionAuth);
        if (sessionAuth == null || (sessionAuth >= auth && !path.equals("/"))) {
            handleResponse(actionContext.getRequest(), actionContext.getResponse());
            return new VoidView();
        } else if (sessionAuth == auth && path.equals("/")) {
            try {
                actionContext.getResponse().sendRedirect(actionContext.getRequest().getContextPath() + studentligin);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return new VoidView();
        } else {
            log.info("[pass] path:[" + path + "]");
            return null;
        }
    }

    private void handleResponse(HttpServletRequest req, HttpServletResponse resp) {
        String path = req.getServletPath();
        if (path.endsWith(".do")) {
            try {
                log.info("[rejected] send error message path[" + path + "]");
                resp.getWriter().append("{\"success\":false,\"message\":\"亲爱的用户，您无权执行此操作\"}");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                log.info("[rejected] send redirect path:[" + path + "]");
                resp.sendRedirect(req.getContextPath() + redirectPage);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
