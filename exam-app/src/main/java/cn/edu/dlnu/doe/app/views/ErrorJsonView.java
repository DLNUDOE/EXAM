package cn.edu.dlnu.doe.app.views;

import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.View;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-8
 * Time: 下午2:52
 */
public class ErrorJsonView implements View {
    private static final Log log = Logs.getLog(ErrorJsonView.class);
    @Override
    public void render(HttpServletRequest req, HttpServletResponse resp, Object obj) throws Throwable {
        Exception e = (Exception)obj;
        String path = req.getServletPath();
        log.error("ERROR! path:["+path+"] type:["+e.getClass().getName()+"] message:["+e.getMessage()+"]");
        if (path.endsWith(".do")){
        resp.setStatus(200);
        resp.getWriter().append("{\"success\":false,\"msg\":\""+e.getMessage()+"\"}");
        }else {
            req.setAttribute("msg",e.getMessage());
            req.getRequestDispatcher("/500.jsp").forward(req,resp);
        }
    }
}
