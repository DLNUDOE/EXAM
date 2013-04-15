<@override name="block_css_head">
     <link rel="stylesheet" href="${data.webroot}/static/art/skins/default.css">
     <link rel="stylesheet" href="${data.webroot}/static/css/preview.css">
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
        courseid:${data.paper.cid},
        course:"${data.paper.cname}",
        role:${data.role},
        collegeid:${data.self.collegeid}
    };
</script>
</@override>
<@override name="block_top_nav">
    <#include  "preview_nav.ftl" >
</@override> 
 
<@override name="block_anwser_card">      
</@override>   
<@override name="block_main_top">  
	 <#include  "preview_console.ftl" >
</@override>
<@override name="block_main_body">  
     <div class="main-body paperbg" id="main_body">
        <div class="paperTitle" id="paperTitle">
            <h2  >${data.paper.title}</h2>
            <span>Âú·Ö£º <a id="totalScore"> ${data.paper.score} </a> </span>
        </div>
        <#include  "content.ftl" >
    </div>
</@override>
<@override name="block_main_footer">  
	<div class="main-top paperbg" id="main_footer">
        <a href="#" id="submit-paper">Ìá½»ÊÔ¾í</a>
    </div>  
</@override>

<@override name="block_js_footer"> 
	<#--import art dialog component-->	 
	<script type="text/javascript" src="${data.webroot}/static/js/preview.js"></script>
	<script type="text/javascript">
            previewApp.run();
    </script>
	 
</@override>
<@extends name="base.ftl"></@extends>