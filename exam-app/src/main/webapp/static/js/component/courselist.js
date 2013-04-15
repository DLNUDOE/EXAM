(function($) {
	$.fn.courselist=function(options){

	var tpl = '<li><a href="#"></a></li>';
	var _constructor = function(ele, options) {
		debugger;
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
		debugger;

	};
	var bindEvents = function(obj) {

		$(obj.$trigger).click(function(e) {
			if ($(obj.$eList).css('display') == "none") {

				$(obj.$eList).show();
			} else {
				$(obj.$eList).hide();
			}
		});
		$(obj.$eList).find("li").live("click", function(e) {
			var value = $(this).text();
			obj.$eInput.val(value).data('cid', $(this).attr('data-cid'));
			$(obj.$eList).hide();
			e.preventDefault();
			return false;
		});
		$(obj.$eInput).click(function(e) {
			var value = $(this).text();

			$(obj.$eList).show();
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
					debugger;
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
	_constructor.prototype.getValue = function() {
		var $eInput = this.$eInput;
		return {
			name: this.$eInput.val(),
			cid: $eInput.data('cid')
		};
	};
	var create = function(ele, options) {
		return new _constructor(ele, options);
	};
	return {
		create: create
	};
	};
})($);
