Ext.define('Exam.model.IPRoom', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string'
	}, {
		name: 'iprange',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	},{
		name:'capacity',
		type:"int"
	} ]
});