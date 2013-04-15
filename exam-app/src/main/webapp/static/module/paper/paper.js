define(function(require, module, exports) {
	var subjectLimit = 1000;
	var tpl = require('./combine.html');
	var focusID = 0;
	var proID = -1;
	var stuMap = {};
	var notNumber=/[^\d]/g;
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
	var JSONStringify = function(obj) {
		return JSON.stringify(obj);
	};
	var isEmptyObj=function(obj){
		if(typeof obj=="object"){
			for(var pro in obj){
				return true;
			}
			return false
		}
		return false;
	}
	Paper.fn = Paper.prototype;
	Paper.fn.loadData = function(remote) {
		var me = this;
		if (remote) {
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
					me.renderCombine(data.groups);
				},
				error: function(options, msg) {

					alert(msg);
				}
			});
		}else{
			//return;
			//var p=Ext.create("Exam.store.LocalPaper");
			var groups =me.options.localPaper.serializeByType();
			//me.localStore;
			console.log(groups);
			me.renderCombine(groups);
		}
	};
	Paper.fn.initConfig = function(options) {
		template.helper("$labelMaker", labelMaker);
		template.helper("$JSONStringify", JSONStringify);
		template.helper("$subjectLimit", function() {
			return subjectLimit
		});
		this.options = $.extend({
			url: ""
		}, options || {});
		this.$el = $(this.options.ele);
		this.$el.empty();
		this.loadData(this.options.remote);
	};
	Paper.fn.isExisted = function(id) {
		var store = this.get("store");
		for (var i = 0; i < store.length; i++) {

		}
	};
	Paper.fn.renderCombine = function(store) {

		 
		var renderFun = template.compile(tpl);
		var html = renderFun({
			store: store
		});

		this.$el.append(html);
		bindEvents();
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
	 function onEditScore(){
	 	$('.score').click(function() {
			var me = this;
			var score = $(me).text().replace(notNumber, "");
			var dlg = art.dialog({
				title: "修改标题",
				lock: true,
				background: '#600', // 背景色
				opacity: 0.87, // 透明度
				content: "<input type='text' value='"+score+"' />",

				ok: function() {
					var score = $(dlg.content()).find("input").val();
					score=score.replace(notNumber, "");
					score=parseInt(score);
					if(score==NaN){
						alert("非法数值");
						return false;
					}
					$(me).text("("+score+"分)");
					this.close();
					return false;
				},
				cancel: true
			});
		});
	};
	function onDelItem() {

		$('.op-del').click(function(e) {
			var id = $(this).parents(".topic-item").find('.label').attr("data-id");
			$.ajax({
				type: "get",
				url: "paper/iutem/delete",
				dataType: 'json',
				data: {
					id: id
				},
				success: function(res, successful) {
					if (!res.success) {
						alert(res.msg);
						return;
					}
					$(this).parents(".topic-item").remove();

				},
				error: function(options, msg) {

					alert(msg);
				}
			});

			//$(this).parents('.topic-item').animate({height:0},{duration:1000}) ;
		});

	};

	function onEditGroupHeader() {
		$('.gp-title span,.gp-desc span').click(function() {
			var me = this;
			var defaultText = $(me).text();
			var dlg = art.dialog({
				title: "修改标题",
				lock: true,
				background: '#600', // 背景色
				opacity: 0.87, // 透明度
				content: '<textarea style="width:400px;height:200px;resize:vertical">' + defaultText + '</textarea>',

				ok: function() {
					var title = $(dlg.content()).find("textarea").val();
					if (title.length > 200) {
						alert('文本过长，请删减');
						return false;
					}
					$(me).text(title);
					this.close();
					return false;
				},
				cancel: true
			});
		});
	};


	Paper.fn.serialize = function() {
		var group=[];
		  $('.gp-topic').each(function(index,item){
		  	var title=$(item).find('.gp-title span').text(),
		  	desc=$(item).find('.gp-desc span').text();
		  	var gItem={scoreMap:{},title:title,desc:desc};
			 $(item).find('.topic-item').each(function(qIndex,qItem){
			 	var id=$(qItem).find('.label').attr('data-id'),
			 	score=$(qItem).find('.score').text();
			 	score=score.replace(notNumber,'');
			 	if(parseInt(score)==NaN){
			 		score=3;
			 	}
			 	gItem.scoreMap[id]=score;
			 });
			 if(isEmptyObj(gItem.scoreMap)){

			 	group.push(gItem);
			 }
		 });
		  return group;
	};

	function bindEvents() {
		debugger;
		onDelItem();
		onEditScore();
		onEditGroupHeader();
	};

	return {
		init: init
	};
});