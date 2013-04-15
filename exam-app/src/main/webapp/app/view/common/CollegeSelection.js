Ext.define("Exam.view.common.CollegeSelection", {
    extend: "Ext.toolbar.Toolbar",
    xtype: "cmncollegeselection",
    dock: 'top',
    defaults: {
        labelAlign: 'right',
        labelWidth: "auto",
        style: "margin-left:12px",
        editable: false
    },
    requires: ["Ext.toolbar.Toolbar", "Ext.form.field.ComboBox"],
    initComponent: function() {
        var me = this;
        var defaultField = {
            cid: -1,
            name: '┈┈请选择┈┈'
        };
        var defaultKV = [ -1, '┈┈请选择┈┈'];
        var collegeSelectionStore = Ext.create('Exam.store.CollegeSelections', {
            autoLoad: true,
            listeners: {
                load: function(store, records, successful, eOpts) {
                    store.insert(0, defaultField);
                }
            }
        });
        
        this.items = [{
            xtype: 'combobox',
            fieldLabel: '学院',
            displayField: 'name',
            valueField: 'cid',
            value:-1,
            editable:false,
            store: collegeSelectionStore,
            listeners: {
                show: function(field, eOpts) {
                    field.setValue(defaultField);
                },
                change: function(field, newValue, oldValue, eOpts) {


                    var nextField = field.nextSibling("combobox");
                    if (newValue == -1) {
                        nextField.store.loadData([defaultKV]);
                        nextField.setValue( - 1);
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
                                mList.push([item.cid,item.name]);
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
            name: 'major',
            editable: false,
            value: -1,
            store: [defaultKV],
            listeners: {
                show: function(field, eOpts) {
                    field.setValue(defaultField);
                },
                change: function(field, newValue, oldValue, eOpts) {

                   var nextField = field.nextSibling("combobox");
                    if (newValue == -1) {
                        nextField.store.loadData([defaultKV]);
                        nextField.setValue( - 1);
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
                                mList.push([item.cid,item.name]);
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
            name: 'grade',
            editable:false,
            store: [defaultKV],
            listeners: {
                render: function(field, eOpts) {
                    field.setValue(-1);
                },
                change: function(field, newValue, oldValue, eOpts) {

                }
            }
        },{xtype:"textfield",action:"key",emptyText:"ID或姓名"}, {
            xtype: 'button',
            text: '搜索',
            //scale:'medium',
            action: 'query',
            style: 'border:1px solid #A1A1A1',
            icon: 'static/img/search.png',
            iconAlign: 'right'
        }];
        this.callParent(arguments);
    }
});