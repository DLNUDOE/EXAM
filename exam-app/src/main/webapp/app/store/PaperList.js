Ext.define('Exam.store.PaperList', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.PaperList',
    pageSize:config.page.PAPER,
    autoload:true,
    proxy: {
        type: 'ajax',
        api: {
            read: eDomain.getURL("paper/list")
            //read: "test/paperlist.json" 
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:'data'
        }
    }
});