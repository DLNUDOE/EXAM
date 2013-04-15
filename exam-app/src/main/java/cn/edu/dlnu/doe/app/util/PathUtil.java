package cn.edu.dlnu.doe.app.util;


import javax.servlet.ServletContext;
@SuppressWarnings({"unchecked", "unused"})
public class PathUtil {
	private ServletContext sc;
    public String getPath(String path) {
        return sc.getRealPath(path);
    }
    public String getContextPath(String path) {
        return sc.getContextPath();
    }

}
