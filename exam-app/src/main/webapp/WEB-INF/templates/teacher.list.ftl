 {
    "success":${success},
    "data":[
        <#list data.list as item>{
	            "id":"${item.id}",
	            "name":"${item.name}",
	            "college":{
					"id":${item.college.id},
					"name":"${item.college.name}"
	        	},
	            "email":"${item.email}",
	            "tel":"${item.tel}",
	            "role":${item.role},
	            "courses":[<#list item.courses as citem>{					 
		            "courseid" :${citem.id},
		            "name" :"${citem.name}",
		            "collegeid" :${citem.collegeid},
		            "subcollege" :"${citem.subcollege}",
		            "active" :${citem.active}
	           	 }<#if citem_has_next>,</#if>
	            </#list>]
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total}
}