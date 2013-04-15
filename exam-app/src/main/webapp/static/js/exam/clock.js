 var clock = (function( $) {

	function Clock(options) {
		this.init(options);
	};
	Clock.fn = Clock.prototype;
	Clock.fn.init = function(options) {

		$.extend(this, options);

	};
	Clock.fn.suspend=function(){
		this.isSuspend=true;
	};
	Clock.fn.stop=function(){
		this.isStop=true;
		return this.proID;
	};
	Clock.fn.reset=function(){
		this.isStop=false;
	};
	Clock.fn.keep=function(){
		this.isStop=false;
	};
	Clock.fn.format=  function(seconds) {
		 
		var count=seconds||this.count;
		var hour = parseInt( count / 60 / 60);
		var min = parseInt(( count - 3600 * hour) / 60);
		var sec = parseInt( count - hour * 3600 -  min * 60);
		var format = (hour < 10 ? '0' + hour :  hour) + ':' + ( min < 10 ? '0' +  min :  min) + ':' + ( sec < 10 ? '0' + sec : sec)
		return format;
	},
	Clock.fn.setConfig=function(config){
		$.extend(this,config);
	};
	Clock.fn.tick = function() {
		var me = this;
		me.stack=[];
		me.onStart();
		(function() {
			me.proID=setTimeout(function() {
				!me.isSuspend&&me.count--;
				me.isStop&&(me.count=0)&&clearTimeout(me.proID);
				me.onTick();
				if (me.count > 0&&!me.isStop) {
					me.proID=setTimeout(arguments.callee, 1000);
					//me.stack.push(me.proID);
				} else {
					clearTimeout(me.proID);
					me.onStop();
				}
			}, 1000);
			//me.stack.push(me.proID);
		})()
	};
	return {
		create: function(options) {
			var opts = $.extend({
				count: 1,
				onStop: function() {},
				onStart: function() {},
				onTick: function() {}
			}, options);
			return new Clock(opts);
		}
	};
})($ );

 