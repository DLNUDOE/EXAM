/*start clock*/



var examApp = (function($) {
	var localAnswerMap = {};
	 
	function querystring(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	};
	var __SUBJECTLIMIT__ = 2048;
	var throttleLimit = {
		RADIO: 1200,
		CHEKCBOX: 1600,
		BLANK: 618,
		JUDGE: 200,
		SUBJUECT: 618
	};
	/*var localAnswerMap = {
		169: 'A'
	};*/
	var throttleMap = {};
	var sid = eUserInfo.id;
	var eid = querystring('examid');

	function isArrayEmpty(arr) {
		var len = arr.length,
			count = 0;

		for (var i = 0; i < len; i++) {

			if (arr[i] == '' || arr[i] == undefined || arr[i] == null) {
				count++;
			}
		}
		return (count == len);
	};

	function senderProxy(qid, answer) {
		$.ajax({
			url: "submit/asw.do",
			//url: "test/examsubmit.json",
			type: 'post',
			data: {
				examid: eid,
				studentid: sid,
				questionid: qid,
				asw: answer
			},
			dataType: 'json',
			success: function(rs, successfull) {
				 
				localAnswerMap[qid + ""] = answer;
				/*let the anwser card item corresponding selected*/
				//alert('-'+answer+'-');
				answer!=''&&$('dd a[href=#'+qid+']').addClass('done');

			},
			error: function(rs, error) {
				//alert(error)
			}
		});
	};

	function loadAnswerHistroy(eid, sid) {

		$.ajax({
			url: "sync/asw.do",
			//url: "test/examstudentanswer.json",
			type: 'get',
			data: {
				examid: eid,
				sid: sid
			},
			dataType: 'json',
			success: function(rs, successfull) {
				localAnswerMap = rs.data;
				 
				/*when the answer is loaded we get the init the localAnswerMap and init the UI of ansercard*/
				renderStuAnswer(localAnswerMap);
				setAnswerCardStatus(localAnswerMap);
				examAssistant();
			},
			error: function(rs, error) {
				//alert(error)
			}
		});

	};

	function showLocker() {

	};

	function onSubmitPaper() {
		$('#submitpaper').click(function(e, force) {
			debugger;
			$('#locker').css({
				width: $(document.body).width()
			}).slideDown(100);

			$.ajax({
				url: "commit.do",
				//url: "test/examstudentanswer.json",
				type: 'post',
				data: {
					examid: eid,
					studentid: sid,
					force: force == true ? 1 : 0
				},
				dataType: 'json',
				success: function(rs, successfull) {
					if (!rs.success) {
						$('#locker').hide(100);
						alert('交卷失败 '+msg);
						return;
					}
					alert('您已成功交卷! 客观题得分:' + rs.data);
					location.href = "./panel.html";
					return;
				},
				error: function(rs, error) {
					alert(error);

				}
			});
		});
	};

	function renderStuAnswer(map) {

		for (var id in map) {

			var qItem = $('#' + id),
				value = map[id],
				type = qItem.attr('data-type');
			if (type == 1 || type == 4) {
				var option = qItem.find('input[value=' + value + ']')[0];
				option && (option.checked = true);
			} else if (type == 2) {
				var labelList = String(value).split('');
				for (var i = 0, len = labelList.length; i < len; i++) {
					var label = labelList[i];
					var option = qItem.find('input[value=' + label + ']')[0];
					option && (option.checked = true);
				}
			} else if (type == 3) {
				var blankList = JSON.parse(value);
				for (var i = 0, len = blankList.length; i < len; i++) {
					debugger;
					var input = blankList[i];
					qItem.find('input').eq(i).val(input);
				}
			} else if (type == 5) {
				qItem.find('textarea').val(value);
				setLimitTip(qItem, value);
			} else {

			}
		}
	};



	function onRadioSend() {
		$('li[data-type=1]').find('input[type=radio]').change(function(e) {
			var value = this.value,
				id = $(this).parents("li").attr('id');
			if (value == localAnswerMap[id]) {
				return;
			}
			throttleMap[id] == undefined && (throttleMap[id] = -1);
			//console.log("radio before ", id, value, +new Date());
			clearTimeout(throttleMap[id]);
			throttleMap[id] = setTimeout(function() {
				//console.log("radio send ", id, value, +new Date());
				senderProxy(id, value);
			}, throttleLimit.RADIO);
		});
	};

	function onCheckboxSend() {
		$('li[data-type=2]').find('input[type=checkbox]').change(function(e) {

			var value = [],
				li = $(this).parents("li"),
				id = li.attr('id'),
				inputList = $(this).parents("li").find("input[type=checkbox]:checked");
			inputList.each(function(index, item) {
				value.push(item.value);
			});

			value = value.join('');
			if (value == localAnswerMap[id]) {
				return;
			}
			//console.log("checkbox before ", id, value, +new Date());
			throttleMap[id] == undefined && (throttleMap[id] = -1);
			clearTimeout(throttleMap[id]);
			throttleMap[id] = setTimeout(function() {
				//console.log("checkbox send ", id, value, +new Date());
				senderProxy(id, value);
			}, throttleLimit.CHEKCBOX);
		});
	};

	function onBlankSend() {
		$('li[data-type=3]').find('input[type=text]').change(function(e) {

			var value = [],
				li = $(this).parents("li"),
				id = li.attr('id'),
				inputList = $(this).parents("li").find("input[type=text]");
			inputList.each(function(index, item) {
				value.push($.trim(item.value));
			});

			value = JSON.stringify(value);
			if (value == localAnswerMap[id]) {
				return;
			}

			senderProxy(id, value);

		});
	};

	function onJudgeSend() {
		$('li[data-type=4]').find('input[type=radio]').change(function(e) {
			var value = this.value,
				id = $(this).parents("li").attr('id');
			if (value == localAnswerMap[id]) {
				return;
			}
			//console.log("judge before ", id, value, +new Date());
			throttleMap[id] == undefined && (throttleMap[id] = -1);
			clearTimeout(throttleMap[id]);
			throttleMap[id] = setTimeout(function() {
				//console.log("judge send ", id, value, +new Date());
				senderProxy(id, value);
			}, throttleLimit.JUDGE);
		});
	};

	function onSubjectSend() {
		$('li[data-type=5]').find('textarea').change(function(e) {
			var value = $.trim(this.value),
				li = $(this).parents("li"),

				id = li.attr('id');
			//console.log('subject before ', id, +new Date());
			if (value == localAnswerMap[id]) {
				return;
			}

			senderProxy(id, value);

		});
	};
	/**
	 * statistics the input lenth
	 * @return none
	 */

	function setLimitTip(li, value) {

		li.find('.lengthLimit').text(value.length + '/' + __SUBJECTLIMIT__);
		if (value.length > __SUBJECTLIMIT__) {
			li.find(".lengthWarning").show();
		} else {
			li.find(".lengthWarning").hide();
		}
	};

	function onSubjectInput() {
		$('li[data-type=5]').find('textarea').keyup(function(e) {

			var value = this.value,
				li = $(this).parents("li"),
				id = li.attr('id');
			throttleMap[id] == undefined && (throttleMap[id] = -1);
			//console.log('subject beforestatistics ', id, value, +new Date());
			clearTimeout(this.proId);
			var me = this;

			this.proId = setTimeout(function(e) {
				setLimitTip(li, value);
				//console.log('subject statistics ', id, value, +new Date());
			}, throttleLimit.SUBJUECT);
		});
	};

	function onAnswerCardAction() {
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
				duration: 618,
				queue: false
			})
		});
		$('dd a').click(function(e) {
			var selector = $(this).attr('href');
			var top = $(selector).offset().top;
			$('html,body').animate({
				scrollTop: top - 100
			}, 100);
			e.preventDefault();
			return false;
		});
	};

	function extraEvents() {
		/*here we add answercard go after scrollbar event && back-to-top event  back-to-bottom event*/
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

		(function() {
			var clk = clock.create({
				//count:eUserInfo.seconds,
				count: eUserInfo.seconds,
				onStart: function() {
					$('#time').text(this.format());
					//console.log('start', this.count);
				},
				onTick: function() {
					$('#time').text(this.format());
					//console.log('tick', this.count);
				},
				onStop: function() {
					$('#time').text(this.format());
					alert('已到收卷时间！');
				 
					$('#submitpaper').trigger('click', force = true);
					//console.log('stop', this.count);
				}
			});
			clk.tick();
		})();

	};

	/*it is used for user to submit answer when it is diffrent from localAnswerMap */

	function examAssistant() {
		//var time = Math.random() * 10 / 5 + 5; /*5s-10s*/

		setTimeout(function() {
			var map = serializeAnswer();
			for (var qid in map) {
				/*this mean the student can't submit the empty answer when she or he clear the input anser*/
				var scanValue=map[qid];
				if (scanValue != '' && /^\[("",)*(""])$/.test(scanValue)==false && scanValue != localAnswerMap[qid]) {
					//console.log(qid,'examAssistant');
					senderProxy(qid, map[qid]);
					break; /*break for next time to next diffrent anser*/
				}
			}
			setTimeout(arguments.callee, (Math.random() * 10 / 5 + 5) * 1000);
		}, (Math.random() * 10 / 5 + 5) * 1000);
	};

	function serializeAnswer() {
		var map = {};
		$('#paperContent ol').each(function(index, item) {
			$(item).find('li').each(function(qIndex, qItem) {
				var type = $(qItem).attr('data-type'),
					id = qItem.id,
					value = null;
				if (type == 1 || type == 4) {
					value = $(qItem).find('input[type=radio]:checked').val();
					if (value == undefined) {
						value = '';
					}
				} else if (type == 2) {
					value = [];
					var inputList = $(qItem).find("input[type=checkbox]:checked");
					inputList.each(function(index, item) {
						value.push(item.value);
					});
					value = value.join('');
				} else if (type == 3) {
					value = [];
					inputList = $(qItem).find("input[type=text]");
					inputList.each(function(index, item) {
						value.push(item.value);
					});
					value = JSON.stringify(value);
				} else if (type == 5) {
					value = $(this).find('textarea').val();
					value = $.trim(value);

				}
				map[id] = value;
			});
		});
		return map;
	};

	function setAnswerCardStatus(map) {
		for (var id in map) {
			var value = map[id];
			var objArr = null;
			try {
				objArr = JSON.parse(value);
				if (!isArrayEmpty(objArr)) {
					$('dl a[href=#' + id + ']').addClass('done');
				}
			} catch (e) {
				if (value != '') {
					$('dl a[href=#' + id + ']').addClass('done');
				}
			}
		}

	};

	function bindEvents() {
		onRadioSend();
		onCheckboxSend();
		onBlankSend();
		onJudgeSend();
		onSubjectSend();
		onSubjectInput();
		onAnswerCardAction();
		extraEvents();
		onSubmitPaper();
	};
	var run = function() {
		bindEvents();
		loadAnswerHistroy(eid, sid);

	};
	return {
		run: run
	};
})($);