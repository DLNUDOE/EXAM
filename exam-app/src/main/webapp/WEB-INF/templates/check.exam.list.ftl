{
	"success": ${success},
	"data": [
		<#list data.list as item>{
				"examid": ${item.examid?c},
				"score": ${item.score},
				"name": "${item.name}",
				"startTime": "${item.startTime?string("yyyy-MM-dd HH:mm:ss")}",
				"duration": "${item.duration}"
			}<#if item_has_next>,</#if>
		</#list>
	],
	"total": ${data.total}
} 
