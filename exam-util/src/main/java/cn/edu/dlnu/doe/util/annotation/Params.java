package cn.edu.dlnu.doe.util.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-8
 * Time: 下午4:01
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Params {
    String[] allowNull() default {""};
    String[] names() default {""};
}
