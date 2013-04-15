<%@ page import="cn.edu.dlnu.doe.app.util.SessionUtil" %>
<%@ page import="cn.edu.dlnu.doe.dal.bo.Teacher" %>
<%--
  ~ Copyright (c) 2013. Jiangang Xiao All rights reserved
  --%>

<%--
  Created by IntelliJ IDEA.
  User: upupxjg
  Date: 13-3-24
  Time: 下午7:30
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    Object self = SessionUtil.getFromSession("self",request);
    if (self == null || !(self instanceof Teacher)){
        response.sendRedirect("admin.html");
    }
%>
<html>
<head>
    <title>Exam Paltform Welcom e</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css">
    <link rel="stylesheet" type="text/css" href="static/css/index.css">
    <link rel="stylesheet" type="text/css" href="static/css/scroll.css">
    <script type="text/javascript" src="static/js/config.js"></script>
    <script type="text/javascript" src="extjs/ext-all-debug.js"></script>
    <script type="text/javascript" src="extjs/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="app.js"></script>
</head>
<body>
<!--@contentEl content element for banner content -->
<div id='content-banner' class='content-ele-banner'>
    <img src="static/img/logo.png" alt="logo......">
    <div class="user-info">
        <span title="2009081430">张杰 <em>[2009081430]</em>	，您好</span>
        <a href="#" class='logout'>退出</a>
        |
        <a href="#">帮助？</a>
    </div>
</div>
</body>
</html>