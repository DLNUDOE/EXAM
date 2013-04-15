Ext.define('Exam.store.ExamList', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.ExamList',
    pageSize: config.page.EXAM, 
    proxy: {
        type: 'ajax',
        api: {
              read: eDomain.getURL("exam/list")
            // read: "test/Examination.json" 
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success' ,             
            totalProperty:'total'
        }
    }
});