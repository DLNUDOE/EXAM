<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>DLNU DreamOnline 考试系统 </title>
    <!--the base static resource start here-->
    <link rel="stylesheet" href="${data.webroot}/static/css/exam.css" type="text/css">
    <script type="text/javascript" src="${data.webroot}/static/js/exam/jquery-1.7.1.js"></script>
    <script type="text/javascript" src="${data.webroot}/static/js/exam/clock.js"></script>
    <!-- the base static resource is end here      -->
    <!--load the css selectively-->
<@block name="block_css_head"></@block>
    <!--a block for the sub ftl to override it, and included when no override ,head position for loaded before what depend it -->
<@block name="block_js_head">
   <!-- <script type="text/javascript" src="${data.webroot}/static/js/exam/clock.js"></script>-->
    <script type="text/javascript" src="${data.webroot}/static/js/exam/json2.js"></script>
    <!--here for global variable-->
    <script type="text/javascript">
        window.eUserInfo = {
            id: '${data.self.id}',
            name: '${data.self.name}',
            collegeid: '${data.self.collegeid?c}',
            majorid: '${data.self.majorid?c}',
            classid: '${data.self.classid?c}',
            email: '${data.self.email?if_exists}',
            img: '${data.self.img?if_exists}',
            complete: '${data.self.complete}',
            seconds:"${data.timeRemaining?c}",
            exam:{
                id:"${data.exam.id?c}",
                name:"${data.exam.name}",
                mintime:'${data.exam.minTime}',
                starttime:'${data.exam.startTime?string("yyyy-MM-dd HH:mm:ss")}',
                creator:"${data.exam.creator}",
                duration:"${data.exam.duration}",
                courseid:"${data.exam.courseid?c}",
                paperid:"${data.exam.paperid?c}"
            },
             paper:{
                id:"${data.paper.id?c}",
                title:"${data.paper.title}",
                courseid:'${data.paper.cid?c}',
                coursename:'${data.paper.cname}'
            }
        };
    </script>
</@block>
    <!--[if IE 6]>
    <style type="text/css">
        body {
            behavior: url(static/css/csshover.htc);
        }
    </style>
    <script type="text/javascript" src="${data.webroot}static/js/DD_belatedPNG_0.0.8a-min.js">
    </script>
    <script type="text/javascript">
        DD_belatedPNG.fix('#top_nav');
        DD_belatedPNG.fix('#to_top');
        DD_belatedPNG.fix('.paperbg');
        DD_belatedPNG.fix('#logo');
        DD_belatedPNG.fix('.clock');
        DD_belatedPNG.fix('#username');
    </script>
    <![endif]-->
</head>

<body debugger-onbeforeunload="return CloseEvent();" debugger-onunload="UnLoadEvent()">
<@block name="block_top_nav"> </@block>
<@block name="block_anwser_card">
    <#include  "exam_answer_card.ftl" >
</@block>
<div id="main">
    <@block name="block_main_top">
        <div class="main-top paperbg" id="main_top"></div>
    </@block>
    <@block name="block_main_body">
        <div class="main-body paperbg" id="main_body">
            <div class="paperTitle" id="paperTitle">
                <h2 title="试卷名：${data.paper.title}">${data.exam.name}</h2>
                <span>满分： <a id="totalScore"> ${data.paper.score} </a> </span>
            </div>
            <#include  "content.ftl" >
        </div>
    </@block>
    <@block name="block_main_footer">
        <div class="main-top paperbg" id="main_footer"></div>
    </@block>
</div>
<div id="locker"  ></div>
<div id="to_top" class="fixed" style="display: none;"> 回到顶部</div>
 
<div class="vimiumReset vimiumHUD" style="right: 150px; opacity: 0; display: none;"></div>

<!--a block for the sub ftl to override it, and included when no override footer for loaded when the html is ready-->
<@block name="block_js_footer">
<script type="text/javascript" src="${data.webroot}/static/js/exam/exam.js"></script>
<script type="text/javascript">
    examApp.run();
</script>
</@block>
</body>

</html>