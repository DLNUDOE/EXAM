 {
    "success":${success},
    "data":[
        <#list data.list as item>{
	            "id":${item.id?c},
	            "type":${item.type},
	            "courseid":${item.courseid?c},
	            "stem":${item.stem},
                <#if item.type==3>
	               "answer":${item.answer},
                <#else>
                    "answer":"${item.answer}",
                </#if>
	            "kp":"${item.kp}" 
            }<#if item_has_next>,</#if>
        </#list>
    ],
    "total":${data.total?c}
}