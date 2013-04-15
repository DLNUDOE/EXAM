Ext.define('Exam.model.Navigation', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'text', type: 'string' },
        { name: 'clsPath', type: 'string' },
        { name: 'xtype', type: 'string' },
        { name: 'adm' }
    ]
});