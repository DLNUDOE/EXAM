 {
    "success":${success},
    "data":[
        <#list data.list as item>{
                    "stuid":"${item.stuid}",
	            "name":"${item.name}",
                    "collegename":"${item.collegename}",
                    "clazz":"${item.clazz}",
                    "major":"${item.major}",
                    "status":"${item.status}"
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total}
}