<div class="paperContent" id="paperContent">
<#assign role =  data.role>
<#assign qMap = data.paper.questions>
<#assign labelMap={"0":"A","1":"B","2":"C","3":"D","4":"E","5":"F","6":"G","7":"H","8":"I","9":"J","10":"K","11":"L","12":"M","13":"N","14":"O","15":"P","16":"Q","17":"R","18":"S","19":"T","20":"U","21":"V","22":"W","23":"X","24":"Y","25":"Z"}
>

<#list data.paper.groups as group>

        <#assign key=((group_index+1)?c) >

            <#if '3'== key ||'5'==key>
             <h3 class="questionList gp-title" > ${(group_index+1)?c}.${group.title} </h3>
             </#if>

    <div>
        <ol>
            <#list group.scoreMap as scoreMap>

                <#assign q=qMap[scoreMap.id?c]>
                <#if q.type == 5>
                    <li id="${q.id?c}" data-type="5">
                      <span>${q.stem.title}</span>
                        <em class="score"> （${scoreMap.score}分） </em>

                        <div>
                            <textarea cols="50" rows="5"></textarea>
                        </div>
                        <span class="lengthLimit"> 0/2048 </span>
                        <a class="lengthWarning"> 文本过长，试卷可能无法提交！删除部分内容 </a>
                        <#if role < 2>
                            <div class="aswT">
                                参考答案：<br/>
                            ${q.answer}
                            </div>
                            <a href="#" class="delete-item"></a>
                        </#if>
                    </li>


                <#elseif q.type == 3>
                    <li id="${q.id?c}" data-type="3" class="blank-question">
                        <span>${q.stem.title}</span>
                        <em class="score"> （${scoreMap.score}分） </em>
                    <#-- comments -->
                       
                         <#if role < 2>
                             <div class="aswT">参考答案：
                                <#list q.answer as answer>
                                    <span class="blan-asw-item">${answer}</span>
                                </#list>
                            </div>
                            <a href="#" class="delete-item"></a>
                        </#if>
                    </li>
                </#if>
            </#list>
        </ol>
    </div>
</#list>
</div>

