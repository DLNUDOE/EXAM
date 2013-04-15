Ext.define('Exam.model.PaperList', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	},{
		name:'c_time',
		type:'string'
	},{
		name:'creator',
		type:'string'
	} ,{
		name:'cid',
		type:'string'
	},{
		name:'cname',
		type:'string'
	}]
});