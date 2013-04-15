 {
    "success":${success},
    "data":[
        <#list data.list as item>{	       
	            "id":"${item.id?c}",
				"name":"${item.name}",
                                 "papername":"${item.papername}",
	                         "starttime":"${item.startTime?string("yyyy-MM-dd HH:mm:ss")}",
				"creator":"${item.creator}",
                                "coursename":"${item.coursename}"
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total?c}
}