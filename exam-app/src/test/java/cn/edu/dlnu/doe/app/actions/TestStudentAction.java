package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.dal.bo.College;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;
import org.nutz.json.Json;

import cn.edu.dlnu.doe.dal.bo.Student;
import org.nutz.lang.Files;
import org.nutz.mvc.upload.TempFile;

import java.io.File;

public class TestStudentAction {
	private Ioc ioc = null;
	private Dao dao = null;
	private StudentAction action = null;

    @Mock
    private TempFile tempFile;

	@Before
	public void setUp() throws Exception {
		ioc = new NutIoc(new JsonLoader("ioc.js"));
        dao = ioc.get(NutDao.class,"wDao");
        dao.create(Student.class, true);
        dao.create(College.class,true);
        action = ioc.get(StudentAction.class);
	}

	@Test
	public void test() {
		
		action.add("2010000001", "赵大", 1L, 1L, 1L);
		action.add("2010000002", "钱二", 1L, 2L, 1L);
		action.add("2010000003", "孙三", 1L, 1L, 2L);
		
		action.mod("2010000001", "赵大", "asdasd", 1L, 1L, 1L, "asd@qq.com", null);
		action.mod("2010000002", " 钱二货", "asdasd", 1L, 2L, 2L, "asdd@qq.com", "test");
		action.mod("2010000003", " 孙三三", "asdasd", 2L, 2L, 1L, "asddd@qq.com", "test2");
		
		System.out.println(Json.toJson(action.list(-1L, -1L, -1L, "", 1, 10)));
		System.out.println(Json.toJson(action.list(1L, -1L, -1L, "", 1, 10)));
		System.out.println(Json.toJson(action.list(-1L, -1L, -1L, "asd@qq.com", 1, 10)));
		System.out.println(Json.toJson(action.list(-1L, -1L, -1L, "钱二", 1, 10)));
	}
    @Test
    public void testFileUpload(){

        File xls = Files.findFile("temp.xls");
        System.out.println(xls);
        MockitoAnnotations.initMocks(this);
        Mockito.when(tempFile.getFile()).thenReturn(xls);
        System.out.println(Json.toJson(action.batch(tempFile)));
    }


}
