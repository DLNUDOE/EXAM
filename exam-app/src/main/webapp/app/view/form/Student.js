/**
 * a form window used for update  or add a student information
 */
Ext.define('Exam.view.form.Student', {
    extend: 'Ext.window.Window',
    title: '添加学生',
    constrain: true,
    constrainHeader: true,
    width: 400,
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        var me = this,
            record = me.record,
            url = 'student/add',
            defaultField = {
                cid: -1,
                name: '┈┈请选择┈┈'
            },
            
            targetView = me.targetView,
            defaultKV = [-1, '┈┈请选择┈┈'];
            debugger;
        var collegeSelectionStore = Ext.create('Exam.store.CollegeSelections', {
            autoLoad: true,
            listeners: {
                load: function(store, records, successful, eOpts) {
                    store.insert(0, defaultField);
                }
            }
        });

        me.formItems = [{
            fieldLabel: "学号",
            xtype: "textfield",
            emptyText: "学号",
            regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
            name: "id"
        }, {
            fieldLabel: "姓名",
            xtype: "textfield",
            emptyText: "姓名",
            name: "name"
        },{
            xtype: 'combobox',
            fieldLabel: '学院',
            name: "collegeid",
            displayField: 'name',
            valueField: 'cid',
            value: -1,
            editable: false,
            store: collegeSelectionStore,
            listeners: {
                show: function(field, eOpts) {
                     field.setValue(defaultCollege);
                     debugger;
                },
                change: function(field, newValue, oldValue, eOpts) {


                    var nextField = field.nextSibling("combobox");
                    if (newValue == -1) {
                        nextField.store.loadData([defaultKV]);
                        nextField.setValue(-1);
                        return
                    }

                    var upName = field.getRawValue();

                    Ext.Ajax.request({
                        url: eDomain.getURL("major/list"),
                        method: "get",
                        type: "json",
                        params: {
                            college: upName,
                            collegeid: newValue
                        },
                        success: function(res) {
                            debugger;
                            var rs = Ext.JSON.decode(res.responseText);
                            if (!rs.success) {
                                alert(rs.msg);
                                return false;
                            }
                            var list = rs.data,
                                mList = [];
                            for (var i = 0, len = list.length; i < len; i++) {
                                var item = list[i];
                                mList.push([item.cid, item.name]);
                            }
                            mList.unshift(defaultKV);
                            nextField.store.loadData(mList);
                            nextField.setValue(-1);
                            //nextField.store.loadData(list);

                        },
                        failure: function(response, options) {

                        }
                    });

                }
            }
        }, {
            xtype: 'combobox',
            fieldLabel: '专业',
            name: 'majorid',
            editable: false,
            value: -1,
            store: [defaultKV],
            listeners: {
                show: function(field, eOpts) {
                    field.setValue(defaultKV);
                },
                change: function(field, newValue, oldValue, eOpts) {

                    var nextField = field.nextSibling("combobox");
                    if (newValue == -1) {
                        nextField.store.loadData([defaultKV]);
                        nextField.setValue(-1);
                        return
                    }
                    debugger;
                    var upName = field.getRawValue();

                    Ext.Ajax.request({
                        url: eDomain.getURL("class/list"),
                        method: "get",
                        type: "json",
                        params: {
                            major: upName,
                            majorid: newValue
                        },
                        success: function(res) {
                            debugger;
                            var rs = Ext.JSON.decode(res.responseText);
                            if (!rs.success) {
                                alert(rs.msg);
                                return false;
                            }
                            var list = rs.data,
                                mList = [];
                            for (var i = 0, len = list.length; i < len; i++) {
                                var item = list[i];
                                mList.push([item.cid, item.name]);
                            }
                            mList.unshift(defaultKV);
                            nextField.store.loadData(mList);
                            nextField.setValue(-1);
                            //nextField.store.loadData(list);

                        },
                        failure: function(response, options) {

                        }
                    });
                }
            }
        }, {
            xtype: 'combobox',
            fieldLabel: '班级',
            name: 'classid',
            editable: false,
            value:-1,
            store: [defaultKV],
            listeners: {
                show: function(field, eOpts) {
                    field.setValue(defaultKV);
                } 
            }
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
            items: me.formItems,
            buttonAlign: 'center',
            buttons: [{
                text: '确定',
                formBind: true,
                //only enabled once the form is valid
                disabled: true,
                handler: function(button, eOpts) {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: eDomain.getURL(url),
                            success: function(form, action) {
                                if (!action.result.success) {
                                    Ext.Msg.alert('Failed', action.result.msg);
                                    return;
                                }
                                button.up("window").destroy();
                                Ext.Msg.alert('Success', "添加成功！");
                                me.targetView.getStore().reload();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Failed', action.result.msg);
                            }
                        });
                    }
                }
            }]
        };
        this.callParent(arguments);
    }
});