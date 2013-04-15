<div id="answer_card" style="position: absolute; top: 100px; width: 26px;">
<table border="0" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td class="answerCardHover"><img src="static/img/exam/r3.gif" alt="" width="26" height="99" /> </td>
      <td class="answerInfo">
        <dl style="border:5px solid #7ec0ee; ">
          <#list data.paper.groups as group>
            <dt>${(group_index+1)?c}.${group.title}</dt>
              <#list group.scoreMap as scoreMap>
                 <dd> <a href="#${scoreMap.id?c}"    >${(scoreMap_index+1)?c}</a>  </dd>
              </#list>             
          </#list>
         </dl>
      </td>
    </tr>
  </tbody>
</table>
</div>