var topicCore = topicCore || {};
topicCore.config = {
	RADIO: 1,
	CHECKBOX: 2,
	BLANK: 3,
	JUDGE: 4,
	SUBJECT: 5
};
topicCore.util = (function() {
	function checkOptions(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (!arr[i]) {
				return false;
			}
		}
		return true;
	};
	function getBlankList(selector){
		return $(selector).find("iframe").contents().find('body input[type=text]');
	};
	return {
		checkOptions: checkOptions,
		getBlankList:getBlankList
	};
}());
topicCore.course = (function() {
	var tpl = '<li><a href="#"></a></li>';
	var _constructor = function(ele, options) {

		var opts = $.extend({
			//url: "/"+eDomain.getURL("/course/list"),
			store: [],
			courseid: -1
		}, options);
		this.$el = $(ele);
		this.$eList = $(this.$el).find("ul");
		this.$trigger = this.$el.find('i');
		this.$eInput = this.$el.find('input[type=text]');
		this.store = opts.store;
		this.options = opts;
		this.onInit();


	};
	var bindEvents = function(obj) {

		$(obj.$trigger).click(function(e) {
			var ul = $(this).parents('.select').find('ul');
			if (ul.css('display') == "none") {

				ul.show();
			} else {
				ul.hide();
			}
		});
		$(obj.$eList).find("li").live("click", function(e) {
			var value = $(this).text();
			$(this).parents('.select').find('input').val(value).data('cid', $(this).attr('data-cid'));
			$(this).parents('.select').find('ul').hide();
			e.preventDefault();
			return false;
		});
		$(obj.$eInput).click(function(e) {
			var value = $(this).text();

			$(this).parents('.select').find('ul').show();
		});
	};
	_constructor.prototype.onInit = function() {
		bindEvents(this);
		this.loadData();
		this.$eInput.data("cid", -1);
	};
	_constructor.prototype.loadData = function() {
		var me = this;
		if (this.options.store.length == 0) {
			$.ajax({
				type: "get",
				url: me.options.url,
				dataType: 'json',
				data: {
					id: me.options.id
				},
				success: function(res, successful) {
					if (!res.success) {
						alert(res.msg);
						return;
					}
					me.store = res.data;
					me.render();
				},
				error: function(options, msg) {

					alert(msg);
				}
			});
		} else {
			this.render();
		}
	};
	_constructor.prototype.render = function() {
		var store = this.store,
			$eList = this.$eList;
		$eList.empty();

		for (var i = 0; i < store.length; i++) {
			var item = store[i];


			$eList.append(
			$('<li data-cid="' + item.id + '"/>').append($('<a href="#" >' + item.name + '</a>')));

		}
	};
	_constructor.prototype.getValue = function(type) {
		var $eInput = this.$eInput;
		return {
			name: $eInput.eq(type).val(),
			cid: $eInput.eq(type).data('cid')
		};
	};
	var create = function(ele, options) {
		return new _constructor(ele, options);
	};
	return {
		create: create
	};
})();


topicCore.radio = (function() {
	var _constructor = function(ele, options) {
		var opts = $.extend({

		}, options);
		this.$el = $(ele);
		this.$adder = this.$el.find(".last");

		this.options = opts;

		this.onInit();

	};
	var bindEvents = function(obj) {
		$(obj.$adder).click(function(e) {
			obj.addItem();
			e.preventDefault();
			return false;
		});
		$(obj.$el).find(".delete-item").live("click", function(e) {
			obj.removeItem(e.target);
		});
	};
	_constructor.fn = _constructor.prototype;
	_constructor.fn.addItem = function() {
		var len = this.$el.find('li').length,
			newItem = $('<li class="option"></li>').append(
			$('<label for="">A.</label>').text(String.fromCharCode(64 + len) + '.'),
				'<input type="text" class="option-field"/>',
				'<input type="radio" name="radio-option">',
				'<a href="#" class="delete-item"></a>');
		newItem.insertBefore($(this.$el).find(".last"));
	};
	_constructor.fn.removeItem = function(target) {
		$(target).parent("li").remove();
		var $el = this.$el,
			len = $el.find('li.option').length;

		$el.find("li.option").each(function(index, item) {

			$(item).find('label').text(String.fromCharCode(65 + index) + ".");
			$(item).find('input').val(String.fromCharCode(65 + index));
		});
	};
	_constructor.fn.onInit = function() {
		bindEvents(this);
	};

	_constructor.fn.getAnswer = function() {
		var label = this.$el.find("input[type=radio]:checked").parent().find("label").text();
		return label.replace(/\s|\./g, '').toUpperCase();
	};
	_constructor.fn.getOptions = function() {
		var list = this.$el.find(".option"),
			rs = [];

		for (var i = 0; i < list.length; i++) {
			var text = list.eq(i).find("input[type=text]").val();
			text = $.trim(text);

			rs.push(text);

		}
		return rs;
	};
	var create = function(ele, options) {
		return new _constructor(ele, options);
	};
	return {
		create: create
	};
})();

