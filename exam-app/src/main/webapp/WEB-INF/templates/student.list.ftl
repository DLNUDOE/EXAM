 {
    "success":${success},
    "data":[
        <#list data.list as item>{
	            "id":"${item.id}",
	            "name":"${item.name}",
	            "college":"${item.college.name}",
	            "collegeid":${item.collegeid},
	            "major":"${item.major.name}",
	            "majorid":${item.majorid},
	            "class":"${item.clazz.name}",
	            "classid":${item.classid},
	             "complete":${item.complete} 
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total}
}