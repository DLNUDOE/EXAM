{
    "success":${success},
    "data":[
        <#list data as item>
            {"cid":${item.id},"name":"${item.name}","leaf":true}<#if item_has_next>,</#if>
        </#list>
    ]
}