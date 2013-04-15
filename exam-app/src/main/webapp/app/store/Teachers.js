Ext.define('Exam.store.Teachers', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.Teacher',
    pageSize:config.page.TEACHER,
    proxy: {
        type: 'ajax',
        api: {
            read: eDomain.getURL("teacher/list") 
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:'total'
        }
    }
});