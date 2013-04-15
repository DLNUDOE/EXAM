Ext.define('Exam.store.ExamStudent', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.ExamStudent',
    pageSize:config.page.Exam,
    autoload:true,
    proxy: {
        type: 'ajax',
        api: {

        //read: eDomain.getURL("exam/examing")
        //read: "test/ExamStudent.json"
        read: "exam/stu/list.do"
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:'total'
        }
    }
});
