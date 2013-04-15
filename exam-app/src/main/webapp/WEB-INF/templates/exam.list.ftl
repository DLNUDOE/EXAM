 {
    "success":${success},
    "data":[
        <#list data.list as item>{	       
	            "id":"${item.id?c}",
				"name":"${item.name}",
				"paperid":"${item.paperid?c}",
				"courseid":"${item.courseid?c}",
				"duration":"${item.duration}",
				"mintime":"${item.minTime}",
				"iprooms":"${item.iprooms}",
				"createtime":"${item.createTime?string("HH:mm:ss")}",
				"starttime":"${item.startTime?string("HH:mm:ss")}",
				"creator":"${item.creator}",
				"status":"${item.status}"
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total?c}
}

