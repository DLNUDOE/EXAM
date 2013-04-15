Ext.define("Exam.view.common.TopicTypeList", {
    extend: "Ext.toolbar.Toolbar",
    xtype: "cmntopictypelist",
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
        var defaultField =  [-1,'----请选择----'];

        /*var courseSelectionStore = Ext.create('Ext.data.Store', {
            fields: ["id", "name"],
            proxy: {
                type: 'ajax',
                url: eDomain.getURL("teacher/course/list"),
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: false,
            listeners: {
                load: function(store, records, successful, eOpts) {
                    store.insert(0, defaultField);
                }
            }
        });
*/
        Ext.apply(this, {
            items: [{
                xtype: 'combobox',
                fieldLabel: '题型',
                name: 'type',
                store: [
                    [1, "单选题"],
                    [2, "多选题"],
                    [3, "填空题"],
                    [4, "判断题"],
                    [5, "主观题"],
                    [6, "混合题"]
                ],
                listeners: {
                    render: function(field, eOpts) {
                        field.setValue(1);
                    },
                    change: function(field, newValue, oldValue, eOpts) {

                    }
                }
            }, {
                xtype: 'combobox',
                fieldLabel: '课程名',
                name: 'courseid',
              
                store: [[-1,'']],
                value:-1,
                listeners: {
                    render: function(field, eOpts) {
                        Ext.Ajax.request({
                            url: eDomain.getURL("teacher/course/list"),
                            method: "get",
                            type: "json",
                            params:{
                                id:eUserInfo.id
                            },
                            success: function(res) {
                                var rs = Ext.JSON.decode(res.responseText);
                                if (!rs.success) {
                                    alert(rs.msg);
                                    return false;
                                }
                                var temp=JSON.stringify(rs.data,["id","name"]);
                                localStorage.setItem('courseid',temp);
                                var courseList =  Exam.lib.Util.toJsonValueArray( rs.data,["id","name"]);                  
                                courseList.unshift(defaultField);  
                                field.store.loadData(courseList);
                                field.setValue(-1);

                            },
                            failure: function(response, options) {
                                debugger;
                                Ext.Msg.alert("Faild",rs.msg);
                            }
                        });
                    },
                    change: function(field, newValue, oldValue, eOpts) {

                    }
                }
            },{xtype:"textfield",action:"key",emptyText:"搜索关键词"}, {
            xtype: 'button',
            text: '搜索',
            //scale:'medium',
            action: 'query',
            style: 'border:1px solid #A1A1A1',
            icon: 'static/img/search.png',
            iconAlign: 'right'
        }]
        });

        this.callParent(arguments);
    }
});