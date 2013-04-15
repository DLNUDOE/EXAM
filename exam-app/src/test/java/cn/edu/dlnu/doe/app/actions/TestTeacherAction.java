package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.dal.bo.Teacher;
import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;
import org.nutz.json.Json;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-7
 * Time: 下午7:52
 */
public class TestTeacherAction {

    @Test
    public void test(){
        Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
        Dao dao = ioc.get(NutDao.class,"rDao");
        dao.create(Teacher.class,true);
        TeacherAction action = ioc.get(TeacherAction.class);
        action.add("20092009","张三","123456",1L,"test@gmail.com","13333333333", Teacher.ROLE_ADMIN);
        action.add("20102010","李四","123456",1L,"test1@gmail.com","13333333333", Teacher.ROLE_NORMAL);
        action.add("20132013","王五","123456",2L,"test2@gmail.com","13333333333", Teacher.ROLE_ADMIN);

        action.mod("20092009", "张三", "123456", 1L, "test@gmail.com", "13333333333", Teacher.ROLE_ADMIN);
        action.mod("20102010", "李四", "123456", 1L, "test1@gmail.com", "13333333333", Teacher.ROLE_NORMAL);
        action.mod("20132013", "王五", "123456", 2L, "test2@gmail.com", "13333333333", Teacher.ROLE_ADMIN);

        System.out.println(Json.toJson(action.list(1L,"",1,10)));
        System.out.println(Json.toJson(action.list(1L,"张",1,10)));
        System.out.println(Json.toJson(action.list(1L, "10", 1, 10)));
//        System.out.println(Json.toJson(action.login("20092009","123456")));
//        System.out.println(Json.toJson(action.login("test@gmail.com","123456")));
//        System.out.println(Json.toJson(action.login("test@gmail.com","12346")));

//        action.del("20092009");
//        action.del("20102010");
//        action.del("20132013");
    }
}
