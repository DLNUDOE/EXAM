Ext.define('Exam.store.GradeSelections', {
    extend: 'Ext.data.Store',
    fields:['cid','name'],
    autoLoad:true,
    proxy: {
        type: 'ajax',
        url:'testdata/GradeSelections.json',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});