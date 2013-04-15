Ext.define('Exam.model.Monitor', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: "int"
	}, {
		name: 'starttime',
		type: 'string'
	} , {
		name: 'duration',
		type: "int"
	}, {
		name: 'creator',
		type: 'string'
	},{
        name: 'name',
        type: 'string'
	},{
		name: 'createTime',
		type: 'string'
	},{
		name: 'status',
		type: 'string'
	},{
		name: 'papername',
		type: 'string'
	}
	]
});