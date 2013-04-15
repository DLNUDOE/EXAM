 {
    "success":${success},
    "data":[
        <#list data.list as item>{	       
	            "id":"${item.id?c}",
				"name":"${item.name}",
                                 "duration":"${item.duration}",
                                 "papername":"${item.papername}",
	                         "starttime":"${item.startTime?string("yyyy-MM-dd HH:mm:ss")}",
				"creator":"${item.creator}",
				"status":"${item.status}"
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total?c}
}