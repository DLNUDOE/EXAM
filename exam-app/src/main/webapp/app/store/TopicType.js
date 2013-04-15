Ext.define('Exam.store.TopicType', {
    extend: 'Ext.data.Store',
    /*model: 'Exam.model.Topic',*/
    fields:["id","desc","options","answer","rating"],
    proxy: {
        type: 'ajax',
        api: {
            read: 'testdata/TopicType.json',
            update: 'data/updateUsers.json'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        }
    }
});