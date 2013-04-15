Ext.define('Exam.store.Difficulty', {
    extend: 'Ext.data.Store',
    fields:['id','name'],
    proxy: {
        type: 'ajax',
        url:'testdata/Difficulty.json',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
 