var mark = 0;
var DispClose = true;
var showModel = "如果没有离开的必要，请选择留在此页";
var _AUTO_SUBMIT_MAX_LENGTH = 40;
var _BLANK_MAX_LENGTH = 40;
var _SUBJECT_MAX_LENGTH = 1024 * 2;
window.bkeypress = {};
var form = {
	url: 'submit_answer',
	data: {
		finalsubmit: false,
		answer: {
			radio: {},
			checkbox: {},
			blank: {},
			judge: {},
			subject: {}
		}
	},
	submit: function() {
		var url = this.url;
		var dt = {
			answer: '',
			finalsubmit: false
		};
		dt['answer'] = JSON.stringify(this.data['answer']);
		dt['finalsubmit'] = this.data['finalsubmit'];
		//alert('before send'+JSON.stringify(dt));
		$.ajax({
			url: url,
			type: 'post',
			data: dt,
			dataType: 'json',
			/*beforeSend:function(){alert('before send'+JSON.stringify(dt));},*/
			success: function(rs) { /*alert('ok send');*/
			},
			error: function(rs, error) {
				alert(error)
			}
		})
	}
};
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '')
};

function nativeSort(arr) {
	return arr.sort(function(a, b) {
		return Math.random() > 0.5 ? 1 : 1
	})
};

function over() {
	/*$('#submitpaper').hide();
	$("body").css({
		'overflow': 'hidden'
	});*/
	alert($('body').height());
	$('#lock').css({
		opacity: 0.6,
		height: $('body').height()
	}).show()
};

function unover() {
	/*$('#submitpaper').show();
	$('body').css('overflow', 'auto');*/
	$('#lock').hide()
};

function CloseEvent() {
	if (DispClose) {
		return showModel
	}
}

function UnLoadEvent() {
	DispClose = false
};