topicCore.checkbox = (function() {
	var tpl = '<li class="option"><label for="">A.</label><input type="text" class="option-field"/><input type="checkbox" name="checkbox-option"><a href="#" class="delete-item"></a></li>';
	var _constructor = function(ele, options) {
		var opts = $.extend({

		}, options);
		this.$el = $(ele);
		this.$adder = this.$el.find(".last");

		this.options = opts;

		this.onInit();

	};
	var bindEvents = function(obj) {
		$(obj.$adder).click(function(e) {
			obj.addItem();
			e.preventDefault();
			return false;
		});
		$(obj.$el).find(".delete-item").live("click", function(e) {
			obj.removeItem(e.target);
		});
	};
	_constructor.fn = _constructor.prototype;
	_constructor.fn.addItem = function() {
		var len = this.$el.find('li').length,
			label = String.fromCharCode(64 + len);
		newItem = $('<li class="option"></li>').append(
		$('<label for="">A.</label>').text(label + '.'),
			'<input type="text" class="option-field"/>',
			'<input type="checkbox" name="checkbox-option" value=' + label + ' />',
			'<a href="#" class="delete-item"></a>');
		newItem.insertBefore($(this.$el).find(".last"));
	};
	_constructor.fn.removeItem = function(target) {
		$(target).parent("li").remove();
		var $el = this.$el,
			len = $el.find('li.option').length;

		$el.find("li.option").each(function(index, item) {
			var label = String.fromCharCode(65 + index);
			$(item).find('label').text(label + ".");
			$(item).find('input[type=checkbox]').val(label);
		});
	};
	_constructor.fn.onInit = function() {
		this.$el.find('.option').remove();
		for (var i = 0; i < this.options.optLenth; i++) {
			this.addItem();
		}
		bindEvents(this);
	};

	_constructor.fn.getAnswer = function() {
		debugger;
		var checkList = this.$el.find("input[type=checkbox]:checked");
		var label = [];
		checkList.each(function(index, item) {
			label.push(item.value);
		});
		return label.join('').toUpperCase();
	};
	_constructor.fn.getOptions = function() {
		var list = this.$el.find(".option"),
			rs = [];

		for (var i = 0; i < list.length; i++) {
			var text = list.eq(i).find("input[type=text]").val();
			text = $.trim(text);

			rs.push(text);

		}
		return rs;
	};
	var create = function(ele, options) {
		return new _constructor(ele, options);
	};
	return {
		create: create
	};
})();


