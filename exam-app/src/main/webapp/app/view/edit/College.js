Ext.define('Exam.view.edit.College', {
    title: '修改信息',
    extend: 'Ext.window.Window',
    contrain: true,
    contrainHeader: true,
    width: 400,
    modal: true,
    layout: 'fit',
    autoShow: true,
    resizable: false,
    initComponent: function() {
        //var form = this.down('form'); 
        debugger;
        var me = this,             
            record=me.record,            
            itemType=me.itemType||"college",
            recordData = me.recordData || {},  
            
            collegeFields=[{
                xtype: 'textfield',
                name: 'college',
                fieldLabel: '学院名称',
                validator: me.fieldValidator,
                value: recordData.college || ''
                }, {
                    xtype: 'hiddenfield',
                    name: 'collegeid',
                    value: recordData.collegeid || ''
                }],

            majorFields = [{
                xtype: 'textfield',
                name: 'major',
                validator: me.fieldValidator,
                fieldLabel: '专业名称',
                value: recordData.major || ''
            }, {
                xtype: 'hiddenfield',
                name: 'majorid',
                value: recordData.majorid || ''
            }],

            classFields= [{
                xtype: 'textfield',
                name: 'class',
                validator: me.fieldValidator,
                fieldLabel: '班级名称',
                value: recordData.class || ''
            }, {
                xtype: 'hiddenfield',
                name: 'classid',
                value: recordData.classid || ''
            }];
 
        var selFields={
            "college":collegeFields,
            "major":majorFields,
            "class":classFields
        };
       
        this.items = [{
            xtype: 'form',
            height: 'auto',
            layout: 'anchor',
            bodyPadding: 12,
            defaults: {
                labelAlign: 'right',
                labelWidth: 60,
                anchor: '80%',
                readOnly: false,
                allowBlank: false,
                readOnly: false
            },
            items: selFields[itemType],
            buttonAlign: 'center',
            buttons: [{
                text: '确定',
                formBind: true,
                disabled: true,
                handler: function(button,e) {
                    
                    var form = button.up('form').getForm();
                    
                     var values=form.getValues();
                    recordData.name=values[itemType];
                    recordData.id= recordData[itemType+"id"];
                    record.set("name",recordData.name);
                debugger;
                    form.submit({
                        //url: me.url || 'college/add',
                        method:"post",
                        params:recordData,
                        url: eDomain.getURL(itemType+"/mod") ,
                        success: function(form, action) {
                            
                            var result=action.result;
                            if(result.success==false){
                                Ext.Msg.alert('错误', 'message:'+result.msg+' '+status+":"+result.status);
                                 record.reject();
                                return;
                            }
                            
                            record.commit();
                            button.up("window").destroy();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Failed', action.result.msg);
                        } 
                    });
                }
            }]
        }];

        this.callParent(arguments);
    },
    fieldValidator: function(value) {
        if(value.replace(/\s/g, '') == '输入名称') {
            return false;
        }
        return true;
    }
});