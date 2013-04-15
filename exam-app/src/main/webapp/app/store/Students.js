Ext.define('Exam.store.Students', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.Student',
    autoLoad:false,
    pageSize:config.page.STUDENT,  
    proxy: {
        type: 'ajax',
        api: {
            read: eDomain.getURL("student/list"),
            update: 'update/student',
            create  : 'add/student',
            destroy : 'delete/student'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});