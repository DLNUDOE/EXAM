/**
 * a form window used for update  or add a student information
 */
Ext.define('Exam.view.edit.Student', {
    extend: 'Ext.window.Window',
    title: '修改学生信息',
    constrain: true,
    constrainHeader: true,
    width: 400,
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        var me = this,
            url = 'student/mod',
            defaultField = {
                cid: -1,
                name: '┈┈请选择┈┈'
            },
            record=me.record,
            defaultCollege = [record.get('collegeid'), record.get('college')],
            defaultMajor = [record.get('majorid'), record.get('major')],
            defaultClass = [record.get('classid'), record.get('class')],
            targetView = me.targetView,
            defaultKV = [-1, '┈┈请选择┈┈'];
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
            name: "id",
            value: record.get('id')
        }, {
            fieldLabel: "姓名",
            xtype: "textfield",
            emptyText: "姓名",
            value: record.get('name')
            name: "name"
        }, {
            xtype: "hiddenfield",
            name: "class"
        }, {
            xtype: "hiddenfield",
            name: "major"
        }, {
            xtype: "hiddenfield",
            name: "college"
        }, {
            xtype: 'combobox',
            fieldLabel: '学院',
            name: "collegeid",
            displayField: 'name',
            valueField: 'cid',
            editable: false,
            store: collegeSelectionStore,
            listeners: {
                show: function(field, eOpts) {
                    field.setValue(defaultCollege);
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
            store: [defaultMajor],
            listeners: {
                show: function(field, eOpts) {
                    field.setValue(defaultMajor);
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
            store: [defaultClass],
            listeners: {
                render: function(field, eOpts) {
                    field.setValue(defaultClass);
                },
                change: function(field, newValue, oldValue, eOpts) {

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