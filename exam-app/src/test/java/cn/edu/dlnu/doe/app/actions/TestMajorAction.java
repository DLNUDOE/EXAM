package cn.edu.dlnu.doe.app.actions;

import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;
import org.nutz.json.Json;

import cn.edu.dlnu.doe.dal.bo.Major;

public class TestMajorAction {

	@Test
	public void test() {
		Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
        Dao dao = ioc.get(NutDao.class,"rDao");
        dao.create(Major.class, true);
        MajorAction action = ioc.get(MajorAction.class);
        
        action.add(1L, "计科");
        action.add(1L, "网络");
        action.add(1L, "软件");
        
        action.mod(1L, 1L, "计算机科学与技术");
        action.mod(2L, 1L, "网络工程");
        action.mod(3L, 1L, "软件工程");
        
        System.out.println(Json.toJson(action.list(1L)));
	}

}
