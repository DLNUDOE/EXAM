Ext.define("Exam.view.tab.TopicAdder", {
    extend: "Ext.panel.Panel",
    xtype: "tabtopic",
    title:"新建题目",
    store: 'TopicBank',
    layout: 'fit',  
   
    initComponent: function() {
        var me = this;
        var time=+new Date();
        var _dc="&_dc="+time;
        if(typeof eUserInfo=="undefined"){
           // Ext.Msg.alert('提示',"会话过期，请重新登录");
           location.href='./admin.html';
        }
        me.html= "<iframe frameborder='0' width='100%' height='100%' src='demo/question.html?uid="+eUserInfo.id+_dc+"'></iframe>",         
        this.callParent(arguments);
    } 
});