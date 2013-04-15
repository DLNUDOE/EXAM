Ext.define("Exam.view.tab.TestIframe", {
    extend: "Ext.panel.Panel",
    xtype: "tabtestiframe",
    title:"个人信息",     
    layout: 'fit',     
    initComponent: function() {
        var me = this;
        var time=+new Date();
        var _dc="&_dc="+time;
        me.html= "<iframe frameborder='0' width='100%' height='100%'  src='demo/college.html?uid="+eUserInfo.id+_dc+"'></iframe>",         
        this.callParent(arguments);
    } 
});