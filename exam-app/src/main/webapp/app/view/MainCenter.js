Ext.define("Exam.view.MainCenter", {
    extend: 'Ext.tab.Panel',
    alias: "widget.maincenter",
    xtype:'maincenter',
    region: "center",
    
    defaults: {
        closable: true,
        closeAction: 'destroy'
    },
    initComponent: function() {
        Ext.apply(this, {
            items: [{
               /* title: '起始页',
                xtype: 'panel',
                frame:true,
                loader: {
                        url: 'http://www.baidu.com',
                        autoLoad: true
                }*/
                closable: false,
                title: '百度',
                html: "<iframe frameborder='0' width='100%' height='100%' src='http://www.baidu.com'></iframe>"
            } ]
        });
        this.callParent(arguments);
    }
});