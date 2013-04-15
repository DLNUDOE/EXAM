<@override name="block_css_head">
     <link rel="stylesheet" href="${data.webroot}/static/art/skins/default.css" />
     <link rel="stylesheet" href="${data.webroot}/static/css/preview.css" />
     <link rel="stylesheet" href="${data.webroot}/static/css/readover.css" />
</@override>
<@override name="block_js_head">        
<#--import art dialog-->
<script type="text/javascript" src="${data.webroot}/static/art/artDialog.js"></script>
<script type="text/javascript" src="${data.webroot}/static/js/jquery.cookie.js"></script>
<script type="text/javascript">
    window.eUserInfo={
        paperid:'${data.paperid?c}',
        userid:'${data.self.id}',
        name:'${data.self.name}',
        college:{
               id:${data.self.college.id},
               name:'${data.self.college.name}'
        },
        courseid:${data.paper.cid},
        course:"${data.paper.cname}",
        role:${data.self.role},
        collegeid:${data.self.collegeid},
        email:'${data.self.email}',
        tel:'${data.self.tel}'
    };
</script>
</@override> 
<@override name="block_top_nav">
    <#include  "readover_nav.ftl" >
</@override> 
 
<@override name="block_anwser_card">  </@override>   
<@override name="block_main_top">  </@override>
<@override name="block_main_body">  
     <div class="main-body paperbg" id="main_body">
        <div class="paperTitle" id="paperTitle">
            <h2  >${data.paper.title}</h2>
            <span>满分： <a id="totalScore"> ${data.paper.score}</a> </span>
        </div>
        <#include  "content.ftl" >
    </div>
</@override>
<@override name="block_main_footer">  
    <div class="main-top paperbg" id="main_footer">
      
    </div>  
</@override>

<@override name="block_js_footer"> 
    <#--import art dialog component-->   
    <script type="text/javascript" src="${data.webroot}/static/js/preview.js"></script>
    <script type="text/javascript" src="${data.webroot}/static/js/readover.js"></script>
    <script type="text/javascript">
            previewApp.run();
            readoverApp.run();
    </script>
     
</@override>
<@extends name="base.ftl"></@extends>
 
