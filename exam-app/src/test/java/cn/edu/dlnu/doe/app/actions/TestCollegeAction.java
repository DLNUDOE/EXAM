package cn.edu.dlnu.doe.app.actions;

import static org.easymock.EasyMock.*;

import javax.servlet.http.HttpServletRequest;

import org.junit.Before;
import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;
import org.nutz.json.Json;

import cn.edu.dlnu.doe.dal.bo.College;

public class TestCollegeAction {
	
	private HttpServletRequest mockRequest;
	
	@Before
	public void setUp() throws Exception {
		
		mockRequest = createMock(HttpServletRequest.class);
		
	}
	
	@Test
	public void test() {
		Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
        Dao dao = ioc.get(NutDao.class,"rDao");
        dao.create(College.class, true);
        CollegeAction action = ioc.get(CollegeAction.class);
        
        expect(mockRequest.getParameter("name")).andReturn("test学院");
        replay(mockRequest);
        
        action.add(mockRequest);
        
        action.mod(1L, "计算机");
        
        System.out.println(Json.toJson(action.list()));
        verify(mockRequest);
	}

}
