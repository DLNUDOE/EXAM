package cn.edu.dlnu.doe.app.actions;

import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;

import cn.edu.dlnu.doe.dal.bo.Course;


public class TestCourseAction {
	@Test
	public void test(){
		Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
        Dao dao = ioc.get(NutDao.class,"rDao");
        CourseAction action = ioc.get(CourseAction.class);
        dao.create(Course.class, true);
        action.add("测试学院", 1L, "外语");
        action.add("计算机",1l,"test");
        action.add("设计学院",2L,null);
        action.add("nnnn", 3L, "计算机");
        action.del(2L);
     action.list(2L, "1", 1, 4);
        
        
        
	}

}
