 {
    "success":${success},
    "data":[
        <#list data.list as item>{
	            "id":"${item.id}",
	            "name":"${item.name}",
	            "collegeid":${item.collegeid}, 
	            "college":"${item.college.name}",
	         	"active":${item.active},
	            "subcollege" :"${item.subcollege}"	            
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total}
}
 