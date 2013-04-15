<div class="paperContent" id="paperContent">
<#assign role =  data.role>
<#assign qMap = data.paper.questions >
<#assign labelMap={"0":"A","1":"B","2":"C","3":"D","4":"E","5":"F","6":"G","7":"H","8":"I","9":"J","10":"K","11":"L","12":"M","13":"N","14":"O","15":"P","16":"Q","17":"R","18":"S","19":"T","20":"U","21":"V","22":"W","23":"X","24":"Y","25":"Z"}
>
<#list data.paper.groups as group>
    <h3 class="questionList gp-title" > ${(group_index+1)?c}.${group.title} </h3>
    <h4 class="gp-desc">${group.desc}</h4>
    <div>
        <ol>
            <#list group.scoreMap as scoreMap>

                <#assign q=qMap[scoreMap.id?c]>
                <#if q.type == 4>
                    <li id="${q.id?c}" data-type="4">
                        <span>  ${q.stem.title}</span>
                        <em class="score"> （${scoreMap.score}分） </em>

                        <div>
                            <label for="${q.id?c}_0"> <input type="radio" name="${q.id?c}" id="${q.id?c}_0"
                                                           value="0">错</label>
                            <label for="${q.id?c}_1"> <input type="radio" name="${q.id?c}" id="${q.id?c}_1"
                                                           value="1">对</label>
                        </div>
                    <#-- comments -->
                        <#if role < 2>
                            <div class="aswT">参考答案：
                                <#if q.answer == "1">
                                    正确
                                <#else >
                                    错误
                                </#if>
                            </div>
                            <a href="#" class="delete-item"></a>
                        </#if>
                    </li>
                <#elseif q.type == 5>
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
                <#elseif q.type == 1>
                    <li id="${q.id?c}" data-type="1">
                        <span>${q.stem.title}</span>
                        <em class="score">（${scoreMap.score}分） </em>
                        <#list q.stem.option as option>
                            <div>
                                <div class="optioninput">
                                    <input type="radio" name="${q.id?c}" id="${q.id?c}_${option_index}" value="${labelMap[option_index?c]}">
                                </div>
                                <div class="optionanswer">
                                    <label for="${q.id?c}_${option_index}">${labelMap[option_index?c]}.${option}</label>
                                </div>
                            </div>
                        </#list>
                        <#if role < 2>
                        <#-- comments -->
                            <div class="aswT">参考答案：${q.answer}</div>
                            <a href="#" class="delete-item"></a>
                        </#if>
                    </li>
                <#elseif q.type == 2>
                    <li id="${q.id?c}" data-type="2">
                        <span> ${q.stem.title}</span>
                        <em class="score"> （${scoreMap.score}分） </em>
                        <#list q.stem.option as option>
                            <div>
                                <div class="optioninput">
                                    <input type="checkbox" name="${q.id?c}" id="${q.id?c}_${option_index}" value="${labelMap[option_index?c]}">
                                </div>
                                <div class="optionanswer">
                                    <label for="${q.id?c}_${option_index}">${labelMap[option_index?c]}.${option}</label>
                                </div>
                            </div>
                        </#list>
                    <#-- comments -->
                        <#if role < 2>
                            <div class="aswT">参考答案：${q.answer}</div>
                            <a href="#" class="delete-item"></a>
                        </#if>
                    </li>
                </#if>
            </#list>
        </ol>
    </div>
</#list>
</div>