/**
 * a form window used for update  or add a student information
 */
Ext.define('Exam.view.form.StudentExcel', {
    extend: 'Ext.window.Window',
    title: '批量添加学生',
    constrain: true,
    constrainHeader: true,
    width: 400,
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        var me = this,
            url = 'student/adds',
            defaultField = {
                cid: -1,
                name: '┈┈请选择┈┈'
            },
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


        this.items = {
            xtype: 'form',
            bodyPadding: 10,
            frame: true,
            fileUpload: true,
            enctype: "multipart/form-data",
            anchor: '100%',
            items: [{
                xtype: 'filefield',
                name: 'xls',
                regex: /(.xlsx|.xls)$/,
                labelWidth: 50,
                msgTarget: 'side',
                allowBlank: false,
                anchor: '100%',
                buttonText: '选择excel'
            }, {
                xtype: 'button',
                style: 'border:none',  
                href:"./download/temp.xls",
                html: '下载用于上传学生信息的excel模版'
            }],
            buttons: [{
                text: '上传信息文档',
                handler: function(button,eOpts) {
                    if (!this.up('form').getForm().isValid()) {
                        return false
                    }
                    this.up('form').getForm().submit({
                        url:  eDomain.getURL(url),
                        waitMsg: '正在批处理信息......',
                        success: function(form, action) {
                            
                            var link=action.result.data.linkurl;
                            if(link){
                                Ext.Msg.alert("反馈结果", "共上传 "+action.result.data.total+" 个记录 "+"<br />检测到若干记录未成功上传并返回");
                                window.open("student/download?filename="+link,"target=_blank");
                                return;
                            }
                            
                            Ext.Msg.alert("反馈结果", "全部上传 "+action.result.data.total+" 个记录 ");
                            button.up("window").destroy();
                        },
                        failure: function(form, action) {
                             
                        }
                    })
                }
            }]
        };
        this.callParent(arguments);
    }
});