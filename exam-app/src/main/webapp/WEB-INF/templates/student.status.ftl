{
	"success":${success},
	"data":[
		<#list data as item>{
			"id":${item.id},
			"status":${item.status}
		}<#if item_has_next>,</#if>
		</#list>
	]
}