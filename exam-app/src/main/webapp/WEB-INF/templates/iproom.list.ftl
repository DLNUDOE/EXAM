 {
    "success":${success},
    "data":[
        <#list data.list as item>{
	            "id":"${item.id}",
	            "name":"${item.name}",	             
	            "capacity":${item.capacity?c},
	            "iprange":"${item.scope}" 	             
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total}
}