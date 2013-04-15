<div class="readover-console">
	 	 
	 	<h2 class="read-over-title">批阅试卷学生选择</h2>
		<div class="">
			<div>
				<div class="field-item">
					<label for="mainselect" >学院:</label>
					<select id="mainselect"  data-dep="collegeid"  >
		    			  <option value="-1">-------请选择学院--------</option>
					</select>
		  		</div>
			  	<div  class="field-item">
					<label for="midselect">专业:</label>
					<select id="midselect" data-dep="majorid" >
		            <option value="-1">-------请选择专业--------</option>
					</select>
			    </div>
				<div class="field-item">
					<label for="backselect">班级:</label>
					<select id="backselect"  data-dep="classid">
		            <option value="-1">-------请选择班级--------</option>
					</select>
			    </div>

			    <div class="field-item">
					<label for="status">状态:</label>
					<select id="status"  data-dep="status">
					<option value="5">-------试卷未判完--------</option>

		            <option value="7">-------试卷已判完--------</option>
					</select>
			    </div>

			  <#--  <div class="field-item">
					<label for="key">关键字:</label>
					<input type="text" id="key" name='query' />
			    </div>
			    -->


		         <div class="field-item">
				    <input type="button" value="确定" name="submit" class="submit">	
				</div>
  		  </div>
 
	</div>

</div>