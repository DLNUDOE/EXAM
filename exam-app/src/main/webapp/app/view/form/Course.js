/**
 * a form window used for update  or add a course information
 */
Ext.define('Exam.view.form.Course', {
    extend: 'Ext.window.Window',
    extend: 'Ext.window.Window',
    contrain: true,
    contrainHeader: true,
    width: 540,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        var me = this,
            url = 'course/add',
             defaultField = {
                            cid: -1,
                            name: '┈┈请选择┈┈'
                        },
            targetView = me.targetView,
            defaultKV = [-1, '┈┈请选择┈┈'],
            collegeList = me.collegeList,
            collegeStore = Exam.lib.Util.toJsonValueArray(collegeList, ['cid', 'name']);
        collegeStore.unshift(defaultKV);

        var cbGroup = [];
        for (var i = 0; i < collegeList.length; i++) {
            var item = collegeList[i];
            cbGroup.push({
                boxLabel: item.name,
                name: 'collegeids' + item.cid,
                inputValue: item.cid
            });
        }

        //kpoint=Ext.create('Exam.view.common.Tag',{flex:1}),
        var filedConf = [{
            fieldLabel: '课程名称',
            name: 'name'
        }, {
            xtype: 'combobox',
            fieldLabel: '学院',
            name: 'collegeid',
            editable: false,
            store: collegeStore,
            value: -1,
            validator: function(value) {
                var flag = this.getRawValue() == defaultField.name;
                return !flag;
            }
        }, {
            xtype: 'checkboxgroup',
            fieldLabel: '选修学院',
            items: cbGroup,
            xtype: 'checkboxgroup',
            columns: 3,
            allowBlank: true,
            vertical: true
        }];
        this.items = [];
        var form = {
            xtype: 'form',
            height: 'auto',
            layout: 'anchor',
            bodyPadding: 12,
            defaults: {
                labelAlign: 'right',
                labelWidth: 60,
                anchor: '90%',
                readOnly: false,
                allowBlank: false,
                readOnly: false
            },
            defaultType: "textfield",
            items: filedConf,
            buttonAlign: 'center',
            buttons: [{
                text: '确定',
                //formBind: true,
                //only enabled once the form is valid
                //disabled: false,
                handler: function(button, e) {
                    var form = button.up('form').getForm();
                    var params = {
                        param: form.getValues()
                    };
                    var cbGroupField = button.up("form").down("checkboxgroup");
                    var checkedList = cbGroupField.getChecked();
                    var subCollege = Exam.lib.Util.toJsonValueArray(checkedList, ['boxLabel']);
                    debugger;
                    form.submit({
                        url: eDomain.getURL(url),
                        params: {
                            subCollege: subCollege.join(',')
                        },
                        success: function(form, action) {
                            if (!action.result.success) {
                                Ext.Msg.alert('Failed', action.result.msg);
                                return;
                            }
                            button.up("window").destroy();
                            Ext.Msg.alert('Success', me.title + "成功！");
                            me.targetView.getStore().reload();

                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Failed', action.result.msg);
                        }
                    });

                }
            }]
        };

        this.items.push(form);

        this.callParent(arguments);
    }
});