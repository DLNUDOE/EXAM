Ext.define('Exam.model.ExamStudent', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'stuid',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	},{
		name: 'collegename',
		type: 'string' 
	},{
		name: 'major',
		type: 'string'
	},{
		name: 'clazz',
		type: 'string'
	},{
		name:'status',
		type:'string'
	}]
});