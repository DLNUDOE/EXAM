package cn.edu.dlnu.doe.app.util;

import cn.edu.dlnu.doe.app.actions.StudentAction;
import cn.edu.dlnu.doe.util.Cache;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Cheshun
 * Date: 13-3-20
 * Time: 下午8:39
 * To get IP.
 */
@SuppressWarnings({"unchecked", "unused"})
public class IpUtil {
	
    private static Cache cache = Cache.getInstance();

    public static String getIpAddr (HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    public static void unbandleFromID(String studentid) {
        Map<String, String> map = (Map<String, String>) cache.get(StudentAction.SID_IP_M);
        if (null != map.get(studentid) && !map.get(studentid).isEmpty()) {
            map.remove(studentid);
        }
        cache.put(StudentAction.SID_IP_M, map);
    }

    public static void unbandleFromIP(String ip) {
        Map<String, String> map = (Map<String, String>) cache.get(StudentAction.SID_IP_M);
        for (String key : map.keySet()) {
            if (ip.trim().equals(map.get(key))) {
                map.remove(key);
            }
        }
        cache.put(StudentAction.SID_IP_M, map);
    }
}
