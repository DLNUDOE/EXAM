package cn.edu.dlnu.doe.app.actions;


import java.util.Date;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;
import org.nutz.json.Json;

import cn.edu.dlnu.doe.dal.bo.Paper;

public class TestPaperAction {

	Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
    Dao dao;
    
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		
	}
	@Before
	public void setup(){
		dao = ioc.get(NutDao.class,"rDao");
        dao.create(Paper.class, true);
	}
	

	@Test
	public void test() {
        Paper paper = dao.fetch(Paper.class, 2);
        if(null == paper){
        	System.out.println("没找到");
        }
        System.out.println(Json.toJson(paper));
	}

	@Test
	public void testTmie(){
		Date startTime = new Date();
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {}
		System.out.println(new Date().getTime() - startTime.getTime());
	}
	
}
