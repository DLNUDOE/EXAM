Ext.define('Exam.model.Course', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'kpoint'
	}, {
		name: 'college' 
	}, {
		name: 'subcollege',
		type:'string'
	}, {
		name: 'active',
		type:'int'
	}]
});