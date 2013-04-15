package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.dal.bo.Class;
import cn.edu.dlnu.doe.util.ParamUtil;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.*;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-7
 * Time: 下午6:02
 */
@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/class")
@AdaptBy(type = PairAdaptor.class)
@InjectName("classAction")
@SuppressWarnings({"unchecked","unused"})
public class ClassAction {
    private static final Log log = Logs.getLog(ClassAction.class);
    private Dao rDao;
    private Dao wDao;
    @At("/add")
    @POST
    public Object add(Long majorid,String name){
        if (ParamUtil.isNull(majorid,name) || ParamUtil.isEmpty(name)){
            log.error("PARAM ERROR ! majorid:{"+majorid+"],name:["+name+"]");
            throw new RuntimeException("PARAM ERROR ! majorid:{"+majorid+"],name:["+name+"]");
        }
        Class clazz = new Class();
        clazz.setMajorid(majorid);
        clazz.setName(name.trim());
        wDao.insert(clazz);
        log.info("INSERT a Class to DB -- ["+ Json.toJson(clazz)+"}");
        return clazz;
    }
    @At("/mod")
    @POST
    public void  mod(Long id,Long majorid,String name){
        if (ParamUtil.isNull(id)){
            log.error("PARAM ERROR! id:{"+id+"]");
            throw new RuntimeException("PARAM ERROR! id:{"+id+"]");
        }
        if (ParamUtil.isEmpty(name) || ParamUtil.isNull(majorid) || majorid.intValue()<0){
            log.error("PARAM ERROR ! majorid:{"+majorid+"],name:["+name+"]");
            throw new RuntimeException("PARAM ERROR ! majorid:{"+majorid+"],name:["+name+"]");
        }
        Class clazz = rDao.fetch(Class.class,id);
        if (clazz == null){
            throw new RuntimeException("CAN NOT FIND CLASS BY ID:["+id+"]");
        }
        clazz.setMajorid(majorid);
        clazz.setName(name.trim());
        wDao.update(clazz);
        log.info("Update Class TO DB -- ["+clazz+"]");
    }
    @At("/list")
    public List list(Long majorid){
        if (majorid == null){
            log.error("PARAM ERROR Classid:{"+majorid+"]");
            throw new RuntimeException("PARAM ERROR Classid:{"+majorid+"]");
        }
        List<Class> list = rDao.query(Class.class, Cnd.where("majorid", "=", majorid));
        log.debug("Got List :["+Json.toJson(list)+"]");
        log.info("Get Class List size:["+list.size()+"]");
        return  list;
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }
}
