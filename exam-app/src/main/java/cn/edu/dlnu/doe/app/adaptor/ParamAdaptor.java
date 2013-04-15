package cn.edu.dlnu.doe.app.adaptor;

import cn.edu.dlnu.doe.util.annotation.Params;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.HttpAdaptor;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-8
 * Time: 下午3:56
 */
@SuppressWarnings({"unchecked", "unused"})
public class ParamAdaptor implements HttpAdaptor{
    private  Method method;
    private static final Log log = Logs.getLog(ParamAdaptor.class);
    @Override
    public void init(Method method) {
        this.method = method;
    }

    @Override
    public Object[] adapt(ServletContext sc, HttpServletRequest req, HttpServletResponse resp, String[] pathArgs) {

        List<Object> list = new ArrayList<Object>();
        Params params = method.getAnnotation(Params.class);
        Class[] paramCLasses =  method.getParameterTypes();
        String[] paramsName = params.names();
        if(paramCLasses.length != paramsName.length){
            log.debug("GET REQUEST:["+ Json.toJson(req)+"]");
            throw new RuntimeException("params name number not match the method!");
        }
        for (int i=0;i<paramCLasses.length;i++){
            if (paramCLasses[i].equals(req.getClass())){
                list.add(req);
            }else  if(paramCLasses[i].equals(resp.getClass())){
                list.add(resp);
            }else if(paramCLasses[i].equals(sc.getClass())){
                list.add(sc);
            }else {
                String raw = req.getParameter(paramsName[i]);
                if (raw != null){
                    try {
                        list.add(cast(raw,paramCLasses[i]));
                    } catch (Exception e) {
                        log.error(e);
                        throw new RuntimeException("PARAM CAST FAILED "+e.getMessage());
                    }
                }

            }

        }
       return list.toArray();
    }

    private Object cast(String raw,Class type) throws Exception {
        if (type.equals(String.class)){
            return raw;
        }
        if (type.equals(Integer.class)){
            return Integer.parseInt(raw);
        }
        if (type.equals(Long.class)){
            return Long.parseLong(raw);
        }
        if (type.equals(Double.class)){
            return Double.parseDouble(raw);
        }
        if (type.equals(Date.class)){
            if (raw.length() == 10){
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                return sdf.parse(raw);
            }else{
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:SS");
                return sdf.parse(raw);
            }
        }else {
            throw new RuntimeException("CAN NOT CAST CLASS:"+type.getName());
        }

    }
}
