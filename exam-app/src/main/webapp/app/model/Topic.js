Ext.define('Exam.model.Topic', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'int'
	}, {
		name: 'courseid',
		type: 'int'
	}, {
		name: 'type',
		type:'int'
	}, {
		name: 'kp' 
	}, {
		name: 'stem' 
	}, {
		name: 'answer',
		type:'string'
	}]
});