/**
 * a form window used for update  or add a teacher information
 */
Ext.define('Exam.view.form.Teacher', {
    extend: 'Ext.window.Window',
    title: '添加人员',    
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
            url = this.url || 'teacher/add',
            defaultField = {
                cid: -1,
                name: '┈┈请选择┈┈'
            },
            collegeSelectionStore = Ext.create('Exam.store.CollegeSelections', {
                autoLoad: true,
                listeners: {
                    load: function(store, records, successful, eOpts) {
                        debugger;
                        store.insert(0, defaultField);
                    }
                }
            }),
            filedConf = [{
                fieldLabel: 'ID',
                 regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
                name: 'id'
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
                        field.setValue(-1);

                        field.focus(true, 500);
                    },
                    change: function(field, newValue, oldValue, eOpts) {

                        debugger;
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
                    boxLabel: '教职工',
                    name: 'role',
                    inputValue: 1,                    
                    checked: true
                }, {
                    boxLabel: '管理员',
                    name: 'role',
                    inputValue: 0
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
                    debugger;

                    form.submit({
                        url: eDomain.getURL("teacher/add"),
                        method: "post",
                        params: {
                            password: values['id']
                        },
                        success: function(form, action) {
                            Ext.Msg.alert('Success', "添加成功！！");
                            button.up("window").destroy();
                            targetView.getStore().reload();
                            debugger;
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('失败', action.result.msg);
                        }
                    });

                }
            }]
        };
        this.callParent(arguments);
    }
});