package cn.edu.dlnu.doe.app.views;

import cn.org.rapid_framework.freemarker.directive.BlockDirective;
import cn.org.rapid_framework.freemarker.directive.ExtendsDirective;
import cn.org.rapid_framework.freemarker.directive.OverrideDirective;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.nutz.json.Json;
import org.nutz.lang.Files;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.View;
import org.nutz.mvc.view.HttpStatusView;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-6
 * Time: 下午2:35
 */
@SuppressWarnings({"unchecked"})
public class DispatchView implements View {
	public static final String TRUE_STR = "true";
	public static final String FALSE_STR = "false";
    private static final Log log = Logs.getLog(DispatchView.class);
    private HttpStatusView statusView = new HttpStatusView(404);
    private ServletContext context;
    private Configuration cfg;
    private LinkedHashMap<String, String> urlMap;
    private Map<String, Pattern> patternMap;

    public void init(ServletContext context) throws FileNotFoundException {
        this.context = context;
        cfg = new Configuration();
        cfg.setServletContextForTemplateLoading(context, "WEB-INF/templates");
        cfg.setDefaultEncoding("utf8");
        cfg.setSharedVariable("block", new BlockDirective());
        cfg.setSharedVariable("override", new OverrideDirective());
        cfg.setSharedVariable("extends", new ExtendsDirective());
        File config = Files.findFile("mapping.json");
        if (null == config) {
            log.error("Can not find path:[classpath:mapping.json]");
            throw new FileNotFoundException("Can not find path:[classpath:mapping.json]");
        }

        FileReader reader = new FileReader(config);
        urlMap = new LinkedHashMap<String, String>();
        urlMap = Json.fromJson(urlMap.getClass(),reader);
        log.info("Get url mapping:[" + urlMap + "]");
        patternMap = new LinkedHashMap<String, Pattern>();
        if (!urlMap.isEmpty()) {
            for (String url : urlMap.keySet()) {
                patternMap.put(url, Pattern.compile(url));
            }
        }

    }
    @Override
    public void render(HttpServletRequest req, HttpServletResponse resp, Object obj) throws Throwable {
        try {
            String rawUrl = req.getServletPath();
            log.info("get url:[" + rawUrl + "]");
//            Map map = Json.fromJson(Map.class, Json.toJson(obj));
            Template template = null;
            for (String url : patternMap.keySet()) {
                Pattern pattern = patternMap.get(url);
                Matcher matcher = pattern.matcher(rawUrl);
                if (matcher.find()) {
                    String tempUrl = urlMap.get(url);
                    if (tempUrl.endsWith("ftl"))
                        template = cfg.getTemplate(tempUrl);
                    else if(tempUrl.equalsIgnoreCase("raw")){
                        Map<String,Object> map = new HashMap<String,Object>();
                        map.put("success",true);
                        map.put("data",obj);
                        log.info("OUT PUT RAW RESPONSE:["+Json.toJson(map)+"]");
                        resp.getWriter().append(Json.toJson(map));
                        return;
                    }
                    else {
                        return;
                    }
                    break;
                }
            }
            if (null == template) {
                //TODO throw 404;
                log.warn("can not find url:["+rawUrl+"]");
                statusView.render(req, resp, obj);
            } else {
                Map<String,Object> map = new HashMap<String,Object>();
                map.put("success",TRUE_STR);
//                map.put("data",Mapl.toMaplist(obj));
                map.put("data",obj);
                template.process(map, resp.getWriter());
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(200);
            if (req.getServletPath().endsWith(".do")){
                resp.getWriter().append("{success:false,msg:'"+e.getMessage()+"'}");
            }else {
                Template template = cfg.getTemplate("error.ftl");
                Map<String,String> res = new LinkedHashMap<String,String>();
                res.put("msg",e.getMessage());
                template.process(res,resp.getWriter());
            }
        }

    }

    public ServletContext getContext() {
        return context;
    }

    public void setContext(ServletContext context) {
        this.context = context;
    }

    public Configuration getCfg() {
        return cfg;
    }

    public void setCfg(Configuration cfg) {
        this.cfg = cfg;
    }

    public LinkedHashMap<String, String> getUrlMap() {
        return urlMap;
    }

}
