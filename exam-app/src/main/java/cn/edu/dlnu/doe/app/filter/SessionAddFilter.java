package cn.edu.dlnu.doe.app.filter;

import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.MD5Util;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.ActionContext;
import org.nutz.mvc.ActionFilter;
import org.nutz.mvc.View;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-8
 * Time: 下午7:26
 */
@SuppressWarnings({"unchecked", "unused"})
public class SessionAddFilter implements ActionFilter {

    public static final String CACHE_ALL_SESSION = "cache_all_session";
    private static final Log log = Logs.getLog(SessionAddFilter.class);
    private Map<String, Object> session;
    private boolean sessionCreated = false;
    private Cache cache = Cache.getInstance();

    @Override
    public View match(ActionContext actionContext) {
        String value = SessionUtil.getSessionId(actionContext.getRequest());
        Set<String> sessions = (Set<String>) cache.get(CACHE_ALL_SESSION);
        if (!sessions.contains(value)){
            sessions.add(value);
            cache.put(CACHE_ALL_SESSION, sessions);
            cache.put(value, System.currentTimeMillis());
            log.debug("==================add to session:["+value+"]=================");
        }
        return null;
    }




}
