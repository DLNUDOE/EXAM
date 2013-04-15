<html>
<head>
    <title>Exam Paltform Welcome</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css">
    <link rel="stylesheet" type="text/css" href="static/css/index.css">
    <link rel="stylesheet" type="text/css" href="static/css/scroll.css">
    <script type="text/javascript" src="static/js/config.js"></script>
    <script type="text/javascript" src="extjs/ext-all-debug.js"></script>
    <script type="text/javascript" src="extjs/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="static/js/LocalTopic.js"></script>
    <script type="text/javascript" >
        window.eUserInfo={
            id:'${data.id}',          
            name:'${data.name}',
            college:{
                   id:'${data.college.id?c}',
                   name:'${data.college.name}'
            },             
            role:'${data.role}',            
            email:'${data.email}',
            tel:'${data.tel}'
    };
    </script>
</head>
<body>
    <!--@contentEl content element for banner content -->
    <div id='content-banner' class='content-ele-banner'>
        <img src="static/img/logo.png" alt="logo......">
        <div class="user-info">
            <span title="${data.id}" id="eUserInfo-name">${data.name} <em id="eUserInfo-ID">[${data.id}]</em>，您好</span>
            <a href="logout.do" class='logout'>退出</a>
            |
            <a href="#">帮助？</a>          
        </div>
    </div>
    <script type="text/javascript" src="app.js"></script>
</body>
</html>