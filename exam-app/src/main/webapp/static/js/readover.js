var readoverApp = (function() {
	var studentList = [];
	var currentIndex = 0;
 	var __SUBJECTLIMIT__ = 2048;
	function loadStudentAnswer(eid, sid) {
		$.ajax({
			url: "judge/answers.do",
			//url: "test/examstudentanswer.json",
			type: 'get',
			data: {
				examid: eid,
				studentid: sid
			},
			dataType: 'json',
			success: function(rs, successfull) {
				debugger;
				var aswMap = rs.data;
				renderStuAnswer(aswMap);

			},
			error: function(rs, error) {
				//alert(error)
			}
		});
	};
	function setLimitTip(li, value) {

		li.find('.lengthLimit').text(value.length + '/' + __SUBJECTLIMIT__);
		if (value.length > __SUBJECTLIMIT__) {
			li.find(".lengthWarning").show();
		} else {
			li.find(".lengthWarning").hide();
		}
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

	function onPrev() {
		$('.list-prev').click(function(e) {
			alert(2);
			var sid = "324234";
			var examid = 22;
			loadStudentAnswer(sid, examid);
		});
	};

	function onNext() {
		$('.list-next').click(function(e) {
			alert(1);
			var sid = "324234";
			var examid = 22;
			loadStudentAnswer(sid, examid);
		});
	};



	function onSubmitMark() {
		debugger;
		$('.score-item').live('click', function(e) {
			 
			var score = $(this).text();
			var qid = $(this).parents('li').attr('id');
			submitScore(eid, sid, qid, score);
			e.preventDefault();
			return false;
		});
	}

	function syncSubjectScore() {
		$.ajax({
			//url:eDomain.getURL('teacher/login/login'),
			url: "teacher/login.do",
			type: 'post',
			dataType: 'json',
			data: {
				user: userid,
				password: password
			},
			success: function(res, successful) {

				if (!res.success) {
					alert(res.msg);
					return;
				} else {
					if (!res.data.pass) {
						alert(res.data.msg);
					} else {
						location.href = './';
					}
				}
			},
			error: function(options, errorMsg) {
				throw new Error('login error:' + errorMsg + '.');
			}
		});

		for (var id in map) {
			var qItem = $('#' + id);
			$(item).find('span.score').text(map[id]);
		}
	};

	function createMarker() {
		$('ol li').each(function(index, item) {
			var score = $(item).find('.score').text().replace(/[^\d]/g, '');
			score = parseInt(score);
			$('<div class="mark"><span >得分:</span><span class="score">0</span>' +
				'<div class="score-wrapper">' + (function(s) {
				var str = "";
				for (var i = 0; i <= s; i++) {
					str += '<a   class="score-item">' + i + '</a>';
				}

				return str;
			})(score) +
				'</div>' +
				'</div>').appendTo(item);
		});
	};

	function submitScore(eid, sid, qid, score) {
		$.ajax({
			url: "sync/asw.do",
			//url: "test/examstudentanswer.json",
			type: 'get',
			data: {
				examid: eid,
				studentid: sid,
				questionid: qid,
				score: score
			},
			dataType: 'json',
			success: function(rs, successfull) {


			},
			error: function(rs, error) {
				//alert(error)
			}
		});
	};
	function getExamID(){
      var url = window.location.href;
      var id,examID;
      var index = url.indexOf('examid');

      if (index==-1) {
        alert('地址错误');
        return ;
        
      }else{
       
         id=url.split("examid="); 
         examID = parseInt(id[1]);

      }
      return examID;
    };
	function onGetStudentList() {
		$('.field-item .submit').click(function(e) {
			var data = {};
			debugger;
			$('.field-item select').each(function(index, item) {
				data[$(item).attr('data-dep')] = $(item).val();
			});
			/*data.key = $('#key').val();*/
			data.examid=getExamID();
			$.ajax({
				url: "judge/students.do",
				//url: "test/examstudentanswer.json",
				type: 'get',
				data: data,
				dataType: 'json',
				success: function(rs, successfull) {
					debugger;
					if (!rs.success) {
						alert('获取数据失败');
						return;
					}
					
					studentList = rs.data;
					if (studentList.length == 0) {
						return;
					}
					debugger;
					$('.list-info').text(currentIndex + 1 + '/' + studentList.length);

					loadStudentAnswer(data.examid,studentList[2]);
				},
				error: function(rs, error) {

					alert(error)
				}
			});
		});;
	};

	function bindEvents() {
		onNext();
		onPrev();
		onSubmitMark();
		onGetStudentList();
	};
	return {
				run: function() {
			bindEvents();
			createMarker();

		}		
	};
})();