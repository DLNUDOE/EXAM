Ext.define('Exam.store.TopicBank', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.Topic',
   // fields:["id","stem","courseid","type","answer"],
    pageSize:config.page.TOPIC,
    proxy: {
        type: 'ajax',
        api: {
            read: eDomain.getURL("question/list") 
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        }
    }
});