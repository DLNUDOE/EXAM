package cn.edu.dlnu.doe.app;

import cn.edu.dlnu.doe.app.filter.AuthFilter;
import cn.edu.dlnu.doe.app.filter.LoginFilter;
import cn.edu.dlnu.doe.app.filter.SessionAddFilter;
import cn.edu.dlnu.doe.app.util.IpUtil;
import cn.edu.dlnu.doe.app.util.SessionUtil;
import cn.edu.dlnu.doe.dal.bo.Student;
import cn.edu.dlnu.doe.util.PropertiesReader;
import org.nutz.mvc.annotation.*;
import org.nutz.mvc.ioc.provider.JsonIocProvider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-5
 * Time: 下午3:37
 */
@Modules(scanPackage = true)
@IocBy(type = JsonIocProvider.class, args = {"ioc"})
@SetupBy(SetupApp.class)
//@Filters({@By(type = SessionAddFilter.class),@By(type = LoginFilter.class,args = {"ioc:loginFilter"}),@By(type = AuthFilter.class,args = {"ioc:authFilter"})})
@Filters({@By(type = SessionAddFilter.class, args = {"ioc:sessionAddFilter"}), @By(type = LoginFilter.class, args = {"ioc:loginFilter"}), @By(type = AuthFilter.class, args = {"ioc:authFilter"})})
@SuppressWarnings({"unchecked", "unused"})
public class MainModule {
    @At("/heartbeat")
    public void heartBeat() {
    }

    @At("/logout")
    public void logout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Integer role = (Integer) SessionUtil.getFromSession("role", req);
        if (role != null && role == Student.ROLE_ID && PropertiesReader.getPropertiesBool("doe.auth.ip.enable")) {
            Student student = (Student) SessionUtil.getFromSession("self", req);
            IpUtil.unbandleFromID(student.getId());
        }
        SessionUtil.removeSession("self", req);
        resp.sendRedirect("client/login.html");
    }

    @At("/")
    public void root(HttpServletRequest req, HttpServletResponse response) throws IOException {
        response.sendRedirect("index.html");
    }

    @At("/index")
    @Ok("ioc:template")
    public Object main(HttpServletRequest req) throws IOException {
       return SessionUtil.getFromSession("self", req);
    }

}
