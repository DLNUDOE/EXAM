Ext.define('Exam.model.Student', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'password',
		type: 'string'
	}, {
		name: 'college' 
	},{
		name: 'collegeid',
		type: 'int'
	},{
		name: 'major' 
	},{
		name: 'majorid',
		type: 'int'
	},{
		name: 'class' 
	},{
		name: 'classid',
		type: 'int'
	},{
		name:"password",
		type:"string"
	},{
		name:"email",
		type:"string"
	}]
});