function scanPaper() {
	/*	var data = {
		radio: {},
		checkbox: {},
		blank: {},
		judge: {},
		subject: {}
	};*/

	var data = form['data']['answer'];
	$("#radio li :radio").each(function(index, item) {
		if (this.checked) {
			var label = this.value;
			var id = $(item).parents('li').attr('id');
			data.radio[id] = label
		}
	});
	$("#checkbox li").each(function(index, item) {
		var id = $(item).attr('id');
		var aswList = [];
		$(item).children("div").find(".manyoptioninput").each(function(index, item) {
			if ($(item).attr('choosen') == 1) aswList.push($(item).attr('value'))
		});
		if (aswList.length != 0) data.checkbox[id] = aswList.join('_')
	});
	$("#judge li :radio").each(function(index, item) {
		if (this.checked) {
			var label = this.value;
			var id = $(item).parents('li').attr('id');
			data.judge[id] = label
		}
	});
	$("#blank li :text").each(function(index, item) {
		var id = $(item).parents('li').attr('id');
		var index = $(item).parents('li').find(':text').index($(item));
		var asw = $(item).val().trim();
		if (asw == '') return;
		data.blank[id + '_' + index] = asw
	});
	$("#subject li  textarea").each(function(index, item) {
		var asw = $(item).val().trim();
		if (asw == '') return;
		var id = $(item).parents('li').attr('id');
		data.subject[id] = asw
	});
	//return data
};
$(function() {
	$(".navi  .navi-item").mouseenter(function() {
		$(this).css({
			"padding-bottom": "7px"
		}).children(".navi-app").addClass("navi-app-hvr")
	}).mouseleave(function() {
		$(this).css({
			"padding-bottom": "7px"
		}).children(".navi-app").removeClass("navi-app-hvr")
	});
	$("#font .app-item").click(function() {
		var font = ["16px", "14px", "12px"];
		var index = $("#font .app-item").index($(this));
		$("body   #paperContent").css("font-size", font[index])
	});
	$("#skin .app-item").click(function() {
		var style = ["#0D0A08", "#498AAE", "#0D0A08", "#44678F"];
		var index = $("#skin .app-item").index($(this));
		$(this).attr("id", "style" + index);
		var id = $(this).attr("id");
		$("#top_nav").css("background-image", "url(images/" + id + "nav.png)");
		$("body").css("background-image", "url(images/" + id + "bg.jpg)");
		$("#submitpaper,.clockbg,.app-item,#skin").css("background", style[index]);
		$(".navi-item").hover(function() {
			$(this).css("background", style[index])
		},

		function() {
			$(".navi-item").css("background", "transparent")
		});
		$("#backtobottom").hover(function() {
			$(this).css("background", style[index])
		},

		function() {
			$(this).css("background", "transparent")
		})
	});
	$(window).scroll(function() {
		if ($(this).scrollTop() != 0) {
			$("#to_top").fadeIn()
		} else {
			$("#to_top").fadeOut()
		}
	});
	$("#to_top").click(function() {
		$("body,html").animate({
			scrollTop: 0
		},
		200)
	});
	$("#backtobottom").click(function() {
		$("body,html").animate({
			scrollTop: $("body").height()
		},
		200)
	});
	$(".answerCardHover img").mouseenter(function() {
		$("#answer_card").stop(true, false);
		$("#answer_card").animate({
			width: 271
		},
		200)
	});
	$("#answer_card").mouseleave(function() {
		$(this).animate({
			width: 26
		},
		200)
	});
	$(window).scroll(function() {
		var newTop = $(this).scrollTop() + 100;
		$("#answer_card").animate({
			"top": newTop
		}, {
			duration: 800,
			queue: false
		})
	})
});
var sketchOrder = ['radio', 'checkbox', 'blank', 'judge', 'short'];
var OrderNum = {
	1: '一、',
	2: '二、',
	3: '三、',
	4: '四、',
	5: '五、',
	6: '六、',
	7: '七、'
};
var sketch = [function(radioList, stem) {
	var choiceQuestionList = $("<ol class='choiceQuestionList' id='radio'/>");
	for (var k = 0; k < radioList.length; k++) {
		var qid = radioList[k]["id"];
		var scr = parseInt(radioList[k]["score"]);
		mark += scr;
		$("<li/>").attr('id', qid).append($("<span/>").html(radioList[k]["topic"]), $("<em class='score' />").text('（' + scr + '分）')).append($("<div/>").append($("<div class='optioninput' />").append("<input type='radio' name='" + qid + "' id='" + qid + "_0' value='A'/>"), $("<div class='optionanswer' />").append($("<label/>").attr("for", qid + '_0').text("A." + radioList[k]["A"]))), $("<div/>").append($("<div class='optioninput' />").append("<input type='radio' name='" + qid + "' id='" + qid + "_1' value='B'/>"), $("<div class='optionanswer' />").append($("<label/>").attr("for", qid + '_1').text("B." + radioList[k]["B"]))), $("<div/>").append($("<div class='optioninput' />").append("<input type='radio' name='" + qid + "' id='" + qid + "_2' value='C'/>"), $("<div class='optionanswer' />").append($("<label/>").attr("for", qid + '_2').text("C." + radioList[k]["C"]))), $("<div/>").append($("<div class='optioninput' />").append("<input type='radio' name='" + qid + "' id='" + qid + "_3' value='D'/>"), $("<div class='optionanswer' />").append($("<label/>").attr("for", qid + '_3').text("D." + radioList[k]["D"])))).appendTo(choiceQuestionList)
	}
	$("#paperContent").append($("<h3 class='questionList'/>").text(stem)).append($("<div class='choiceQuestion'/>").append(choiceQuestionList))
},

function(multipleList, stem) {
	var manyChoiceQuestionList = $("<ol class='manyChoiceQuestionList' id='checkbox' />");
	for (var k = 0; k < multipleList.length; k++) {
		var label = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
		var qid = multipleList[k]["id"];
		var scr = parseInt(multipleList[k]["score"]);
		mark += scr;
		var li = $("<li tabindex='0'/>").attr('id', qid).append($("<span/>").html(multipleList[k]["topic"]), $("<em class='score' />").text('（' + scr + '分）'));
		$(multipleList[k]["opt"]).each(function(index, item) {
			li.append($("<div/>").append($("<div class='manyoptioninput' />").attr("value", label[index]), $("<div class='optionanswer' />").append(label[index] + '.' + item)))
		});
		manyChoiceQuestionList.append(li)
	}
	$("#paperContent").append($("<h3 class='questionList'/>").text(stem)).append($("<div class='manyChoiceQuestion'/>").append(manyChoiceQuestionList))
},

function(fillBlankList, stem) {
	var blankQuestionList = $("<ol class='blankQuestionList' id='blank'/>");
	for (var k = 0; k < fillBlankList.length; k++) {
		var qid = fillBlankList[k]["id"];
		var len = $('<div/>').html(fillBlankList[k]["topic"]).find(':text').length;
		var scr = parseInt(fillBlankList[k]["score"]);
		mark += scr * len;
		$("<li/>").attr('id', qid).append($("<span/>").html(fillBlankList[k]["topic"]), $("<em class='score' />").text('（' + scr + '分/空）')).appendTo(blankQuestionList)
	}
	$("#paperContent").append($("<h3 class='questionList'/>").text(stem)).append($("<div class='blankQuestion'/>").append(blankQuestionList))
},

function(judgeList, stem) {
	var opinionQuestionList = $("<ol  class='opinionQuestionList' id='judge'/>");
	for (var k = 0; k < judgeList.length; k++) {
		var qid = judgeList[k]["id"];
		mark += parseInt(judgeList[k]["score"]);
		$("<li/>").attr('id', qid).append($("<span/>").html(judgeList[k]["topic"]), $("<em class='score' />").text('（' + judgeList[k]["score"] + '分）')).append($("<div/>").append("<label><input type='radio' name='" + qid + "' value='1'/>对</label>").append("<label><input type='radio' name='" + qid + "' value='0'/>错</label>")).appendTo(opinionQuestionList)
	}
	$("#paperContent").append($("<h3 class='questionList'/>").text(stem)).append($("<div class='opinionQuestion'/>").append(opinionQuestionList))
},

function(subjectList, stem) {
	var subjectQuestionList = $("<ol class='subjectQuestionList' id='subject'/>");
	for (var k = 0; k < subjectList.length; k++) {
		var qid = subjectList[k]["id"];
		mark += parseInt(subjectList[k]["score"]);
		$("<li/>").attr('id', qid).append($("<span/>").html(subjectList[k]["topic"]), $("<em class='score' />").text('（' + subjectList[k]["score"] + '分）')).append('<div><textarea cols="50" rows="5" /></textarea></div>').append("还可以输入 <span class='lengthLimit' >" + _SUBJECT_MAX_LENGTH + "</span> 个字<a class='lengthWarning'>文本过长，试卷可能无法提交！删除部分答案</a>").appendTo(subjectQuestionList)
	}
	$("#paperContent").append($("<h3 class='questionList'/>").text(stem)).append($("<div class='simpleAnswerQuestion'/>").append(subjectQuestionList))
}];

