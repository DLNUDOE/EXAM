/**
 * a form window used for update  or mod a teacher  courseinformation
 */
Ext.define('Exam.view.form.TeacherCourse', {
    extend: 'Ext.window.Window',
    title: '教师课程',
    constrain: true,
    constrainHeader: true,
    width: 560,
    resizable: false,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        var me=this;
          url = this.url || 'teacher/course/mod',            
            selCourse = me.selCourse||[],
            allCourse = me.allCourse||[],
            cbGroup=[];
            debugger;
        var values=[];
        debugger;
        for (var i = 0; i < selCourse.length; i++) {
            
        }
        for (var i = 0; i < allCourse.length; i++) {
            var item=allCourse[i];
            cbGroup.push({
                boxLabel: item.name,
                name: 'course' + item.id,
                inputValue: item.id
            });
        }

        this.items = {
            xtype: 'form',
            bodyPadding: 10,
            layout: 'anchor',
            defaults: {
                labelWidth: 70,
                labelAlign: 'right',
                allowBlank: false
            },
            items: [{
                xtype: 'checkboxgroup',
                fieldLabel: '课程选项',
                // Arrange radio buttons into two columns, distributed vertically
                columns: 3,
                vertical: true,
                items: cbGroup,
                listeners:{
                    show:function(field,eOpts){
                        field.set();
                    }
                }
            }],
            buttonAlign: 'center',
            buttons: [{
                text: '确定',
                 
                handler: function(button, e) {
                    var form = button.up('form').getForm();
                    var values = form.getValues();


                    form.submit({
                        url: eDomain.getURL(url),
                        method: "post",
                        params:  {},
                        success: function(form, action) {
                            Ext.Msg.alert('Success', "添加成功！！");
                            button.up("window").destroy();
                             
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