<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%><%@page import="java.sql.CallableStatement"%><%@page import="oracle.jdbc.OracleTypes"%><%@page import="java.sql.ResultSet"%><%@page import="dreamonline.base.DbDAO"%>


<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String username = (String)session.getAttribute("username");
String account = (String)session.getAttribute("account");
if(username == null)
	response.sendRedirect("login.htm");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>考试系统 Welcome to DLNU dream-online exam system</title>
<script type="text/javascript" src="js/clock.js"></script>
<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
 <script type="text/javascript" src="js/examList.js"></script>
<style type="text/css">
      
      #dlg{width:610px;position: absolute;top:250px;left:200px; 
        z-index:10000;display: none;
      }
      #dlg-content{position: relative;}
       .dlgbg{background:url(images/dlg.png) -5px -20px no-repeat;}
       
      #dlg-title{height:14px;  }
      #caption{font:normal normal bold 16px Arial;color:Black;position:relative;top:20px;left:30px;}
      #close{font:normal normal normal 16px Arial;color:Black;position:absolute;top:20px;right:20px;cursor:pointer;z-index:10000}
       #close:hover{font-weight: bold;color:Red}
      #dlg-body{padding:8px;background-repeat: repeat-y;background-position: -623px;padding:30px 42px 60px 42px;}
       #desc,#duration{font:normal normal normal 16px/20px Arial;color:#1E1E1E;}
      #dlg-body #time{font:normal normal bold 14px/36px Arial;color:#5555;}
    
      #dlg-foot{height:10px;position: relative; padding:4px;background-position:-5px -4px;}
      #dlg-foot input{cursor:pointer;color:#E8E8E8;position: absolute;top:-40px;border:none;
      text-align: center;letter-spacing:4px; width:88px;font:normal normal bold 14px/32px Arial; 
      background:#6CA6CD;
      }
      #auto-go{color:#1E1E1E;zoom:1;overflow:auto;}
     #auto-go label,#auto-go input{float:left;font-size:12px;line-height: 18px; }
       #dlg-foot input:hover{color:White;background:#3775C7; }
      #cancel{left:30px;}
      #ok{  right:30px;top:-40px;   letter-spacing:2px;}
      
    </style>
    
