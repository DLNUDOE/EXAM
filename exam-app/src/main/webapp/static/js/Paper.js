var paper = (function($, template) {
	var subjectLimit = 1000;
	var tplMap = {
		radio: '<div class="gp-topic gp-radio"><h2><%index%>、<%title%></h2><h4><%desc%></h4><%each questions as item qIndex%><div class="topic-item"><div class="label" data-id="<%item.id%>"><%qIndex+1%>.</div><span class="score">(<%scoreMap[item.id]%>分)</span><div class="content"><div class="stem"><%echo item.stem.title%></div><ul class="options"><%each item.stem.option as opt index%><li class="opt-item"><div class="opt-label"><span><%$labelMaker(index+65)%>.</span><input value="<%$labelMaker(index+65)%>" type="radio" name="<%qIndex%>"/></div><div class="opt-field"><%opt%></div></li><%/each%>						 		 </ul><div class="answer"><span>答案：<%item.answer%></span><span> </span></div></div><div class="item-op"><span class="item-trigger-wrapper"><span class="item-op-trigger">▼</span><ul><li><a href="#" class="mod-item">修改</a></li><li><a href="#" class="del-item">删除</a></li></ul></span></div></div><%/each%></div>',
		checkbox: '<div class="gp-topic gp-checkbox"><h2><%index%>、<%title%></h2><h4><%desc%></h4><%each questions as item qIndex%><div class="topic-item"><div class="label" data-id="<%item.id%>"><%qIndex+1%>.</div><span class="score">(<%scoreMap[item.id]%>分)</span><div class="content"><div class="stem"><%echo item.stem.title%></div><ul class="options"><%each item.stem.option as opt index%><li class="opt-item"><div class="opt-label"><span><%$labelMaker(index+65)%>.</span><input value="<%$labelMaker(index+65)%>" type="checkbox" name="<%qIndex%>"/></div><div class="opt-field"><%opt%></div></li><%/each%>						 		 </ul><div class="answer"><span>答案：<%item.answer%></span><span> </span></div></div><div class="item-op"><span class="item-trigger-wrapper"><span class="item-op-trigger">▼</span><ul><li><a href="#" class="mod-item">修改</a></li><li><a href="#" class="del-item">删除</a></li></ul></span></div></div><%/each%></div>',
		blank: '<div class="gp-topic gp-blank"><h2><%index%>、<%title%></h2><h4><%desc%></h4><%each questions as item qIndex%><div class="topic-item"><div class="label" data-id="<%item.id%>"><%qIndex+1%>.</div><span class="score">(<%scoreMap[item.id]%>分)</span><div class="content"><div class="stem"><%echo item.stem.title%></div><div class="answer"><span>答案：</span><span class="blank-aswlist"><%each item.answer as basw%><strong  class="asw-tag"><%basw%></strong>													<%/each%></span></div></div><div class="item-op"><span class="item-trigger-wrapper"><span class="item-op-trigger">▼</span><ul><li><a href="#" class="mod-item">修改</a></li><li><a href="#" class="del-item">删除</a></li></ul></span></div></div><%/each%>		</div>',
		judge: '<div class="gp-topic gp-judge"><h2><%index%>、<%title%></h2><h4><%desc%></h4><%each questions as item qIndex%><div class="topic-item"><div class="label" data-id="<%item.id%>"><%qIndex+1%>.</div><span class="score">(<%scoreMap[item.id]%>分)</span><div class="content"><div class="stem"><%echo item.stem.title%></div>			</div><ul class="options opts-judge"><li class="opt-item opt-judge"><input type="radio" name="<%qIndex%>"/><span>正确</span></li><li class="opt-item opt-judge"><input type="radio" name="<%qIndex%>"/><span>错误</span>							</li>	 	</ul><div class="answer"><span>答案：</span><span><%item.answer%></span></div><div class="item-op"><span class="item-trigger-wrapper"><span class="item-op-trigger">▼</span><ul><li><a href="#" class="mod-item">修改</a></li><li><a href="#" class="del-item">删除</a></li></ul></span></div></div><%/each%>		</div>',
		subject: '<div class="gp-topic gp-subject"><h2><%index%>、<%title%></h2><h4><%desc%></h4><%each questions as item qIndex%><div class="topic-item"><div class="label" data-id="<%item.id%>"><%qIndex+1%>.</div><span class="score">(<%scoreMap[item.id]%>分)</span><div class="content"><div class="stem"><%echo item.stem.title%></div><div class="tablet"><textarea name="" id="" cols="30" rows="10"></textarea><label class="tip-statistics">0/<%$subjectLimit%></label></div><div class="answer"><span>答案：</span><div><%item.answer%></div></div></div><div class="item-op"><span class="item-trigger-wrapper"><span class="item-op-trigger">▼</span><ul><li><a href="#" class="mod-item">修改</a></li><li><a href="#" class="del-item">删除</a></li></ul></span></div></div><%/each%></div>',
		exotic: ""
	};
	var focusID = 0;
	var proID = -1;
	var stuMap = {};

	function Paper() {

		this.initConfig.apply(this, arguments);
		var _ = {
			id: 5,
			title: " ",
			c_time: "",
			creator: "",
			cid: 1,
			cname: "",
			groups: "",
			store: [],
			scoreMap: [],
			stuMap: []
		};
		this.get = function(pro) {
			return _[pro] || null;
		};
		this.set = function(pro, value) {
			_[pro] = value;
		}
	};
	var labelMaker = function(num) {
		return String.fromCharCode(num);
	};
	var parser = new Function("json", "return json;");
	Paper.fn = Paper.prototype;
	Paper.fn.loadData = function() {
		var me = this;
		$.ajax({
			type: "get",
			url: me.options.url,
			dataType: 'json',
			data: {},
			success: function(res, successful) {
				if (!res.success) {
					alert(res.msg);
					return;
				}
				var data = res.data;
				for (var pro in data) {
					me.set(pro, data[pro]);
				}

				//this.set("store",JSON.Paper(this.get("groups")));
				me.set("store", data.groups);
				me.render();
			},
			error: function(options, msg) {

				alert(msg);
			}
		});
	};
	Paper.fn.initConfig = function(options) {
		this.options = $.extend({
			url: ""
		}, options || {});
		this.$el = $(this.options.ele);
		this.$el.empty();
		this.loadData();
		template.helper("$labelMaker", labelMaker);
		template.helper("$subjectLimit", function() {
			return subjectLimit
		});
	};
	Paper.fn.isExisted = function(id) {
		var store = this.get("store");
		for (var i = 0; i < store.length; i++) {

		}
	};
	Paper.fn.render = function(data) {
		var store = this.get("store");
		for (var i = 0; i < store.length; i++) {
			var qListObj = store[i];
			qListObj.index = i + 1;
			var gpType = qListObj.questions[0].type;
			if (gpType == 1) {
				this.renderRadio(qListObj);
			} else if (gpType == 2) {
				this.renderCheckbox(qListObj);
			} else if (gpType == 3) {
				this.renderBlank(qListObj);
			} else if (gpType == 4) {
				this.renderJudge(qListObj);
			} else if (gpType == 5) {
				this.renderSubject(qListObj);
			} else if (gpType == 6) {
				this.renderExotic(qListObj);
			} else {
				alert('error type question');
			}

		}
		bindEvents();
		/*var qListObj=store[0];
		qListObj.index=1;
		this.renderRadio(qListObj);*/
	};
	Paper.fn.renderRadio = function(data) {
		debugger;
		var renderFun = template.compile(tplMap['radio']);
		var html = renderFun(data);
		this.$el.append(html);
	};
	Paper.fn.renderCheckbox = function(data) {
		var renderFun = template.compile(tplMap["checkbox"]);
		var html = renderFun(data);
		this.$el.append(html);
	};
	Paper.fn.renderBlank = function(data) {
		var renderFun = template.compile(tplMap["blank"]);
		var html = renderFun(data);
		this.$el.append(html);
	};
	Paper.fn.renderJudge = function(data) {
		var renderFun = template.compile(tplMap["judge"]);
		var html = renderFun(data);
		this.$el.append(html);
	};
	Paper.fn.renderSubject = function(data) {
		var renderFun = template.compile(tplMap["subject"]);
		var html = renderFun(data);
		this.$el.append(html);
	};

	Paper.fn.renderExotic = function(data) {
		var renderFun = template.compile(tplMap["exotic"]);
		var html = renderFun(data);
		this.$el.append(html);
	};
	Paper.fn.deleteItem = function(id) {
		var store = this.get("store");
		for (var i = 0; i < store.length; i++) {
			var qListObj = store[i];

			var topicList = qListObj.questions;
			for (var j = 0; j < topicList.length; j++) {
				if (id == topicList[j].id) {
					topicList.splice(j, 1);
					return true;
				}
			}
		}
		return false;
	};

	function init(options) {

		var p = new Paper(options);
		return p;
	};

	function onDelItem() {

		$('.del-item').click(function(e) {
			$(this).parents('.topic-item').remove();
			e.preventDefault();
			return false;
			//$(this).parents('.topic-item').animate({height:0},{duration:1000}) ;
		});

	};

	function onTiggerToggle() {
		$('.item-trigger-wrapper').click(function(e) {
			var menu = $(this).find('ul');
			var trigger = $(this).find('.item-op-trigger');
			$('.item-trigger-wrapper').find("ul").not(menu).hide();
			$('.item-trigger-wrapper').find('.item-op-trigger').not(trigger).text("▼");
			debugger;
			if (menu.css("display") == "none") {
				menu.show("fast");
				$(this).find('.item-op-trigger').text("▲");
				debugger;
			} else {
				menu.hide("fast");
				$(this).find('.item-op-trigger').text("▼");
				debugger;
			}

		});

	};

	function radioClick() {
		$('.options li').click(function(e) {
			/*
			var id=$(this).parents(".topic-item").find(".label").attr('data-id');
			$(this).parent().trigger("click",id);
			$(this).find("input")[0].checked=true;
			console.log(id);
			e.preventDefault();
			debugger;*/
			//e.cancelBubble=true;

		});
		$('.gp-radio .options').click(function(e) {
			focusID = id;
			var target = e.target;
			var input = $(target).parent().find('input')[0];
			var id = $(this).parents('.topic-item').find('.label').attr('data-id');
			var item=$(target).parents('.options')[0];

			if (input.value == stuMap[id]) {
				return;
			}
			if ( item== this) {

				input.checked = true;
				 
				stuMap[id] = input.value;
				
				console.log(+new Date(), id);
			}
		});
		$('input[type=checkbox]').click(function(){

			//return false;
		});
		$('.gp-checkbox .options').click(function(e) {
			var target = e.target;
			var input = $(target).parent().find('input')[0];
			var id = $(this).parents('.topic-item').find('.label').attr('data-id');
			var item=$(target).parents('.options')[0];
 
			 
			if ( item== this) {

				if(target!=input)input.checked =!input.checked;
				 
				stuMap[id] = input.value;
				focusID = id;
				console.log(+new Date(), id);
			}
		});
		$("body").click(function(e){
			var item=$(e.target).parents(".topic-item");

			if(item!=null){
				var id=  item.find('.label').attr('data-id');
				if(id!=proID){
					$(item).find('.options').trigger("mock-focusout",id);
				}
			}
		});
		$('.gp-checkbox .options').on("mock-focusout",function(e,id){
			console.log(+new Date(),"focusout", id);
		});
	};
	Paper.fn.serialize = function() {

	};

	function bindEvents() {
		debugger;
		onDelItem();
		onTiggerToggle();
		radioClick();
	};

	return {
		init: init
	};
}($, template));