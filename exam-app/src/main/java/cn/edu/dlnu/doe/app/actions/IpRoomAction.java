package cn.edu.dlnu.doe.app.actions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.AdaptBy;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Fail;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.Param;
import cn.edu.dlnu.doe.dal.bo.IpRoom;

@Ok("ioc:template")
@Fail("json")
@IocBean
@At("/iproom")
@AdaptBy(type = PairAdaptor.class)
@InjectName("ipRoomAction")
@SuppressWarnings({"unchecked", "unused"})
public class IpRoomAction {
    private static final Log log = Logs.getLog(IpRoomAction.class);
    private Dao rDao;
    private Dao wDao;

    @At("/add")
    public Object add(String name, String scope, Long capacity) {

        checkParam(name, scope, capacity);
        checkIp(scope);
        IpRoom ipRoom = new IpRoom();
        ipRoom.setName(name);
        ipRoom.setScope(scope);
        ipRoom.setCapacity(capacity);
        wDao.insert(ipRoom);
        return ipRoom;
    }

    @At("/mod")
    public void mod(Long id, String name, String scope, Long capacity) {
        checkParam(name, scope, capacity);
        checkIp(scope);
        IpRoom ipRoom = rDao.fetch(IpRoom.class, id);
        if (null == ipRoom) {
            log.error("PARAM ERROR id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR id:[" + id + "]");
        }
        ipRoom.setName(name);
        ipRoom.setCapacity(capacity);
        ipRoom.setScope(scope);
        wDao.update(ipRoom);
        log.info("UPDATE a iproom to DB[" + Json.toJson(ipRoom) + "]");
    }

//
//    @At("/del")
//    public void del(@Param("ids") Long[] ids) {
//
//        if (ids == null || ids.length == 0) {
//            log.error("PARAM ERROR ids:[" + ids + "]");
//            throw new RuntimeException("PARAM ERROR ids:[" + ids + "]");
//        } else {
//            for (Long id:ids) {
//                if (1 != wDao.delete(IpRoom.class, id)) {
//                    log.error("PARAM ERROR id:[" + id + "]");
//                    throw new RuntimeException("PARAM ERROR ids:[" + id + "]");
//                }
//            }
//        }
//    }

    @At("/list")
    public Object list(@Param("key") String key, @Param("page") Integer page, @Param("limit") Integer limit) {

        if (page == null || limit == null || page < 0 || limit < 0) {
            log.error("PARAM ERROR page:" + page + "+limit:+" + limit + "");
            throw new RuntimeException("PARAM ERROR page:" + page + "");
        }
        List<IpRoom> list;
        Integer count;

        Pager pager = rDao.createPager(page, limit);

        if (key == null) {
            list = rDao.query(IpRoom.class, null, pager);
            count = rDao.count(IpRoom.class, null);
        } else {
            key = "%" + key + "%";
            SqlExpression e1 = Cnd.exps("name", "like", key);
            SqlExpression e2 = Cnd.exps("scope", "like", key);
            list = rDao.query(IpRoom.class, Cnd.where(e2).or(e1), pager);
            count = rDao.count(IpRoom.class, Cnd.where(e2).or(e1));
        }

        log.debug("Got IPRomms list:[" + Json.toJson(list) + "]");
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("list", list);
        res.put("total", count);
        return res;

    }

    private void checkParam(String name, String scope, Long capacity) {
        if (name == null || scope == null || capacity == null) {
            log.error("PARAM ERROR:name:+:name+:" + name + ":scope:" + scope + ":+capacity+:" + capacity + "");
            throw new RuntimeException("PARAM ERROR:name:+:name+:" + name + ":scope:" + scope + ":+capacity+:" + capacity + "");
        }
        if (name.trim().isEmpty() || scope.trim().isEmpty()) {
            log.error("PARAM ERROR:name:[" + name + "]:scope:" + scope + "]");
            throw new RuntimeException("PARAM ERROR:name:[" + name + "]:scope:[" + scope + "]");
        }
    }

    private void checkIp(String str) {
        Pattern p = Pattern.compile("[.]");
        String[] results = p.split(str);
        for (String result:results) {
            if (!isNumeric(result)) {
                throw new RuntimeException("你输入的IP中包含了除数字和点以外的非法字符");
            }
            if (Integer.parseInt(result) > 254) {
                throw new RuntimeException("你输入的IP范围过大");
            }
        }
    }

    private boolean isNumeric(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        return pattern.matcher(str).matches();
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }
}
