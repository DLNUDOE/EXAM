package cn.edu.dlnu.doe.util;


/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-10
 * Time: 下午1:45
 */
public class ParamUtil {
    public static boolean isNull(Object... params){
        for (Object o:params){
            if (o == null){
                return true;
            }
        }
        return false;
    }
    public static boolean isEmpty(String... params){
        for (String o:params){
            if (o == null || o.isEmpty()){
                return true;
            }
        }
        return false;
    }
}
