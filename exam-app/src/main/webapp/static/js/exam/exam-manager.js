var eManager = (function(clock) {
	  var clk  = clock.create({
		count: 24 * 3600,
		onStart: function() {
			 
		},
		onTick: function() {
			//$('.userInfo').text(this.format());
			//console.log(this.name,+new Date());
			$('#dlg').find('#time span').text(this.format());
		},
		onStop: function() {
			if($('#auto-enter')[0].checked){
				this.eid&&(location.href="./BeHappy.html?examid="+this.eid);
			}
		}
	});
	  
	function showDialog(options) {
		$('#mask').css({
			height: $(document).height()
		}).show();
		var posLeft = ($('body').width() - $('#dlg').width()) / 2,
			posTop = 180;
		var dlg = $('#dlg');
		dlg.find('#desc span').text(options.name);
		dlg.find('#duration span').text(options.duration);
		dlg.css({
			left: posLeft,
			top: posTop
		}).slideDown(100);
	};

	function hideDialog() {
		$('#mask').hide();
		$('#dlg').slideUp(100);
	};



	function bindEvents() {
		$('.go-exam').click(function(e) {
			var me=this;
			var eID = $(this).attr('data-examid'),
				trEle = $(this).parents("tr"),
				eName = trEle.find('td').eq(0).text(),
				startTime = $.trim(trEle.find('td').eq(1).text()),
				duration=trEle.find('td').eq(2).attr('data-duration');
				startTimeArr = startTime.split(':');
			endTime = new Date();
			endTime.setHours(startTimeArr[0]);
			endTime.setMinutes(startTimeArr[1]);
			endTime.setSeconds(startTimeArr[2]);
			endTime=new Date(endTime.getTime()+parseInt(duration*60*1000));
			var hour= endTime.getHours(),
			min = endTime.getMinutes(),
			   sec =endTime.getSeconds();
			var endTimeStr= (hour < 10 ? '0' + hour :  hour) + ':' + ( min < 10 ? '0' +  min :  min) + ':' + ( sec < 10 ? '0' + sec : sec)
		 
			var opts={name:eName,duration:startTime+"至"+endTimeStr};
			if(clk.eid==eID){
				showDialog(opts);
				return;
			}
			$.ajax({
				url: "prexam.do",
				//url: "test/prexam.json?"+(+new Date()),
				type: 'get',
				data: {
					examid: eID,
					sid: eUserInfo.id || ''
				},
				dataType: 'json',
				success: function(rs, successfull) {
						 
					if (!rs.success) {
						alert(rs.msg);
						return;
					}
					if(rs.data<=0){
						$(me).val('正在进入......');
						setTimeout(function(){
							location.href='./BeHappy.html?examid='+eID;
						},Math.random()*1600);
						return;
					}
					// clk=clock.create(clkOpts);
					var proid=clk.stop();
					clearTimeout(proid);
				  	clk.setConfig({count:rs.data,eid:eID});
					clk.reset(); 
					clk.tick();
					showDialog(opts);
				 
					
				},
				error: function(rs, error,k) {
					 
					alert('服务器连接失败', error);
				}
			});

		});

		$('#close,#cancel').click(function(e) {
			hideDialog();	
			e.preventDefault();
			return false;		
		});
		
		$("#ok").click(function(e){
			
			nowTime = new Date();
			startTime = nowTime.toISOString();
			startTime = startTime.substring(0,10);
			startTime = startTime + " " + $('.go-exam').parents('tr').find('td').eq(1).text();
			
			if(Date.parse(new Date()) <= Date.parse(startTime)){
				alert("考试时间还没到，请耐心等待");
			}else{
				clk.eid&&(location.href="./BeHappy.html?examid="+clk.eid);
			}
		});
		
		window.onresize=function(e){

			var posLeft = ($('body').width() - $('#dlg').width()) / 2;
			 

			 			
				$('#dlg').animate({left:posLeft},{duration:400,queue:false});
				$('#mask').css({
					height: $(document).height()
				});
			 
        
		};
	};
	return {
		run: function() {
			bindEvents();
		}
	};
})(clock);