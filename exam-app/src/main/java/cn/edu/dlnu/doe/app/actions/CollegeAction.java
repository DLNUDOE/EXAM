package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.dal.bo.College;
import cn.edu.dlnu.doe.util.ParamUtil;
import cn.edu.dlnu.doe.util.StringUtil;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.adaptor.VoidAdaptor;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-7
 * Time: 下午2:06
 */
@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/college")
//@AdaptBy(type = PairAdaptor.class)
@AdaptBy(type = PairAdaptor.class)
@InjectName("collegeAction")
@SuppressWarnings({"unchecked","unused"})
public class CollegeAction {
    private static final Log log = Logs.getLog(CollegeAction.class);
    private Dao rDao;
    private Dao wDao;
    @At("/add")
    @POST
    @AdaptBy(type = VoidAdaptor.class)
    public Object add(HttpServletRequest request) {
        String name = request.getParameter("name");
        if (!StringUtil.isEmpty(name)) {
            College college = new College();
            college.setName(name);
            wDao.insert(college);
            log.info("Insert a College to DB -- ["+ Json.toJson(college)+"]");
            return college;
        }else {
            log.error("PARAM ERROR name:["+name+"]");
            throw new RuntimeException("PARAM ERROR name:["+name+"]");
        }
    }
    @At("/mod")
    @POST
    public void mod(Long id,String name){
        if (ParamUtil.isNull(id,name) || StringUtil.isEmpty(name)){
            log.error("PARAM ERROR id:["+id+"] name:["+name+"]");
            throw new RuntimeException("PARAM ERROR id:["+id+"] name:["+name+"]");
        }
        College college = rDao.fetch(College.class,id);
        if (college == null){
            throw new RuntimeException("CAN NOT FIND COLLEGE BY ID:["+id+"]");
        }
        college.setName(name);
        wDao.update(college);
        log.info("Update College:["+Json.toJson(college)+"]");
    }
    @At("/list")
    public List<College> list(){
        List<College> list = rDao.query(College.class, Cnd.orderBy());
        log.debug("Got College List:["+Json.toJson(list)+"]");
        log.info("Got College List size:["+list.size()+"]");
        return list;
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }
}
