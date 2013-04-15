var previewApp = (function() {
	debugger;
	function querystring(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	};
	var from = querystring('ref'); /*local intel manual*/
	var course=querystring('course');
	var paperid=querystring('paperid');
	function onDeleteItem() {
		$('.delete-item').click(function(e) {
			var olEle=$(this).parents('ol');
			$(this).parents('li').remove();
			
			if(olEle.find('li').length==0){
				var divEle=olEle.parent(),
				descEle=divEle.prev(),
				titleEle=descEle.prev();
				titleEle.remove();
				descEle.remove();
				divEle.remove();
			}
			e.preventDefault();
			return false;
		});
	};
	function onPageLoad (){
		$('.refresh').attr('href',encodeURI($.cookie('refresh_url')));
	};
	function diabledPaper(){
		$('ol li').find('input,textarea').attr('disabled','disabled');
	};
	function onSubmitPaper() {

		$('#submit-paper').click(function(e) {
			debugger;
			var rs=serializePaper(paperid);
			
			for(var pro in rs){
				var value=rs[pro];
				if(typeof value=="object"){
					rs[pro]=JSON.stringify(value);
				}
			};
			$.ajax({
				//url: "exam/submit",
				url: "../../paper/add.do",
				type: 'post',
				data:  rs,
				dataType: 'json',
				success: function(rs, successfull) {
					if (!rs.success) {
						alert(rs.msg);
					}
					art.dialog({
						lock:true,
					    content: '试卷添加成功！',
					    ok: function () {
					    	this.title('3秒后自动关闭').time(3);
					    	location.href="../../";
					        return true;
					    }
					});

				},
				error: function(rs, error) {
					alert('添加失败了，'+error);
				}
			});
			e.preventDefault();
			return false
		});
	};

	function serializePaper(pid) {
		var rs = {
			id:pid||'',
			title: $('#paperTitle h2').text(),
			creator: eUserInfo.userid,
			cid: eUserInfo.courseid,
			cname: course,
			groups: null
		};
		var map = {},
		groups = [];
		$('#paperContent ol').each(function(index, item) {
			var descEle = $(item).parent().prev(),
			desc=descEle.text(),
			title=descEle.prev().text();
				group = {};
			group.title = title;
			group.desc = desc;
			group.scoreMap = [];
			//var desc=$(item).find('.desc').text();
			$(item).find('li').each(function(qIndex, qItem) {
				var type = $(qItem).attr('data-type'),
					score = $(qItem).find('.score').text();
				score = score.replace(/[^\d]/g, '');
				scoreMap = {
					id: parseInt(qItem.id),
					score: parseInt(score)
				};
				group.scoreMap.push(scoreMap);
			});
			groups.push(group);
		});
		rs.groups = groups;
		return rs;
	};
	function extraEvents(){
		$(window).scroll(function() {
			clearTimeout(this.proIDT);
			this.proIDT = setTimeout(function() {

				if ($(this).scrollTop() > 100) {
					$("#to_top").fadeIn()
				} else {
					$("#to_top").fadeOut()
				}
			}, 618);

		});

		$("#backtobottom").click(function() {
			$("body,html").animate({
				scrollTop: $("body").height()
			},
			200);
		});
		$("#to_top").click(function() {
			$("body,html").animate({
				scrollTop: 0
			},
			200)
		});
	};
	function bindEvents() {
		extraEvents();
		onDeleteItem();
		onSubmitPaper();
		onPageLoad();
		diabledPaper();
	};

	function run() {
		bindEvents();
	};
	return {
		run: run
	};
})();