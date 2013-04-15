/**
 * a form window used for update  or add a iproom information
 */
Ext.define('Exam.view.dialog.PaperList', {
    extend: 'Ext.window.Window',
    constrain: true,
    constrainHeader: true,
    width: 600,
    height: 500,
    title: "选试卷",
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    buttonAlign: 'center',
    buttons: [{
        text: '确定',
        handler: function(button, e) {
            var win=button.up('window');
            var recrod=win.down('grid').getSelectionModel().getSelection();
            if(recrod.length<1){
                Ext.Msg.alert('提示','点击列表中的一项，选中记录');
                return;
            }
            var rec=recrod[0],
             papername=rec.get('name'),
             paperid=rec.get('id'),
             targetView=win.targetView;
            var pnameField =targetView.down('textfield[name=papername]');
            var pidField= targetView.down('hiddenfield[name=paperid]');
            pnameField.setValue(papername);
            pidField.setValue(paperid);
            win.destroy();
        }
    }],
    initComponent: function() {
        debugger;
        this.items = Ext.create("Exam.view.tab.PaperList");
        var param={
            cid: -1,
            key:'',
            page: 1,
            limit: 10000
        };
        this.items.getStore().load({
            param: param,
            trigger: true
        });
        this.callParent(arguments);
    }
});