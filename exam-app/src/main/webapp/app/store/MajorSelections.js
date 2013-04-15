Ext.define('Exam.store.MajorSelections', {
    extend: 'Ext.data.Store',
    fields:['cid','name'],
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url:eDomain.getURL("major/list"),
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
 