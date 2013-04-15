/**
 * a form window used for update  or mod a TeacherCourse  courseinformation
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
        var me = this;
        var url =  'teacher/course/mod';
        var teacherid=me.tid;
        var record=me.record;
        var selCourse=record.get("courses");
        var allCourse=me.allCourse;
        var cbGroup=[];
        var  values={};
        debugger;
       for (var i=0;i<allCourse.length;i++) {
            var item=allCourse[i];
            
            cbGroup.push({
                boxLabel:item.name,
                name:"courseids"+item.id,
                inputValue:item.id
            });
        }
        for (var i=0;i<selCourse.length;i++) {
            var sItem=selCourse[i];
           values["courseids"+sItem.courseid]=true;
        }
        this.items = {
            xtype: 'form',
            bodyPadding: 10,
            layout: 'anchor',
            defaults: {
                labelWidth: 70,
                labelAlign: 'right',
                allowBlank: true
            },
            items: [{
                xtype: 'checkboxgroup',
                fieldLabel: '课程选项',
                // Arrange radio buttons into two columns, distributed vertically
                columns: 3,
                vertical: true,
                items: cbGroup,
                listeners:{
                    afterrender:function(field,eOpts){
                        debugger;
                        field.setValue(values);
                    }
                }
            }],
            buttonAlign: 'center',
            buttons: [{
                text: '确定', 
                handler: function(button, e) {
                    var form = button.up('form').getForm();
                    var values = form.getValues();
                    var courseList=[];
                    var checkedList=button.up('form').down("checkboxgroup").getChecked();
                    var newSelCourse=[];

                    for(var i=0,len=checkedList.length;i<len;i++){
                        var item=checkedList[i];
                         courseList.push(item.inputValue);
                         newSelCourse.push({courseid:item.inputValue,name:item.boxLabel});
                    }
                    if(courseList.length<1){
                        Ext.Msg.alert('提示','不可注册空课程');
                        return ;
                    }
                    record.set("courses",newSelCourse)
                    form.submit({
                        url: eDomain.getURL(url),
                        method: "post",
                        params: {courseids:courseList,teacherid:teacherid},
                        success: function(form, action) {
                            if(!action.result.success){
                                Ext.Msg.alert('Failed!', action.result.msg);                                
                                record.reject();
                                return false;
                            }
                            Ext.Msg.alert('Success', "注册成功！");
                            button.up("window").destroy();
                            record.commit();
                             
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Failed@', action.result.msg);
                        }
                    });

                }
            }]
        };
        this.callParent(arguments);
    }
});