function initPaper(paper) {
	var s = 1;
	for (var i = 0; i < 5; i++) {
		if (paper["stem"][i] == '-1') continue;
		sketch[i](nativeSort(paper[sketchOrder[i]]), OrderNum[s] + paper["stem"][i]);
		s++
	}
	$('#totalScore').text(mark)
};
$(function() {
	$('#submitpaper').click(function() {
		if (window.count > 0) {
			if (window.confirm('你确定要提交当前试卷?') != true) {
				return
			}
		}
		var data = {
			finalsubmit: true,
			answer: ''
		};
		$.ajax({
			url: 'get_object_answer',
			beforeSend: function() {
				data['answer'] = JSON.stringify(form['data']['answer'])
			},
			data: {},
			type: 'post',
			dataType: 'text',
			success: function(rs) {
				var tl = 0;
				var txt = fix_des_result(des(rs.slice(0, 8), hexToStringForDES(rs.slice(8), 0, 0)));
				var score = {
					radio: {},
					checkbox: {},
					judge: {}
				};
				var sa = eval("(" + txt + ")");
				var myasw = form['data']['answer'];
				var radio = myasw.radio;
				if (radio) for (var i = 0; i < sa.radio.length; i++) {
					var id = sa.radio[i]['id'];
					var casw = radio[id];
					var sasw = sa.radio[i]['asw'];
					var scr = sa.radio[i]['score'];
					if (casw == sasw) {
						tl += scr;
						score.radio[id] = scr
					} else {
						score.radio[id] = 0
					}
				}
				var checkbox = myasw.checkbox;
				if (checkbox) for (var i = 0; i < sa.checkbox.length; i++) {
					var id = sa.checkbox[i]['id'];
					var casw = checkbox[id];
					var sasw = sa.checkbox[i]['asw'];
					var scr = sa.checkbox[i]['score'];
					if (casw == undefined || casw == '') continue;
					casw = casw.split('_').join('');
					var sasw = sasw.split('_').join('');
					if (casw == sasw) {
						tl += scr;
						score.checkbox[id] = scr
					} else if (sasw.match(casw)) {
						tl += Math.ceil(scr / 2);
						score.checkbox[id] = Math.ceil(scr / 2)
					}
				}
				var judge = myasw.judge;
				if (judge) for (var i = 0; i < sa.judge.length; i++) {
					var id = sa.judge[i]['id'];
					var casw = judge[id];
					var sasw = sa.judge[i]['asw'];
					var scr = sa.judge[i]['score'];
					if (casw == sasw) {
						tl += scr;
						score.judge[id] = scr
					}
				}
				var info = {
					answer: form['data']['answer'],
					sum: tl,
					score: score
				};
				$.ajax({
					url: 'Client/submit_final',
					data: {
						data: JSON.stringify(info)
					},
					type: 'post',
					dataType: 'json',
					success: function(rs) {
						if (!rs.success) {
							alert(rs.message + "未能成功交卷，抱歉！");
							return
						}
						clearInterval(window.count);
						alert('您的客观题得分为: ' + tl + '  试卷已提交');
						showModel = undefined;
						location.href = 'logout'
					},
					error: function(status, error) {
						alert('未能提交试卷')
					}
				})
			},
			error: function(status, error) {
				alert('批阅出错')
			}
		})
	});
	$.ajax({
		url: 'get_test_paper',
		data: {},
		type: 'post',
		dataType: 'json',
		success: function(rs) {
			if (!rs.success) {
				alert(rs.message);
				showModel = undefined;
				location.href = 'examList.jsp';
				return
			}
			var paper = rs.data;

			var aswbackup = rs.aswbackup;
			/*alert(JSON.stringify(aswbackup));*/
			initPaper(paper);
			$(".paperContent").find("h3.questionList").each(function(index, item) {
				$(".answerInfo dl").append($('<dt/>').text($(item).text()));
				$(item).next().children("ol").children("li").each(function(index, item) {
					var id = $(item).attr("id");
					$(".answerInfo dl").append($("<dd/>").append($("<a/>").text(index + 1).attr('href', '#' + id).attr('title', id)))
				})
			});
			$('.answerInfo a[href*=#]').live('click',

			function() {
				if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
					var $target = $(this.hash);
					$target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
					if ($target.length) {
						var targetOffset = $target.offset().top - 50;
						$('html,body').animate({
							scrollTop: targetOffset
						},
						400);
						return false
					}
				}
			});

			if (aswbackup) setTimeout(function() {

				for (var prolist in aswbackup) {
					form['data']['answer'][prolist] = aswbackup[prolist]
				}
				if (aswbackup.radio) {
					var radio = aswbackup.radio;
					var asworder = {
						A: 0,
						B: 1,
						C: 2,
						D: 3
					};
					for (var id in radio) {
						$("#radio li[id='" + id + "'] div").find('input').eq(asworder[radio[id]]).attr('checked', true);
						$("#answer_card a[title='" + id + "']").addClass('done')
					}
				}
				if (aswbackup.checkbox) {
					var checkbox = aswbackup.checkbox;
					var asworder = {
						A: 0,
						B: 1,
						C: 2,
						D: 3,
						E: 4,
						F: 5,
						G: 6,
						H: 7,
						I: 8,
						J: 9,
						K: 10
					};
					for (var id in checkbox) {
						var list = checkbox[id].split('_');
						if (list.length == 0) {
							break
						}
						for (var i = 0; i < list.length; i++) {
							$("#checkbox li[id='" + id + "'] div div.manyoptioninput").eq(asworder[list[i]]).addClass('checked').attr('choosen', 1);
							$("#answer_card a[title='" + id + "']").addClass('done')
						}
					}
				}
				if (aswbackup.blank) {
					/* alert('enter blank');*/
					var blank = aswbackup.blank;
					for (var id in blank) {
						var ad = id.split('_');
						var asw = blank[id];
						/*	alert(asw);*/
						$("#blank li[id='" + ad[0] + "'] :text").eq(ad[1]).val(asw);
						var flag = true;
						$("#blank li[id='" + ad[0] + "'] :text").each(function(index, item) {
							if ($(item).val() == '') {
								flag = false;
								return false
							}
						});
						if (flag == true) {
							$("#answer_card a[title='" + ad[0] + "']").addClass('done')
						}
					}
				}
				if (aswbackup.judge) {
					var judge = aswbackup.judge;
					for (var id in judge) {
						var ck = judge[id] == 1 ? 0 : 1;
						$("#judge li[id='" + id + "'] div input").eq(ck).attr('checked', true); {
							$("#answer_card a[title='" + id + "']").addClass('done')
						}
					}
				}
				if (aswbackup.subject) {
					var subject = aswbackup.subject;
					for (var id in subject) {
						var asw = subject[id];
						if (asw == "") continue;
						$("#subject li[id='" + id + "'] div textarea").val(asw);
						$("#answer_card a[title='" + id + "']").addClass('done')
					}
				}

			}, 700);
			c = new clock();
			var availTime = rs.time;
			c.setCount(availTime);

			c.showMsg = function() {
				this.hour = parseInt(window.count / 60 / 60);
				this.min = parseInt((window.count - 3600 * this.hour) / 60);
				this.sec = parseInt(window.count - this.hour * 3600 - this.min * 60);
				var format = (this.hour < 10 ? '0' + this.hour : this.hour) + ':' + (this.min < 10 ? '0' + this.min : this.min) + ':' + (this.sec < 10 ? '0' + this.sec : this.sec);
				$('#time').text(format)
			};
			c.stop = function() {
				scanPaper();
				form['data']['answer'];
				$('#submitpaper').trigger('click')
			};
			c.tick(1000);
			(function() {
				$(".choiceQuestionList li").children("div").find("input").change(function() {
					var id = $(this).parents("li").attr("id");
					answer = this.value;
					form['data']['answer']['radio'][id] = answer;
					form.submit();
					$("#answer_card a[title='" + id + "']").addClass('done')
				});
				$(".manyChoiceQuestionList li").focusout(function() {
					var id = $(this).attr("id");
					var aswlist = [];
					$(this).find("div.manyoptioninput").each(function(index, item) {
						if ($(item).attr("choosen") == 1) {
							aswlist.push($(item).attr('value'))
						}
					});
					form['data']['answer']['checkbox'][id] = aswlist.join('_');
					form.submit();
					if (aswlist.length) {
						$("#answer_card a[title='" + id + "']").addClass('done')
					} else {
						$("#answer_card a[title='" + id + "']").removeClass('done')
					}
				});
				$(".manyChoiceQuestionList li div.manyoptioninput").toggle(function() {
					$(this).addClass("checked").attr("choosen", 1)
				},

				function() {
					$(this).removeClass("checked").attr("choosen", 0);
				});
				$(".manyChoiceQuestionList li div.optionanswer").click(function(event) {
					var input = $(this).prev("div.manyoptioninput");
					$(input).trigger("click")
				});
				$(".opinionQuestionList li").find("input").change(function() {
					var id = $(this).parents("li").attr("id");
					var answer = this.value;
					form['data']['answer']['judge'][id] = answer;
					form.submit();
					$("#answer_card a[title='" + id + "']").addClass('done')
				});
				$(".blankQuestionList li  span input").addClass('blankInput').attr('maxlength', _BLANK_MAX_LENGTH);
				$(".blankQuestionList li  span input").change(function() {
					var id = $(this).parents('li').attr('id');
					var index = $(this).parents('li').find(':text').index($(this));
					var answer = $(this).val();

					form['data']['answer']['blank'][id + '_' + index] = answer;
					form.submit();
					var flag = true;
					$(this).parent().find(':text').each(function(index, item) {
						if ($(item).val() == '') {
							flag = false;
							return false
						}
					});
					if (flag == true) {
						$("#answer_card a[title='" + id + "']").addClass('done')
					} else {
						$("#answer_card a[title='" + id + "']").removeClass('done')
					}
				});
				$(".simpleAnswerQuestion li").each(function(index, item) {
					var id = $(item).attr("id");
					window.bkeypress[id] = 0
				});
				$(".simpleAnswerQuestion li textarea").change(function() {
					var id = $(this).parents("li").attr("id");
					var answer = $(this).val();
					form['data']['answer']['subject'][id] = answer;

					form.submit();
					if (answer != '') {
						$("#answer_card a[title='" + id + "']").addClass('done')
					} else {
						$("#answer_card a[title='" + id + "']").removeClass('done')
					}
				});
				$(".simpleAnswerQuestion li textarea").keyup(function(e) {
					var id = $(this).parents("li").attr("id");
					var answer = $(this).val();
					var remain = _SUBJECT_MAX_LENGTH - answer.length;
					if (remain < 0) {
						$(this).parents('li').find('.lengthWarning').show();
					} else {
						$(this).parents('li').find('.lengthWarning').hide();
					}
					$(this).parent().next('.lengthLimit').text(remain);
					form['data']['answer']['subject'][id] = answer;
					if (window.bkeypress[id] <= _AUTO_SUBMIT_MAX_LENGTH) window.bkeypress[id]++;
					else {
						$(this).trigger('change');
						window.bkeypress[id] = 0
					}
					if (answer != '') {
						$("#answer_card a[title='" + id + "']").addClass('done')
					} else {
						$("#answer_card a[title='" + id + "']").removeClass('done')
					}
				})
			})()
		},
		error: function(status, error) {
			//alert('请不要频繁刷新浏览器' + error)
		}
	})
});