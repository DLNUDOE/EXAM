package cn.edu.dlnu.doe.app.util;

import cn.edu.dlnu.doe.app.filter.SessionAddFilter;
import cn.edu.dlnu.doe.util.Cache;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-8
 * Time: 下午9:16
 */
@SuppressWarnings({"unchecked", "unused"})
public class SessionUtil {
    private static Cache cache;

    public void setCache(Cache cache) {
        this.cache = cache;
    }

    public static final String SESSION = "JSESSIONID";

    public static String getSessionId(HttpServletRequest req) {
        String value = null;
//      System.out.println("Session" + req.getCookies());
        Cookie cookies[] = req.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(SESSION)) {
                    value = cookie.getValue();
                }
            }
        }

        if (value == null){
            value = (String) req.getSession().getId();
        }
        return value;
    }

    public static Object getFromSession(String key, HttpServletRequest req) {
        String sessionID = getSessionId(req) + "_";
        if (sessionID.trim().equals("_")) {
            return null;
        }
        return cache.get(sessionID + key);

    }

    public static void addToSession(String key, Object value, HttpServletRequest req) {
        addToSession(key, value,0,req);
    }

    public static void addToSession(String key,Object value,int seconds,HttpServletRequest req){
        String sessionID = getSessionId(req) + "_";
        cache.put(sessionID + key, value,seconds);
    }
    public static Object removeSession(String key, HttpServletRequest req) {
    	/////////////////////kql//////////////////////
    	String value = SessionUtil.getSessionId(req);
    	/////////////////////kql//////////////////////
    	
        String sessionID = getSessionId(req)+"_";
        if (sessionID.trim().equals("_")) {
            return null;
        }
        ////////////////////kql/////////////////////
        Set<String> sessions = (Set<String>) cache.get(SessionAddFilter.CACHE_ALL_SESSION);
        if(sessions.contains(value)){
        	sessions.remove(value);
        }
        cache.put(SessionAddFilter.CACHE_ALL_SESSION, sessions);
        cache.del(value);
        ////////////////////kql//////////////////////
        return cache.del(sessionID + key);
    }

}
