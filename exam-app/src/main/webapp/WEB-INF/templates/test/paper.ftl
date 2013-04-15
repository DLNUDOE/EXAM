cname:${data.paper.cname}
creator:${data.paper.creator}
<#list data.paper.groups as group>
group.title:${group.title}
group.desc${group.desc}
    <#list data.paper.questions?keys as key>
        key  :  ${key}
        value :   ${data.paper.questions[key].type}
    </#list>
    <#list group.scoreMap as scoreMap>
    ${scoreMap.id}
    ${scoreMap.score}
    <#assign question = data.paper.questions[scoreMap.id?c] >
    question.id ${question.id}
    question.type  ${question.type}
    question.courseid   ${question.crouseid}
    question.stem.title  ${question.stem.title}
    question.stem.option    <#list question.stem.option as option>
    ${option}
    </#list>
    question.answer
        <#if question.type == 3>
        <#list question.answer as answer>
        ${answer}
        </#list>
    <#else>
        ${data.paper.questions[scoreMap.id?c].answer}
    </#if>
    question.kp   <#list question.kp as kp>
    ${kp}
    </#list>
    </#list>
</#list>