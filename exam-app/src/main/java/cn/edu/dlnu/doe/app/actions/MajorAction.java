package cn.edu.dlnu.doe.app.actions;

import cn.edu.dlnu.doe.dal.bo.Major;
import cn.edu.dlnu.doe.util.ParamUtil;
import cn.edu.dlnu.doe.util.StringUtil;
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
 * Time: 下午5:11
 */
@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/major")
@AdaptBy(type = PairAdaptor.class)
@InjectName("majorAction")
@SuppressWarnings({"unchecked", "unused"})
public class MajorAction {
    private static final Log log = Logs.getLog(MajorAction.class);
    private Dao rDao;
    private Dao wDao;

    @At("/add")
    @POST
    public Object add(Long collegeid, String name) {
        if (ParamUtil.isNull(collegeid, name) || StringUtil.isEmpty(name) || collegeid < 0) {
            log.error("PARAM ERROR ! collegeid:{" + collegeid + "],name:[" + name + "]");
            throw new RuntimeException("PARAM ERROR ! collegeid:{" + collegeid + "],name:[" + name + "]");
        }
        Major major = new Major();
        major.setCollegeid(collegeid);
        major.setName(name);
        wDao.insert(major);
        log.info("INSERT a Major to DB -- [" + Json.toJson(major) + "}");
        return major;
    }

    @At("/mod")
    @POST
    public void mod(Long id, Long collegeid, String name) {
        if (ParamUtil.isNull(id, collegeid, name) || StringUtil.isEmpty(name)) {
            log.error("PARAM ERROR ! id:[" + id + "] collegeid:{" + collegeid + "],name:[" + name + "]");
            throw new RuntimeException("PARAM ERROR ! id:[" + id + "] collegeid:{" + collegeid + "],name:[" + name + "]");
        }
        Major major = rDao.fetch(Major.class, id);
        if (major == null) {
            log.error("CAN NOT FIND MAJOR BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND MAJOR BY ID:[" + id + "]");
        }
        major.setCollegeid(collegeid);
        major.setName(name);
        wDao.update(major);
        log.info("Update Major TO DB -- [" + major + "]");
    }

    @At("/list")
    public List list(Long collegeid) {
        if (collegeid == null || collegeid < 0) {
            log.error("PARAM ERROR collegeid:{" + collegeid + "]");
            throw new RuntimeException("PARAM ERROR collegeid:{" + collegeid + "]");
        }
        List<Major> list = rDao.query(Major.class, Cnd.where("collegeid", "=", collegeid));
        log.debug("Got List :[" + Json.toJson(list) + "]");
        log.info("Get Major List size:[" + list.size() + "]");
        return list;
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }
}
