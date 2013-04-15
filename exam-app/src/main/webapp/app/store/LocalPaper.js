Ext.define('Exam.store.LocalPaper', {
	//model: 'Exam.model.LocalPaper',
	extend: 'Ext.data.Store',
	autoLoad: true,
	fields: ['id', 'topic', 'type'],

	proxy: {
		type: 'localstorage',
		id: 'exam-local-paper'
	},
	addRecord: function(topic, type) {
		/**
		 * check if the topic is in the localStorage
		 */
		var id = typeof topic === "object" ? topic.id : topic;
		if (this.isExisted(id) == false) {

			this.add({
				type: type,
				topic: topic
			});
			this.sync();
			return true;
		}
		return false;
	},
	isExisted: function(id) {

		var flag = false;
		this.load();
		this.each(function(rec) {

			if (rec.data.topic.id == id) {
				flag = true;
				return false;
			}
		});
		return flag;
	},
	removeRecord: function(id) {
		/**
		 * by topic.id  not ext localstorage id
		 */
		var record = null;
		this.load();

		this.each(function(rec, idx) {
			if (rec.data.topic.id == id) {

				record = rec;
				return false;
			}
		});
		this.remove(record);
		this.sync();
		this.save();
		return !!record;
	},
	getTypeTotal: function(type) {

	},
	serializeByType: function() {
		debugger;
		var groups = [{
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
		}];
		debugger;
		this.load();
		var scoreMap=[3,6,4,2,15];
		this.each(function(item, index) {

			var type=parseInt(item.get('type'));
			if(type>=1 && type<=6){
				var index=type-1;
				groups[index].questions.push(item.get("topic"));
				groups[index].scoreMap[item.get("topic").id]=scoreMap[index];
			}
		});
		 
		return groups;
	},
	serialize: function() {

	}
});