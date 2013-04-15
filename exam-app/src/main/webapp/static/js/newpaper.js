        <div id="main" style="margin-bottom: 10px;">
           <div class="main-top paperbg" id="main_top"> 
            <div class="console-buttons">
                <a href="#"  class="button-action add-group" >添加分组</a>
                <a href="#" class="button-action add-item">添加小题</a>
                <a href="#" class="button-action refresh">刷新</a>
                <a href="#" class="button-action edit-item">编辑（改数、删题）</a>
            </div>
        </div> 
           <div class="main-body paperbg" id="main_body">
                <div class="paperTitle" id="paperTitle">
                    <h2  >试卷名称:<input type="text" id="p-title" name="title">
                        <span id="p_name">(出卷人：<%data.creator%>)</span>
                    </h2>
                    <span><h4>满分： <a id="totalScore">100</a></h4> </span>
                </div>
                <div class="paperContent" id="paperContent">
                <%each data.groups as group index%> 
         <h3 class="questionList gp-title" > <%index+1%>、<span><%group.title%></span> </h3>
            <h4 class="gp-desc">共 <%group.questions.length%> 题</h4>
            <div>
                 <%each group.questions as question gindex%>
                 <%if question.type == 1%>
                 <li>
                <div class="stem"><span><%gindex+1%>.</span><%echo question.stem.title%> <em class="score"> （<span><%group.scoreMap[question.id]%>分</span>） </em></div>
                 <ul class="options">
                  <%each question.stem.option as opt index%>
                    <li class="opt-item">
                   <input value="<%data.aoption[index]%>" type="radio" disabled name="<%index%>"/>
                    <%data.aoption[index]%>.<%opt%>
                    </li>
                  <%/each%> 
                  <div class="aswT">参考答案：<%question.answer%></div>
                  <a href="#" class="delete-item"></a>                
                </ul>
                </li>
                <%else if question.type == 2%>
                 <li>
                <div class="stem"><span><%gindex+1%>.</span><%echo question.stem.title%> <em class="score"> （<span><%group.scoreMap[question.id]%>分</span>） </em></div>
                 <ul class="options">
                  <%each question.stem.option as opt index%>
                    <li class="opt-item">
                   <input value="<%data.aoption[index]%>" type="radio" disabled name="<%index%>"/>
                    <%data.aoption[index]%>.<%opt%>
                    </li>
                  <%/each%> 
                  <div class="aswT">参考答案：<%question.answer%></div>
                  <a href="#" class="delete-item"></a>                
                </ul>
                </li>
                <%else if question.type==3%>
                <li>
                        <div class="topic-question">
                            <div class="content">
                                 <span class="label" data-id="<%question.id%>" data-type="<%question.type%>"><%gindex+1%>.</span>
                                <span class="stem"><%echo question.stem.title%></span><span class="score">(<%group.scoreMap[question.id]%>分)</span>                             
                                <div class="answer">
                                    <span>答案：</span>
                                   <span class="blank-aswlist" style="margin: 2px;padding: 2px;border: 1px solid red;"> 
                                        <%each question.answer as basw%>
                                            <strong  class="asw-tag"><%basw%></strong>                                  
                                        <%/each%>
                                    </span>
                                </div>
                            </div>
                </li>
                 <%else if question.type==4%>
                <li>    
                 <div class="topic-item">
                    <div class="content">
                   <span class="label" data-id="<%question.id%>" data-id="<%question.type%>"><%gindex+1%>.</span><span class="stem"><%echo question.stem.title%></span> <span class="score">(<%group.scoreMap[question.id]%>分)</span>                            
                                <ul class="options opts-judge">
                                    <li class="opt-item opt-judge">
                                         <input type="radio" name="<%gindex%>"/><span>正确</span>
                                    </li>   
                                     <li class="opt-item opt-judge">
                                        <input type="radio" name="<%gindex%>"/><span>错误</span>                           
                                    </li>           
                                </ul>
                                <div class="answer">
                                    <span>答案：</span>
                                    <span><%if question.answer=1 %> 正确 <%else%> 错误</span><%/if%>
                                </div>
                            </div>      
                </li>
                <%else if question.type==5%>    
                <li>
                        <div class="topic-question">
                            <div class="content">
                            <span class="label" data-id="<%question.id%>" data-id="<%question.type%>"><%gindex+1%>.</span><div class="stem"><%echo question.stem.title%></div><span class="score">(<%group.scoreMap[question.id]%>分)</span>
                                <div class="tablet">
                                    <textarea name="" id="" cols="30" rows="10" style="color: #333;  font-size: 15px;  height: 206px;  max-height: 206px;  max-width: 600px;  min-height: 206px;  min-width: 600px;  padding: 6px;  width: 600px;  "></textarea>
                                </div>
                                <div class="answer">
                                    <span>答案：</span>
                                    <div><%question.answer%></div>
                                </div>
                            </div>
                </li>

                <%/if%>
                <%/each%>   
            <%/each%>
        </div>
        </div>
        </div>    
        </div>
        <div class="vimiumReset vimiumHUD" style="right: 150px; opacity: 0; display: none;"></div>