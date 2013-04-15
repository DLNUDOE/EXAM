Ext.define('Exam.store.Courses', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.Course',
    pageSize:config.page.COURSE,
    proxy: {
        type: 'ajax',
        api: {
            read: eDomain.getURL("course/list"),
            update: 'update/course',
            create  : 'add/course',
            destroy : 'delete/course'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:'data'
        }
    }
});