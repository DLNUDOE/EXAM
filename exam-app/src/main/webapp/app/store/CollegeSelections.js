Ext.define('Exam.store.CollegeSelections', {
    extend: 'Ext.data.Store',
    fields:['cid','name'],
    proxy: {
        type: 'ajax',
        url:eDomain.getURL("college/list"),
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    } 
});
 