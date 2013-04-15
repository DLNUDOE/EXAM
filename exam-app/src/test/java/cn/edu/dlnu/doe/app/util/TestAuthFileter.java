package cn.edu.dlnu.doe.app.util;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.easymock.EasyMock;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.ActionContext;
import cn.edu.dlnu.doe.app.filter.AuthFilter;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.PropertiesReader;

public class TestAuthFileter {
	
	private static final Log log = Logs.getLog(AuthFilter.class);
    private LinkedHashMap<String, Integer> authMap;
    private Map<String, Pattern> patternMap;
    private String redirectPage = PropertiesReader.getProperties("doe.redirect");
    private Set<String> excludePaths;
    private boolean enable = PropertiesReader.getPropertiesBool("doe.auth.enable");
    private   ActionContext actionContext=null;
    private   HttpServletRequest httpServletRequest=null;
    private   HttpServletResponse httpServletResponse=null;
    private   PrintWriter printWriter=null;
    private    Cookie[] cookte=new Cookie[1];
    private   Cache cache=null;
  
    public   TestAuthFileter() throws IOException{
      actionContext=EasyMock.createMock(ActionContext.class); 
  	  
  	  httpServletRequest=EasyMock.createMock(HttpServletRequest.class);
  	  
  	  httpServletResponse=EasyMock.createMock(HttpServletResponse.class);
  	  
  	  cookte[0]=EasyMock.createMock(Cookie.class);
  	  
  	  printWriter=EasyMock.createMock(PrintWriter.class);
  	  
  	  cache=EasyMock.createMock(Cache.class);
	  
      }
    

    
    //模拟enable的值修改test中配置文文件/exam-app/src/test/resources/config.properties,置成false
    /*   @Test
	public void testMatch() throws FileNotFoundException{
		 
    	AuthFilter authFilter=new AuthFilter();
		 System.out.println( authFilter.match(actionContext));//返回的只是null;
		
	}*/

/*@Test
//将配置文件中的enable修改成true，测试请求的servletPath被包含在doe.exclude_path
public void testMatch1() throws FileNotFoundException{
 EasyMock.expect(httpServletRequest.getServletPath()).andReturn("/teacher/login.do").anyTimes();
 EasyMock.expect(actionContext.getRequest()).andReturn(httpServletRequest).anyTimes();
 EasyMock.expect(cookte[0].getName()).andReturn("test").anyTimes();
 EasyMock.expect(httpServletRequest.getCookies()).andReturn(cookte).anyTimes();
 EasyMock.expect(httpServletRequest.getAttribute("doe_session_id")).andReturn(" ").anyTimes();
 
 EasyMock.replay(actionContext);
 EasyMock.replay(httpServletRequest);
 EasyMock.replay(cookte);

  AuthFilter authFilter=new AuthFilter();
	authFilter.init();
	 System.out.println( authFilter.match(actionContext));
	
}



@Test
//模拟请求的Sessionid为null或者是sessionID.trim().equals("")、、handleResponse
public void  testMatch2() throws IOException{
	
	 EasyMock.expect(httpServletRequest.getServletPath()).andReturn("/teacher/list.do").anyTimes();
	 EasyMock.expect(actionContext.getRequest()).andReturn(httpServletRequest).anyTimes();
	 EasyMock.expect(cookte[0].getName()).andReturn("test").anyTimes();
	 EasyMock.expect(httpServletRequest.getCookies()).andReturn(cookte).anyTimes();
	 EasyMock.expect(httpServletRequest.getAttribute("doe_session_id")).andReturn(" ").anyTimes();
	 EasyMock.expect(actionContext.getResponse()).andReturn(httpServletResponse).anyTimes();
	 EasyMock.expect(httpServletResponse.getWriter()).andReturn(new PrintWriter(System.out)).anyTimes();
	 EasyMock.replay(actionContext);
	 EasyMock.replay(httpServletRequest);
	 EasyMock.replay(cookte);
	 EasyMock.replay(httpServletResponse);
	 EasyMock.replay(printWriter);
	  AuthFilter authFilter=new AuthFilter();
		authFilter.init();
		 System.out.println( authFilter.match(actionContext));
	
}
   
@Test//测试请求的Servletpath中没有以do结尾！
public void  testMatch3() throws IOException{
	IMocksControl control = EasyMock.createControl();  
    HttpServletResponse httpServletResponsetest= control.createMock(HttpServletResponse.class); 
    EasyMock.expect(httpServletRequest.getServletPath()).andReturn("/teacher/list").anyTimes();
	 EasyMock.expect(actionContext.getRequest()).andReturn(httpServletRequest).anyTimes();
	 EasyMock.expect(cookte[0].getName()).andReturn("test").anyTimes();
	 EasyMock.expect(httpServletRequest.getCookies()).andReturn(cookte).anyTimes();
	 EasyMock.expect(httpServletRequest.getAttribute("doe_session_id")).andReturn(" ").anyTimes();
	 EasyMock.expect(actionContext.getResponse()).andReturn(httpServletResponsetest).anyTimes();
	  EasyMock.expect(httpServletRequest.getContextPath()).andReturn("/exam").anyTimes();
	 EasyMock.replay(actionContext);
	 EasyMock.replay(httpServletRequest);
	 EasyMock.replay(cookte);
	 EasyMock.replay(httpServletResponsetest);
	  AuthFilter authFilter=new AuthFilter();
		authFilter.init();
		 System.out.println( authFilter.match(actionContext));
	
	
}


@Test //测试Session不等于空的
public void  testMatch4() throws IOException{
	  Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
      Cache cache= ioc.get(Cache.class,"cache");
 	 SessionUtil sessionUtil = ioc.get(SessionUtil.class, "sessionUtil");
 	 sessionUtil.setCache(cache);
	 EasyMock.expect(httpServletRequest.getServletPath()).andReturn("/teacher/list").anyTimes();
	 EasyMock.expect(actionContext.getRequest()).andReturn(httpServletRequest).anyTimes();
	 EasyMock.expect(cookte[0].getName()).andReturn("test").anyTimes();
	 EasyMock.expect(httpServletRequest.getCookies()).andReturn(cookte).anyTimes();
	 EasyMock.expect(httpServletRequest.getAttribute("doe_session_id")).andReturn("test").anyTimes();
	 EasyMock.expect(httpServletRequest.getContextPath()).andReturn("/exam").anyTimes();
	 EasyMock.expect(actionContext.getResponse()).andReturn(httpServletResponse).anyTimes();
	 EasyMock.expect(httpServletResponse.getWriter()).andReturn(new PrintWriter(System.out)).anyTimes();
	 EasyMock.replay(actionContext);
	 EasyMock.replay(httpServletRequest);
	 EasyMock.replay(cookte);
	 EasyMock.replay(httpServletResponse);
	 EasyMock.replay(printWriter);
	  AuthFilter authFilter=new AuthFilter();
		authFilter.init();
		 System.out.println( authFilter.match(actionContext));
	
}*/
  

// Cookie在这里不会为空，在另外的一个过滤器中SessionAddFilter中已经对cookie进行了处理！
 /*@Test //测试cookie为空的情况    
public void testMatch5() throws IOException{
	EasyMock.expect(httpServletRequest.getServletPath()).andReturn("/teacher/list").anyTimes();
	 EasyMock.expect(actionContext.getRequest()).andReturn(httpServletRequest).anyTimes();
	 EasyMock.expect(cookte[0].getName()).andReturn(null).anyTimes();
	 EasyMock.expect(httpServletRequest.getCookies()).andReturn(cookte).anyTimes();
	 EasyMock.expect(httpServletRequest.getAttribute("doe_session_id")).andReturn("test").anyTimes();
	 EasyMock.expect(httpServletRequest.getContextPath()).andReturn("/exam").anyTimes();
	 EasyMock.expect(actionContext.getResponse()).andReturn(httpServletResponse).anyTimes();
	 EasyMock.expect(httpServletResponse.getWriter()).andReturn(new PrintWriter(System.out)).anyTimes();
	 EasyMock.replay(actionContext);
	 EasyMock.replay(httpServletRequest);
	 EasyMock.replay(cookte);
	 EasyMock.replay(httpServletResponse);
	 EasyMock.replay(printWriter);
	 AuthFilter authFilter=new AuthFilter();
		authFilter.init();
		 System.out.println( authFilter.match(actionContext));
}*/
    

    
	
}
