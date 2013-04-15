Ext.define('Exam.store.IPRooms', {
    extend: 'Ext.data.Store',
    model: 'Exam.model.IPRoom',
    pageSize:config.page.IPROOM,
    proxy: {
        type: 'ajax',
        api: {
            read: eDomain.getURL("iproom/list"),
            update: 'update/iproom',
            create  : 'add/iproom',
            destroy : 'delete/iproom'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:'data'
        }
    }
});