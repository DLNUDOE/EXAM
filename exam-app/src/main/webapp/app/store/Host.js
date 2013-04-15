Ext.define('Exam.store.Host', {
    extend: 'Ext.data.Store',
    fields:["id","name","role"],
    proxy: {
        type: 'ajax',
        api: {
            read: 'test/userinfo.json' 
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success' 
        }
    }
});