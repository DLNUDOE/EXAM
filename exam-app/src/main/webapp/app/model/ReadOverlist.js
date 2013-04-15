Ext.define('Exam.model.ReadOverlist', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	},{
		name:'papername',
		type:'string'
	},{
		name:'starttime',
		type:'string'
	},{
		name:'creator',
		type:'string'
	} ,{
		name:'coursename',
		type:'string'
	}]
});