<style type="text/css">
  body{
	    margin:0;
		padding:0;
		font-family:微软雅黑; 
		background:#EDEFF1;
		position: relative;
	  }
  #header{
	    margin:0;
	    width:100%;
		height:65px;
		background:#124062;
	  }
  .head{
	    margin:0 auto;
		padding-top:5px;
		width:900px;
		overflow:hidden;
		zoom:1;
	  }
  .logo{
	   margin:0;
	   padding:0;
	   background-image:url(images/list-logo.png);
	   background-repeat:no-repeat;
	   background-position: left top;
	   height:50px;
	   width:296px;
       text-indent: -9999px;
	   float:left;
	  }
  #content{
	   margin:0;
	   padding-top:20px;
	  }
  .examlist{
	   background:#F6F6F6;
	   margin:0 auto;
	   padding:0;
	   width:900px;
	   background:#EDEFF1;
	  }
   .listhead{
	   
	   font-size:16px;color:#0F3D5E;
	   }
   .list{
	   width:100%;
	   margin-bottom:100px;
	   }
   .list th{background:#DFE2E4;border:1px solid #C6C8CB;padding:10px;font-size:16px;font-weight:normal;color:#0F3D5E;}
   .list td{background:#F6F6F6;border:1px solid #E1E1E1;padding:10px;text-align:center;}
   .description{
	   font-size:14px;
	   }
   #footer
	{
		 margin-top:40px;
		width:100%;
		text-align:center;
		font-size:12px;
		font-weight:bold;
		color:#708090;
        padding:8px 0  8px 0;
		}
   #footer span:hover{
	    color:#7E9CAF;
	   }
   .user{
		color:#fff;
		float:right;
		margin-top:15px;
		padding-left:160px;
	   }
   .userInfo{
	    color:#6C3;
		font-weight:bold;
		padding:2px 2px 2px 22px;
		text-decoration:none;
		 background:url(images/userpic.png) 0 4px no-repeat;
		    	color:#6C3;
		    	 cursor:pointer;		    		    			    	
	   }
	.userInfo:hover{
	background-position: 0 -20px;
	}   
	   
   .quit{
        margin-left:20px;
		text-decoration:none;
		color:#fff;
		cursor:pointer;
   }
   .quit:hover{
        color:#6C3;
   }
   .go-exam{    
     text-align: center;letter-spacing:2px; width:88px;font:normal normal bold 14px/28px Arial; 
     border:none;
      background:#DFE2E4;
      color:#124062;
     cursor:pointer}
   input.go-exam:hover{   background:#3775C7;color:White}
   
   #about-us{margin-left:20px;}
  #about-us a{color:#708090;font-family: "Microsoft Yahei";text-decoration: none;}
  #about-us a:hover{text-decoration: underline;}
</style>


<!--[if IE 6]> 
    <style type="text/css">
      body{behavior:url(css/csshover.htc);}
    </style>                     
    <script type="text/javascript" src="js/DD_belatedPNG_0.0.8a-min.js"></script>
    <script type="text/javascript">
     DD_belatedPNG.fix('.logo');
       DD_belatedPNG.fix('.userInfo');
     </script>
  <![endif]-->
</head>
<body>
  <div id="header"><div class="head"><h1 class="logo">考试系统Dream-Online</h1><span class="user"><a href='student.htm' class="userInfo" title="<%=account %>"> <%=username %>  </a><a class="quit" id='quit' href="logout">注销</a></span></div></div>
  <div id="content">
    <div class="examlist">
      <h2 class="listhead" >今日考试</h2>
      <table class="list" cellspacing="0">
       <tr>
        <th>考试标题</th>
        <th>考试时间</th>
        <th>考试时长</th>
        <th>考试状态</th>
       </tr>
       <%DbDAO dbmanager = DbDAO.getInstance();
       		CallableStatement cst = dbmanager.getCst("{?=call roll_exam.return_exam_today(?)}");
       		cst.registerOutParameter(1,OracleTypes.CURSOR);
       		cst.setString(2,(String)session.getAttribute("account"));
       		cst.execute();
       		ResultSet rs = (ResultSet)cst.getObject(1);
       		HashMap<String,String[]> examMap = new HashMap<String,String[]>();
       		while(rs.next()){
       		String[] info = new String[6];//examid,examname,paperid,timejiange,time,ip
       		info[0] = rs.getString(1);
       		info[1] = rs.getString(2);
       		info[2] = rs.getString(3);
       		info[3] = rs.getString(4);
       		info[4] = rs.getInt(5)+"";
       		info[5] = rs.getString(6);
       		examMap.put(info[0],info);
       		
        %> 
        <tr>
        <td><%=info[1] %></td>
        <td><%=info[3] %></td>
        <td><%=info[4] %>分钟</td>
        <td><input type='button' class='go-exam'  value='参加考试' examid='<%=info[0] %>'/><div></div></td>
       </tr>
        <%}
        	session.setAttribute("examMap",examMap);
        	rs.close();
        	cst.close();
        	dbmanager.close();
         %>
       
      </table>
      <h2 class="listhead">我需留意<span id='clock'></span></h2>
      <div class="description">
        <p>1.考试过程中请不要关闭浏览器，以免造成用户掉线 (+_+)</p>
        <p>2.考试过程中请仔细阅读题目，并认真严肃地填写答案，请考生认真对待每一次考试 (+_+)</p>
        <p>3.如需要换机器，须征求老师的同意；退出时，请通过注销方式退出 (+_+)</p>
        <p>4.考试过程中有任何问题请举手向监考老师提出意见 (+_+)</p>
        <p>5.欢迎大家关注考试系统————简单考试，快乐学习(^_^)</p>
      </div>
    </div>
  </div>
   <div id="footer"><span>Copyright © 2008 - 2012 Dream-Online. All Rights Reserved.</span><span id='about-us'>@<a  href='../ourteam/cool/index.html' target="_blank" >关于我们</a></span></div>
  <div  >
  <div id='dlg' >
        <div id="dlg-content">
          <div id="dlg-title" class='dlgbg'>
          <a id="caption">考试安排</a>
          <a id='close'>╳</a>
        </div>
        <div id="dlg-body" class='dlgbg'>
            <div id='desc'> 考试标题 </div>
            <div id='duration' style='padding:8px 0'> 2011-11-22 11:11:11 至  2011-11-22 22:22:22</div>
            <div id='time'><label>开考倒计时：</label><span>24:59:59</span>  </div>
              <div id='auto-go' style='padding:8px 0'> <input type='checkbox' style='margin-left:40px;'  id='auto-enter' /><label for='auto-enter'>自动进入</label></div>
            
        </div>
        <div id="dlg-foot" class='dlgbg'>
         <input id="cancel" type='button' value='取消' />
          <input id="ok" type='button' disabled="disabled"     value='参加考试' />
        </div>
        </div>
      </div>
  </div>
</body>
</html>
