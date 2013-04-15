 {
    "success":${success},
    "data":[
        <#list data.list as item>{
	            "id":${item.id?c},
	            "name":"${item.title}",
	            "c_time":"${item.c_time}", 
	            "creator":"${item.creator}", 
	         	"cid":${item.cid?c},
	            "cname" :"${item.cname}"	            
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total}
}
 