topicCore.blank = (function() {
	var _constructor = function(ele, options) {
		var opts = $.extend({
			ke: null,
		}, options);
		this.$el = $(ele);
		this.$adder = this.$el.find(".last");

		this.options = opts;

		this.onInit();

	};
	var bindEvents = function(obj) {
		$(obj.$adder).click(function(e) {
			obj.addItem();
			e.preventDefault();
			return false;
		});
		$(obj.$el).find(".delete-item").live("click", function(e) {
			obj.removeItem(e.target);
		});
		$(obj.$el).find('input[type=text]').live('keydown',function(e){

			clearTimeout(this.throttelId);
			var me=this;
			
			this.throttelId=setTimeout(function(){
				var index=$(obj.$el).find('.option input[type=text]').index(me);
				var text=$(me).val();
				$('#blank-editor-wrapper').find("iframe").contents().find('body input[type=text]').eq(index).val(text);
			},618);
		});
	};

	_constructor.fn = _constructor.prototype;
	_constructor.fn.addItem = function(editor) {
		var editor = this.options.ke;
		var selHtml = editor.selectedHtml();
		debugger;
		if (!$.trim(selHtml)) {
			alert('请选择题干中的一段文本');
			return;
		}
		editor.insertHtml('<input type="text" readonly  value="' + selHtml + '"  />');
		var len = this.$el.find('li').length,
			newItem = $('<li class="option"></li>').append(
			$('<label for="">A.</label>').text('空' + len),
			$('<input type="text"  />').val(selHtml),
				'<a href="#" class="delete-item"></a>');


		newItem.insertBefore($(this.$el).find(".last"));

		/*we don't know where the teacher select the text,in a words not in order,but
		 *we can rearrange the blank list by getting the existed blanks in the  editor
		 */
		var list = $('#blank-editor-wrapper').find("iframe").contents().find('body input[type=text]');
			$(this.$el).find('.option').remove();
			var me=this;
		list.each(function(index, item) {
			var reItem = $('<li class="option"></li>').append(
			$('<label for="">A.</label>').text('空' + (index+1)),
			$('<input type="text"  />').val(item.value),
				'<a href="#" class="delete-item"></a>');
			 reItem.insertBefore($(me.$el).find(".last"));
		});
	};
	_constructor.fn.removeItem = function(target) {
		var len = this.$el.find('.option').length;
		var li = $(target).parent("li");
		var index = $(li).parent().find('.option').index(li)
		var text = $(li).find('input[type=text]').val();
		$('#blank-editor-wrapper').find("iframe").contents().find('body input[type=text]').eq(index).replaceWith(text);
		li.remove();
		this.$el.find('.option').each(function(index, item) {

			$(item).find('label').text("空" +( index + 1));
		});


	};
	_constructor.fn.onInit = function() {
		this.$el.find('.option').remove();
		bindEvents(this);
	};

	_constructor.fn.getBlanks = function() {
		debugger;
		var checkList = this.$el.find("input[type=text]");
		var label = [];
		checkList.each(function(index, item) {
			label.push(item.value);
		});
		return label;
	};

	var create = function(ele, options) {
		return new _constructor(ele, options);
	};
	return {
		create: create
	};
})();
topicCore.judge = (function() {
	var _constructor = function(selector) {
		this.selector = selector;
	};
	_constructor.prototype.getChecked = function() {
		return $(this.selector).find('input[type=radio]:checked').val();
	};

	return {
		create: function(selector) {
			return new _constructor(selector);
		}
	};
})();

