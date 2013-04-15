package cn.edu.dlnu.doe.util;

import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-10
 * Time: 下午1:58
 */
public class StringUtil {
    public static boolean isEmpty(String o){
        if (o==null||o.trim().isEmpty()){
            return true;
        }
        return false;
    }
    public static boolean isEmail(String email){
        Pattern pattern = Pattern.compile("^[0-9a-z][a-z0-9\\._-]{1,}@[a-z0-9-]{1,}[a-z0-9]\\.[a-z\\.]{1,}[a-z]$");
        if(pattern.matcher(email).find()){
            return true;
        }
        return false;
    }
    public static boolean isTel(String tel){
        Pattern pattern = Pattern.compile("((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)");
        if(pattern.matcher(tel).find()){
            return true;
        }
        return false;
    }
}
