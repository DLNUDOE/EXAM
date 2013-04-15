Ext.define('Exam.model.Teacher', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'college' 
	} , {
		name: 'email',
		type: 'string'
	}, {
		name: 'role',
		type: 'int'
	}, {
		name: 'tel',
		type: 'string'
	},"courses"]
});