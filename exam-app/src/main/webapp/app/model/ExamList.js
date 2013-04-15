Ext.define('Exam.model.ExamList', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'int'
	}, {
       	name:  'name',
       	type:  'string'
	}, {
		name: 'courseid',
		type: 'int'
	} , {
		name: 'paperid',
		type: 'int'
	}, {
		name: 'starttime',
		type: 'string'
	} , {
		name: 'iproom',
		type: 'string'
	}, {
		name: 'creator',
		type: 'string'
	}, {
		name: 'duration',
		type: 'int'
	},{
		name:"status",
		type:"int"
	} ]
});
 