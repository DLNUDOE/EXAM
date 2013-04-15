package cn.edu.dlnu.doe.app.actions;

import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;

import cn.edu.dlnu.doe.dal.bo.IpRoom;



public class TestIpRoomTest {
  @Test
  public void test(){
	  Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
      Dao dao = ioc.get(NutDao.class,"rDao");
      dao.create(IpRoom.class, true);
    IpRoomAction iproom=ioc.get(IpRoomAction.class);
     iproom.add("计算机", "210.30.1", 100L);
      iproom.add("计算机软件", "210.30.1", 100L);
      iproom.add("生命科学", "210.30.2", 200L);
      iproom.add("测试", "210.30.3", 200L);
      iproom.add("经管", "210.30.4", 200L);
      iproom.add("国商", "210.30.5", 200L);
      System.out.println("这是第一页" +iproom.list("210.30", 1, 2));
      System.out.println("这是第二页" +iproom.list("210.30", 2, 2));
      
      
  }
}
