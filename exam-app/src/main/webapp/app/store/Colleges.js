Ext.define('Exam.store.Colleges', {
    extend: 'Ext.data.TreeStore',
    model: 'Exam.model.College' ,
    defaultRootProperty:'data',
    autoLoad:true,
    proxy: {
        type: 'ajax',                  
        url:eDomain.getURL("college/list"),
        reader: {
            type: 'json',
            root: 'data' 
        }
    }
});
 