Ext.define('Exam.view.form.College', {
    title: '添加信息',
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
        
        var me = this,
            treeNode=me.targetView.getRootNode(),
            record=me.targetView.getSelectionModel().getSelection()[0],
            
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
                    recordData.name=form.getValues()[itemType];

                    
                     
                    form.submit({
                       
                        method:"post",
                        url: eDomain.getURL(itemType+"/add") ,
                        params: recordData,
                        success: function(form, action) {
                            
                            var result=action.result;
                            if(result.success==false){
                                Ext.Msg.alert('错误', 'message:'+result.msg+' '+status+":"+result.status);
                                return;
                            }
                            //
                            var newNode=null;
                            if(itemType=="college"){
                               // var node={id:12232,name:"test",data:[]}
                                var node=result.data;
                                node.data=[];
                                newNode=treeNode.appendChild(node);
                            }else if(itemType=="major"){
                                var node=result.data;
                                node.data=[];
                                newNode=record.appendChild(node);
                            }else{
                                 var node=result.data;
                                node.leaf=true;
                                newNode=record.appendChild(node);
                                 
                            }
                            if(record&&record.isLeaf()==false){
                                record.expand(true);
                            }
                            
                            Ext.Msg.alert('提示', "添加成功");
                            button.up('window').destroy();
                           
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