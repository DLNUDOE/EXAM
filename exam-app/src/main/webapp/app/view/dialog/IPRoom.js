/**
 * a form window used for update  or add a iproom information
 */
Ext.define('Exam.view.dialog.IPRoom', {
    extend: 'Ext.window.Window',
    constrain: true,
    constrainHeader: true,
    width: 600,
    height: 500,
    title: "选择机房",
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    buttonAlign: 'center',
    buttons: [{
        text: '确定',
        handler: function(button, e) {
            debugger;
            var win = button.up('window');
            var record = win.down('grid').getSelectionModel().getSelection();
            if (record.length < 1) {
                Ext.Msg.alert('提示', '点击列表中的一项，选中记录');
                return;
            }
            var targetView = win.targetView,
                nameField = targetView.down('textfield[name=iprooms]'),
                idField = targetView.down('hiddenfield[name=iproomlist]'),
                oldNameList = nameField.getValue().split('；'),
                oldIDList = Ext.JSON.decode(idField.getValue());
            
            if (oldNameList[0] == '') {
                oldNameList.splice(0, 1);
            }
            var temNameList = [],
                tempIdList = [];
            for (var i = 0; i < record.length; i++) {
                var rec = record[i],
                    name = rec.get('name'),
                    id = rec.get('id');
                temNameList.push(name);
                tempIdList.push(id);
            }

            oldNameList = oldNameList.concat(temNameList);
            oldNameList = Ext.Array.unique(oldNameList);
             oldIDList = oldIDList.concat(tempIdList);
            oldIDList = Ext.Array.unique(oldIDList);

            var nameString = oldNameList.join('；'),
           
              idArrayString = Ext.JSON.encode(oldIDList);


            nameField.setValue(nameString);
            idField.setValue(idArrayString);
            win.destroy();
        }
    }],
    initComponent: function() {
        this.items = Ext.create("Exam.view.tab.IPRoom");
        var param={
            key:''
        };
        this.items.getStore().load({
            param: param,
            trigger: true
        });
        this.callParent(arguments);
    }
});