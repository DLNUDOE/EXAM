var previewApp = (function() {
	debugger;
	function querystring(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	};
	var paperid="";
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
		$('#gyfnice').click(function(e) {
			var len=$('#backselect option').length;
        var tem=[];
        for(i=1;i<len;i++){
			var cid=$('#backselect option')[i].value;
		    var cname=$('#backselect option')[i].text;
		    data={id:cid,name:cname};
		    tem.push(data);
		}
		var aloc=JSON.stringify(tem)
		localStorage.setItem("courseid",aloc);
			window.location.reload();
		});
		$('.refresh').attr('href',encodeURI($.cookie('refresh_url')));
	};
	function diabledPaper(){
		$('ol li').find('input,textarea').attr('disabled','disabled');
	};
	function onSubmitPaper() {

		$('#submit-paper').click(function(e) {
			debugger;
			var title=$('#p-title').val();
			var cou=$('#backselect option:selected').val();
			if(title==""||cou==-1){
				if(title==""){
				alert("请填写试卷名称")
			}else if(cou==-1){
				alert("请选择您的课程");
			}
				return false;
			}
			rs=gyfserialize();
			for(var pro in rs){
				var value=rs[pro];
				if(typeof value=="object"){
					rs[pro]=JSON.stringify(value);
				}
			};
			debugger;
			$.ajax({
				//url: "exam/submit",
				url: "/paper/add.do",
				type: 'post',
				data:  rs,
				dataType: 'json',
				success: function(rs, successfull) {
					if (!rs.success) {
						alert(rs.msg);
					}
					localStorage.clear();
					art.dialog({
						lock:true,
					    content: '试卷添加成功！',
					    ok: function () {
					    	this.title('3秒后自动关闭').time(3);
					    	location.href="../../../";
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
    function gyfserialize() {
     var tempaper={
	id:'',
	title: $('#p-title').val(),
	creator: $('#p_name').val(),
	cid: $('#backselect option:selected').val(),
	cname: $('#backselect option:selected').text(),
    groups : [{
      "title": "单选题",
      "desc": "以下选项中任选一个",
      "scoreMap": []
    }, {
      "title": "多选题",
      "desc": "以下选项中可选多个",
      "scoreMap": []
    }, {
      "title": "填空题",
      "desc": "填空题分数以空为单位",
      "scoreMap": []
    }, {
      "title": "判断题",
      "desc": "无",
      "scoreMap": []
    }, {
      "title": "主观题",
      "desc": "主观题作答",
      "scoreMap": []
    }, {
      "title": "混合题",
      "desc": "混合题",
      "scoreMap": []
    }]
  };
   var scoreMap=[3,6,4,2,15];
    for(var i=0;i<localStorage.length;i++){
      var key=localStorage.key(i);
      var cov=JSON.parse(localStorage.getItem(key));
      var type=parseInt(cov.type);
      if(type>=1 && type<=6){
        var index=type-1;
        var cid=cov.id;
        var score=scoreMap[index];
        var gyfdata={
	            "id": cid,
	            "score": score
	        };
	    tempaper.groups[index].scoreMap.push(gyfdata);
		};
        
      }
      return tempaper;
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