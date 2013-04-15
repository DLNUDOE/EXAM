Ext.define('Exam.store.PaperROList', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.ReadOverlist',
    pageSize:config.page.PAPER,
    autoload:true,
    proxy: {
        type: 'ajax',
        api: {
            //read: eDomain.getURL("paperrolist/list")
            read: "teacher/readover.do" 
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:'total'
        }
    }
});