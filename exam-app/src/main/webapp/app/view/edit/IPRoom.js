/**
 * a form window used for update  or add a iproom information
 */
Ext.define('Exam.view.edit.IPRoom', {
    extend: 'Ext.window.Window',     
    constrain: true,
    constrainHeader: true,
    width: 400,
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        var me = this,
        targetView=me.targetView,        
            url = this.url || 'iproom/mod', 
            record=me.record           ,
            filedConf = [{
                name: 'id',
                xtype: 'hiddenfield'
            }, {
                fieldLabel: '机房名称',
                name: 'name'
            }, {
                fieldLabel: 'IP范围',
                name: 'iprange',
                regex: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)$/
            }, {
                fieldLabel: '容量',
                xtype: 'numberfield',
                minValue: 5,
                maxValue: 254,
                name: 'capacity'
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
                handler: function(button, eOpts) {
                    var form = this.up('form').getForm();
                    var values=form.getValues();

                    for(var pro in values){
                        record.set(pro,values[pro]);
                    }

                    if (form.isValid()) {
                        form.submit({
                            url: eDomain.getURL(url),
                            params:{
                                scope:values['iprange']
                            },
                            success: function(form, action) {
                                if (!action.result.success) {
                                    Ext.Msg.alert('Failed', action.result.msg);
                                    record.reject();
                                    return;
                                }
                                button.up("window").destroy();
                                Ext.Msg.alert('Success', "修改机房成功！");
                                me.targetView.getStore().reload();
                                record.commit();
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