package cn.edu.dlnu.doe.app.filter;

import com.google.gson.Gson;
import org.nutz.json.Json;
import org.nutz.lang.Files;
import org.nutz.lang.Streams;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mapl.Mapl;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-6
 * Time: 下午8:51
 */
@SuppressWarnings({"unchecked", "unused"})
public class JsonFilter implements Filter {

    private static final Log log = Logs.getLog(JsonFilter.class);
    private Map<String,String> urlMap = new LinkedHashMap<String, String>();
    private Map<String,Pattern> patternMap = new LinkedHashMap<String, Pattern>();
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
  
        File mapping = Files.findFile("mapping.json");
        try {
           urlMap = Json.fromJson(urlMap.getClass(),new FileReader(mapping));
            if(!urlMap.isEmpty()){
                for(String url:urlMap.keySet()){
                    Pattern p = Pattern.compile(url);
                    patternMap.put(url,p);
                }
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            log.error(e.getMessage());
        }
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest)servletRequest;
        servletResponse.setCharacterEncoding("utf8");
        servletRequest.setCharacterEncoding("utf8");
        String url = req.getServletPath();
//        log.debug("GET URL PATH:["+url+"]");
        for(String u:patternMap.keySet()){
            Matcher matcher = patternMap.get(u).matcher(url);
            if (matcher.find()){
                //log.debug("FOUND MATCH PATTERN:["+u+"]");
                String jsonFilePath = urlMap.get(u);
                jsonFilePath = req.getRealPath("WEB-INF/templates/"+jsonFilePath);
                File jsonFile = Files.findFile(jsonFilePath);
                if (jsonFile == null){
                    filterChain.doFilter(servletRequest,servletResponse);
                }
                Gson gson = new Gson();
//                servletResponse.getWriter().append(Json.toJson(Json.fromJson(new FileReader(jsonFile))));
                String line;
                BufferedReader br = new BufferedReader(Streams.fileInr(jsonFile));
                line = br.readLine();
                while(null != line && !line.trim().isEmpty()){
                    servletResponse.getWriter().append(line.trim());
                    line = br.readLine();
                }
                servletResponse.getWriter().flush();
                br.close();
                return;
            }
        }
        //log.debug("CAN NOT FIND MATCH PATTERN FOR URL:["+url+"]");
        filterChain.doFilter(servletRequest,servletResponse);
    }

    @Override
    public void destroy() {
    }
}
