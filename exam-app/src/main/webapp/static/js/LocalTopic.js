var localTopic = (function() {
	/**
	 * [addItem this is for use to add an item to the localStorage]
	 * localStorage.setItem(record.id, JSON.stringify(record));
		 var courseid=record.courseid;
		 var courseTopicMapString=localStorage.getItem('courseid_'+courseid);
		 courseTopicMap=JSON.parse(courseTopicMapString);
		 courseTopicMap[record.id]=record;
		 var objString=localStorage.getItem("courseid_"+cid);
    	var hashTopicMap=JSON.parse(objString);
    	return hashTopicMap;
		 localStorage.setItem("courseid_"+courseid,courseTopicMap);
		 "courseid_22":{
		 	23:{id:23,stem:"dsfdf"},
		 	24:{id:24}
		 }

		 var rs={
		 	radio:[{},{}],
		 	checkbox:[{},{},{}]
		 };
	 * return @type boolean
	 */
	function addItem(record) {
	 
		for (var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			if (key == record.id) {
				 
				return false;
			}
		}
		 localStorage.setItem(record.id, JSON.stringify(record));
		return true;
	};

	function removeItem(id) {
		var record = null;
		for (var i = 0; i < localStorage.length; i++) {
			var key=localStorage.key(i);
			if (key == id) {
				record = key;
			}
		}
		localStorage.removeItem(record);
	};

	function isExisted(id) {
		for (var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			if(key!='courseid'){
			if (key == id) {
				return true;
			}
		}
		}
		return false;
	};

	function serialize() {
     var paper={
	    "data": {
		"id": 1,
		"title": "数据结构考试",
		"c_time": "2013-4-1",
		"creator": "王玲芬",
		"cid": 1,
		"cname": "数据结构",
		"courseid": "gyfnice",
		"aoption":["A","B","C","D","E","F","G","H","I","J"],
		 "groups" : [{
			"title": "单选题",
			"desc": "以下选项中任选一个",
			"questions": [/*{
				"id": 0,
				"type": 1,
				"stem": {
					"title": "342342343地方撒发生",
					"option": ["fdfasdfasdf等等a发大水法", "fdfasdfasdfa发大水法", "fdfasdfasdfa发大水法", "fdfasdfasdfa发大水法"]
				},
				"kp": "",
				"answer": "B",
				"courseid": 1
			}*/],
			"scoreMap": {
				/*"1": 3*/
			}
		}, {
			"title": "多选题",
			"desc": "以下选项中可选多个",
			"questions": [/*{
				"id": 14,
				"type": 2,
				"stem": {
					"title": " ",
					"option": [" ", " ", " ", " ", " "]
				},
				"kp": "",
				"answer": "C",
				"courseid": 1
			}*/],
			"scoreMap": {
				/*"14": 12*/
			}
		}, {
			"title": "填空题",
			"desc": "填空题分数以空为单位",
			"questions": [/*{
				"id": 34,
				"type": 3,
				"stem": {
					"title": ""
				},
				"kp": "",
				"answer": ["fdsafsd打发似的", "fdsafsd打发似的", "fdsafsd打发似的"],
				"courseid": 1
			}*/],
			"scoreMap": {
				"34": 12
			}
		}, {
			"title": "判断题",
			"desc": "无",
			"questions": [/*{
				"id": 3333,
				"type": 4,
				"stem": {
					"title": " "
				},
				"kp": "",
				"answer": "1",
				"courseid": 1
			}*/],
			"scoreMap": {
				/*"3333": 12*/
			}
		}, {
			"title": "主观题",
			"desc": "主观题作答",
			"questions": [/*{
				"id": 3333,
				"type": 5,
				"stem": {
					"title": "地方哈怂i地方哈桑迪of哈奋斗哈死哦地方哈死哦短发"
				},
				"kp": "",
				"answer": "答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案",
				"courseid": 1
			}*/],
			"scoreMap": {
				/*"3333": 12*/
			}
		}, {
			"title": "混合题",
			"desc": "混合题",
			"questions": [/*{
				"id": 2223,
				"type": 1,
				"stem": {
					"title": "地方哈怂i地方哈桑迪of哈奋斗哈死哦地方哈死哦短发",
					"option": ["fdfasdfasdfa发大水法", "fdfasdfasdfa发大水法", "fdfasdfasdfa发大水法", "fdfasdfasdfa发大水法", "fdfasdfasdfa发大水法"]
				},
				"kp": "",
				"answer": "答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案答案",
				"courseid": 1
			}*/],
			"scoreMap": {
				/*"3333": 2223*/
			}
		}]
	}
	};
	  var scoreMap=[3,6,4,2,15];
		for(var i=0;i<localStorage.length;i++){
			var key=localStorage.key(i);
			var cov=JSON.parse(localStorage.getItem(key));
			var type=parseInt(cov.type);
			if(type>=1 && type<=6){
				var index=type-1;
				paper.data.groups[index].questions.push(cov);
				paper.data.groups[index].scoreMap[cov.id]=scoreMap[index];
			}
		}
    	return paper;
	};

	function destroy() {

	}
	return {
		addItem: addItem,
		removeItem: removeItem,
		isExisted: isExisted,
		serialize: serialize,
		destroy: destroy
	};
})();