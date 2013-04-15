var mainApp = (function() {
  var init = function() {
    $('#mainselect').change(function(e) { //学院

        $('#midselect').find('.item-option').remove();
        $('#backselect').find('.item-option').remove();

      if ($(this).val() != -1) {

        var collegeid = $(this).find('option:selected').val();
        majorReload(collegeid);
      } else {

        $('#midselect').find('.item-option').remove();
        $('#backselect').find('.item-option').remove();
      }

    });


    $('#midselect').change(function() { //专业

       $('#backselect').find('.item-option').remove();
       
      var me = this;
      if ($(this).val() != -1) {
        var majorid = $(this).find('option:selected').val();
        classReLoad(majorid);
      } else {
        $('#backselect').find('.item-option').remove();
      }
    });

    //获取URL
    var getExamID = function(){
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

      //单击确定提交表单
/*     $('.submit').click(function(examid,collegeid,majorid,classid,status){

      // if ($('mainselect').val() ==-1){
      //   alert('请填写学院');
      // }else if ($('midselect').val()== -1) {
      //    alert('请填写专业');
      // }else{
      //   alert('请填写班级');
      // }

      var examID = getExamID();
      var collegeid = $('#mainselect').find('option:selected').val();
      var majorid = $('midselect').find('option:selected').val();
      var classid = $('backselect').find('option:selected').val();
      var status = $('status').find('option:selected').val();


      $.ajax({//请求学生列表

      url: '../judge/students.do',
      //url: "../test/collegelist.json",
      type: 'get',
      dataType: 'json', 
      data: {
        examid:examID,
        collegeid:collegeid,
        majorid:majorid,
        classid:classid,
        status:status

      },
      success: function(res, successful) {

        if (!res.success) {
          alert(res.msg);
          return;
        } else {
          var studentsList = res.data;//取得学生列表
          listlength = res.data.length;
          for (var i = 0; i < listlength-1; i++) {
              $.ajax({//取得每个学生的ID，向后台请求相应学生答案

                   var studentID = studentsList[i];      
                  url: '../judge/answers.do',
                  //url: "../test/collegelist.json",
                  type: 'get',
                  dataType: 'json', 
                  data: {
                    examid:examID,
                    studentid:studentID

                  },
                  success: function(res, successful) {

                    if (!res.success) {
                      alert(res.msg);
                      return;
                    } else {
                      var answerlength = res.data.length;//该学生答案数
                      for (var i = 0; i < answerlength-1; i++) {
                       var answersID = res.data.qid;//问题的编号
                       var answerContent = res.data.answers;//对应编号的答案

                       

                      }
                      


                      
                    }
                  },
                  error: function(options, errorMsg) {
                    throw new Error('login error:' + errorMsg + '.');
                  }
                


                        });
          }
          
        }
      },
      error:function(options, errorMsg) {
        throw new Error('login error:' + errorMsg + '.');
      }
      });



     });*/

    $.ajax({
      url: '../college/list.do',
      //url: "../test/collegelist.json",
      type: 'get',
      dataType: 'json', 
      data: {},
      success: function(res, successful) {

        if (!res.success) {
          alert(res.msg);
          return;
        } else {
          for (i = 0; i < res.data.length; i++) {
            var a = $('<option class="item-option"  value="' + res.data[i].cid + '">' + res.data[i].name + '</option>');
            $('#mainselect').append(a);
          }
        }
      },
      error: function(options, errorMsg) {
        throw new Error('login error:' + errorMsg + '.');
      }
    });
  };


  var majorReload = function(cid) { //专业ID
    $.ajax({
      url: "../major/list.do",
      type: 'get',
      dataType: 'json',
      data: {
        collegeid: cid
      },
      success: function(res, successful) {
        if (!res.success) {
          alert(res.msg);
          return;
        } else {
          $('#midselect').find('.item-option').remove(); //将原来的选项移除
          for (i = 0; i < res.data.length; i++) {
            var a = $('<option class="item-option"  value="' + res.data[i].cid + '">' + res.data[i].name + '</option>');
            $('#midselect').append(a);
          }
        }
      },
      error: function(options, errorMsg) {
        debugger;
        throw new Error('login error:' + errorMsg + '.');
      }

    });
  };
  var classReLoad = function(mid) {

    $.ajax({
      url: "../class/list.do",
      type: 'get',
      dataType: 'json',
      data: {
        majorid: mid
      },
      success: function(res, successful) {
        debugger;
        if (!res.success) {
          alert(res.msg);
          return;
        } else {
          for (i = 0; i < res.data.length; i++) {
            var a = $('<option class="item-option"  value="' + res.data[i].cid + '">' + res.data[i].name + '</option>');
            $('#backselect').append(a);
          }
        }
      },
      error: function(options, errorMsg) {
        debugger;
        throw new Error('login error:' + errorMsg + '.');
      }

    });
  };

  

  // $('.list-next').click(function(){
  //     alert("pppp");
  // });


  var excuteApp = function() {
    init();
  };
  return {
    excuteApp: excuteApp
  };
})();
mainApp.excuteApp();