/**
 * a form window used for update  or add a teacher information
 */
Ext.define('Exam.view.edit.Teacher', {
    extend: 'Ext.window.Window',
    title: '修改信息',
    xtype: 'editteacher',
    constrain: true,
    constrainHeader: true,
    width: 400,
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        var me = this,
            targetView = me.targetView,
            record=me.record,
            collegeid=record.get("college").id,
            url =  'teacher/mod',
            defaultField = {
                cid: -1,
                name: '┈┈请选择┈┈'
            },
            collegeSelectionStore = Ext.create('Exam.store.CollegeSelections', {
                autoLoad: true,
                listeners: {
                    load: function(store, records, successful, eOpts) {
                         store.insert(0, defaultField);
                    }
                }
            }),
            filedConf = [{
                fieldLabel: 'ID',
                name: 'id',
                readOnly:true 
            }, {
                fieldLabel: '姓名',
                name: 'name'
            }, {
                xtype: 'combobox',
                fieldLabel: '学院',
                name: 'collegeid',
                displayField: 'name',
                valueField: 'cid',
                editable: false,
                validator: function(value) {
                    var flag = this.getRawValue() == defaultField.name;
                    return !flag;
                },
                store: collegeSelectionStore,
                listeners: {
                    render: function(field, eOpts) {
                        field.setValue(collegeid); 
                    },
                    change: function(field, newValue, oldValue, eOpts) {

                        
                    }
                }
            }, {
                fieldLabel: '邮箱',
                name: 'email',
                regex: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9]\.[a-z\.]{1,}[a-z]$/
            }, {
                fieldLabel: '电话',
                name: 'tel',
                regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
            }, {
                xtype: 'radiogroup',
                fieldLabel: '角色',
                // Arrange radio buttons into two columns, distributed vertically
                columns: 2,
                vertical: false,
                items: [{
                    boxLabel: '管理员',
                    name: 'role',
                    inputValue: 0,                    
                    checked: true
                }, {
                    boxLabel: '教职工',
                    name: 'role',
                    inputValue: 1
                } ]
            }];
        this.items = {
            xtype: 'form',
            bodyPadding: 10,
            layout: 'anchor',
            defaults: {
                anchor: '80%',
                labelWidth: 70,
                labelAlign: 'right',
                allowBlank: false
            },
            defaultType: 'textfield',
            items: filedConf,
            buttonAlign: 'center',
            buttons: [{
                text: '确定',
                formBind: true,
                //only enabled once the form is valid
                disabled: true,
                handler: function(button, e) {
                    var form = button.up('form').getForm();
                    var values = form.getValues();
                    for(var pro in values){
                        record.set(pro,values[pro]);
                    }

                    form.submit({
                        url: eDomain.getURL(url),
                        method: "post",
                        params: {
                            password: values['id']
                        },
                        success: function(form, action) {
                            Ext.Msg.alert('Success', "修改成功！！");
                            button.up("window").destroy();
                            record.commit();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('失败', action.result.msg);
                            record.reject();
                        }
                    });

                }
            }]
        };
        this.callParent(arguments);
    }
});