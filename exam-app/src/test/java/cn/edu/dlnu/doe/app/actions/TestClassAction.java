package cn.edu.dlnu.doe.app.actions;

import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;
import org.nutz.json.Json;

import cn.edu.dlnu.doe.dal.bo.Class;

public class TestClassAction {

	@Test
	public void test() {
		Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
        Dao dao = ioc.get(NutDao.class,"rDao");
        dao.create(Class.class, true);
        ClassAction action = ioc.get(ClassAction.class);
        
        action.add(1L, "计科101");
        action.add(2L, "计科102");
        action.add(3L, "计科103");
        
        action.mod(1L, 1L, "计科101");
        action.mod(2L, 1L, "计科102");
        action.mod(3L, 1L, "计科103");
        
        System.out.println(Json.toJson(action.list(1L)));
        
	}

}
