<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>考试系统 Welcome to DLNU dream-online exam system</title>

  <script type="text/javascript" src="./static/js/jquery-1.8.0.js"></script>
  <script type="text/javascript" src="./static/js/exam/clock.js"></script>
  <script type="text/javascript">
    window.eUserInfo={
      id:'${data.self.id}',
      name:'${data.self.name}'
    };
  </script>
  <link rel="stylesheet" href="./static/css/exam-manager.css" />
</head>
<body>
<div id="header">
    <div class="head">
        <h1 class="logo">考试系统Dream-Online</h1>
          <span class="user">
            <a href='student.htm' class="userInfo" title="${data.self.id}">${data.self.name}</a>
            <a href='student.htm' class="userInfo">个人信息 </a>
            <a class="quit" id='quit' href="logout.do">注销</a></span>
    </div>

</div>
<div id="content">
    <div class="examlist">
        <h2 class="listhead">今日考试</h2>
        <table class="list" cellspacing="0">
            <tr>
                <th>考试标题</th>
                <th>开考时间</th>
                <th>考试时长</th>
                <th>考试状态</th>
            </tr>
              
        <#list data.exams as exam>
            <tr >
                <td title="至少答题时间：${exam.minTime}（分钟）">${exam.name}</td>
                <td>${exam.startTime?string("HH:mm:ss")}</td>
                <td data-duration="${exam.duration}">${exam.duration}分钟</td>
                <td><input type='button' class='go-exam' value='参加考试' data-examid='${exam.id}'/></td>
            </tr>
        </#list>

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
<div id="footer"><span>Copyright © 2008 - 2012 Dream-Online. All Rights Reserved.</span><span id='about-us'>@<a
        href='../ourteam/cool/index.html' target="_blank">关于我们</a></span></div>
 <div id="mask" ></div>
      
    <div id='dlg' style="display:none">
        <div id="dlg-content">
            <div id="dlg-title" class='dlgbg'>
                <h2>考试提示</h2>
                <a href="#" id='close'>╳</a>
            </div>
            <div id="dlg-body" class='dlgbg'>
                <div id='desc'><label>名称：</label><span>数据结构测试大重修</span></div>
                <div id='duration'  > <label for="">时间：</label>   <span>  2011-11-22 11:11:11 至 2011-11-22 22:22:22</span></div>
                <div id='time'><label>开考倒计时：</label><span>24:59:59</span></div>
                <div id='auto-go' style='padding:8px 0'><input type='checkbox' style='margin-left:40px;'
                                                               id='auto-enter'/><label for='auto-enter'>自动进入</label>
                </div>

            </div>
            <div id="dlg-foot" class='dlgbg'>
                <input id="cancel" type='button' value='取消'/>
                <input id="ok" type='button' value='参加考试'/>
            </div>
        </div>
    </div>  
 
<script type="text/javascript" src="./static/js/exam/exam-manager.js"></script>
<script type="text/javascript" >
  eManager.run();
</script>
</body>
</html>
