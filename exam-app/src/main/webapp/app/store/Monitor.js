Ext.define('Exam.store.Monitor', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.Monitor',
    pageSize:config.page.Exam,
    autoload:true,
    proxy: {
        type: 'ajax',
        api: {

        read: eDomain.getURL("exam/examing")

        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:'total'
        }
    }
});
