(function($) {
	var INTERVAL = 1000 * 2;
	var SIMPLECAPACITY = 6;
	statusStack = [0, 0, 0, 0];

	function oneNumber(n) {
		n = (n & 0x55555555) + ((n >> 1) & 0x55555555);
		n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
		n = (n & 0x0f0f0f0f) + ((n >> 4) & 0x0f0f0f0f);
		n = (n & 0x00ff00ff) + ((n >> 8) & 0x00ff00ff);
		n = (n & 0x0000ffff) + ((n >> 16) & 0x0000ffff);

		return n;
	}
	(function heat2Heart(info, time) {
		console.log(info, time);
		statusStack.splice(SIMPLECAPACITY);
		var sts = parseInt(statusStack.join(''), 2);
		console.log(oneNumber(sts));
		setTimeout(function() {
			$.ajax({
				url: "../test/true.json?_dc="+(+new Date()) ,
				type: 'get',
				data: {
					sid: 11,
					eid: 22
				},
				timeout: 30000,
				dataType: 'json',
				success: function(rs, successfull) {
					if (!rs.success) {

						heat2Heart(0, +new Date());
						statusStack.unshift(0);
					} else {
						heat2Heart(1, +new Date());
						statusStack.unshift(1);
					}
				},
				error: function(rs, error) {
					heat2Heart("fail", +new Date());
					statusStack.unshift(0);
				}
			});
		}, INTERVAL);
	})();
})($);