topicCore.tag = (function() {
	var tpl = '<li class="option"><label for="">A.</label><input type="text" class="option-field"/><input type="radio" name="radio-option"><a href="#" class="delete-item"></a></li>';
	var _constructor = function(ele, options) {
		var opts = $.extend({
			url: "tag/list",
			store: [],
			charLimit: 16
		}, options);
		this.$el = $(ele);
		this.$eTagComplete = this.$el.find("ul.complete-list");
		this.$eInput = this.$el.find("input[type=text]");
		this.$eTagList = this.$el.find(".tag-item-list");
		this.options = opts;
		this.onInit();

	};
	var bindEvents = function(obj) {

		$(obj.$eInput).focusin(function(e) {

			$(this).parents('.mod-tag-wrapper').find('.complete-list').css("display", "block");

		});
		/*$(obj.$eInput).focusout(function(e){
			$(obj.$eTagComplete).css("display","none");
		});*/
		/*	$(obj.$eInput).mouseout(function(e) {
			$(obj.$eTagComplete).css("display","none");
		});*/
		$(obj.$el).mouseleave(function(e) {

			$(this).find('.complete-list').css("display", "none");
		});
		$(obj.$el).mouseenter(function(e) {
			$(this).find('.complete-list').css("display", "block");
		});
		$(obj.$eInput).keyup(function(e) {

			var pattern = /[,\.;\:、?\\\/"'!，。；？、\|]/g;
			var str = $(this).val().replace(pattern, "");
			str = $.trim(str);
			console.log(e.keyCode);
			var limit = obj.options.charLimit;

			var $eTagList = $(this).parents(".mod-tag-wrapper").find(".tag-item-list");
			if (e.keyCode == 188 || e.keyCode == 229 || e.keyCode == 13) {
				if (str == '') {
					$(this).val('');
					return false;
				}
				if (str.length > limit) {

					alert("标签长度超出" + limit);
					return false;
				}
				var tag = obj.createTag({
					closable: true,
					text: str
				});
				$eTagList.append(tag);
				$(this).val('');
				//return false;
			}
			if (e.keyCode == 8 && str == '') {
				$eTagList.find(".tag-item:last a").trigger("click");
			}
		});
		$(obj.$eInput).keyup(function(e) {
			var me=this,
			word=this.value;
			clearTimeout(this.proId);
			this.proId=setTimeout(function(){
				obj.loadTagList(word);
			},618);
		});
		$(obj.$eTagComplete).find('.tag-item').live("click", function(e) {

			$(this).append('<a href="#" title="删除" class="tag-close" onclick="return false;">×</a>');
			 
			$(this).parents(".mod-tag-wrapper").find(".tag-item-list").append($(this));

		});
		$(obj.$eTagList).find('.tag-item a').live("click", function(e) {

			 
			$(this).parents(".mod-tag-wrapper").find(".complete-list").append($(this).parent());
			$(this).remove();
		});
	};
	_constructor.fn = _constructor.prototype;
	_constructor.fn.createTag = function(options) {
		var opts = $.extend({
			closable: true,
			text: ""
		}, options);
		var tag = null;
		if (opts.closable) {
			tag = $('<li class="tag-item" />').append(
			$('<span class="tag-name" />').text(opts.text),
			$('<a href="#" title="删除" class="tag-close"  />').text("×"));
		} else {
			tag = $('<li class="tag-item" />').append(
			$('<span class="tag-name" />').text(opts.text));
		}
		return tag;
	};
	_constructor.fn.removeTag = function(target) {

		return $(target).remove();
	};
	_constructor.fn.loadTagList = function(key) {
		var me = this;
		$.ajax({
			type: "get",
			//url: eDomain.getURL(me.options.url),
			url: "../question/kp/tip.do",
			dataType: 'json',
			data: {
				word: key
			},
			success: function(res, successful) {
				if (!res.success) {
					alert(res.msg);
					return;
				}
				me.options.store = res.data;
				me.renderTag();
			},
			error: function(options, msg) {

				alert(msg);
			}
		});
	};
	_constructor.fn.renderTag = function() {

		var store = this.options.store,
			$eTagComplete = this.$eTagComplete.empty();

		for (var i = 0; i < store.length; i++) {
			var item = store[i];
			var tag = this.createTag({
				closable: false,
				text: item
			});

			$eTagComplete.append(tag);
		}

	};

	_constructor.fn.onInit = function() {
		bindEvents(this);
		//this.loadTagList();
	};
	_constructor.fn.getTags = function(selecttor) {

		var tag = [];
		$(selecttor).find(".tag-item").each(function(index, item) {
			tag.push($(item).find(".tag-name").text());
		});

		return tag.join(',');
	}


	var create = function(ele, options) {
		return new _constructor(ele, options);
	};
	return {
		create: create
	};
})();



topicCore.proxy = (function() {
	var opts = {
		type: topicCore.config.RADIO,
		courseid: -1,
		stem: {
			title: ""
		},
		kp: [],
		answer: '',
	};
	debugger;

	function validator(options) {
		if (options.type == -1) {
			alert("题型未设置");
			return false;
		}
		if (options.courseid == -1) {
			alert("请选择课程");
			return false;
		}
		if (options.stem.title == "") {
			alert("题干为空");
			return false;
		}
		if (options.stem.option.length < 2 && (options.type == 1 || options.type == 2)) {
			alert("低于选项最少数目");
			return false;
		}
		if (options.answer == '') {
			alert("答案为空");
			return false;
		}if (options.kp == '') {
			alert("至少添加一个知识点");
			return false;
		}
		return true;
	};

	function getTopic(options) {


		return $.extend(opts, options);


	};

	function reset(resetList) {
		var ke = resetList.ke,
			tag = resetList.tag,
			opt = resetList.opt;
		ke && ke.html('');
		tag && tag.find('.tag-item-list').empty();
		opt && $(opt).find("li input[type=text]").val('') && $(opt).find("li input[type=text]").find("li input:checked").attr('checked', false);

	};

	function submitTopic(topic, url, resetList) {

		if (!validator(topic)) {
			return false;;
		}
		var o = {};
		for (var pro in topic) {
			var value = topic[pro];
			if (typeof value === 'object') {
				o[pro] = JSON.stringify(value);
			} else {
				o[pro] = value;
			}
		}
		$.ajax({
			type: "post",
			url: url,
			dataType: 'json',
			data: o,
			success: function(res, successful) {
				if (!res.success) {
					alert(res.msg);
					return;
				}

				art.dialog({
					width: 420,
					content: '题目已添加！<br/><span style="line-height:30px;color:rgb(199, 194, 194)">ESC 关闭弹窗</span>',
					lock: true,
					ok: function() {
						if (resetList) {
							reset(resetList);
						}
						this.close();
					}
				});
			},
			error: function(options, msg) {

				alert(msg);
			}
		});
	};

	function log(id, type, date) {
		var obj = {
			id: id,
			type: type,
			date: date.toLocaleDateatetring() + " " + date.toLocaleTimeString()
		};
		$.cookie(id + '_' + type, JSON.stringify(obj), {
			expires: 100
		});
	};
	return {
		getTopic: getTopic,
		log: log,
		submitTopic: submitTopic
	};

}());