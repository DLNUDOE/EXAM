 Ext.define("Exam.view.tab.Paper", {
     extend: "Ext.form.Panel",
     xtype: "tabpaper",
     title: "新建题目",
     bodyPadding: 12,
     buttonAlign: 'center',
     layout: {
         type: 'vbox',
         padding: '5',
         align: 'center'
     },
     defaults: {
         labelAlign: 'right',
         labelWidth: 60
     },
     defaultType: "textfield",
     initComponent: function() {
         var me = this;
         var defaultField = [-1, '┈┈请选择┈┈'];
         me.items = [{
             fieldLabel: "试卷名称",
             name: "name",
             xtype: "textfield",
             width: 640,
             allowBlank: false
         }, {
             xtype: 'combobox',
             fieldLabel: '课程名',
             name: 'courseid',
             editable: false,
             width: 640,
             store: [
                 [-1, '']
             ],
             value: -1,
             validator: function(value) {
                 if (value.replace(/\s/g, '') == defaultField[1]) {
                     return false;
                 }
                 return true;
             },
             listeners: {
                 render: function(field, eOpts) {

                     Ext.Ajax.request({
                         url: eDomain.getURL("teacher/course/list"),
                         method: "get",
                         type: "json",
                         params: {
                             id: eUserInfo.id
                         },
                         success: function(res) {

                             var rs = Ext.JSON.decode(res.responseText);
                             if (!rs.success) {
                                 alert(rs.msg);
                                 return false;
                             }

                             var courseList = Exam.lib.Util.toJsonValueArray(rs.data, ["id", "name"]);
                             courseList.unshift(defaultField);
                             field.store.loadData(courseList);
                             field.setValue(-1);

                         },
                         failure: function(response, options) {
                             debugger;
                             Ext.Msg.alert("Faild", rs.msg);
                         }
                     });
                 }
             }
         }, {
             title: "配置参数",
             xtype: "fieldset",
             collapsible: true,
             layout: {
                 type: 'table',
                 columns: 3
             },
             defaults: {
                 labelAlign: 'right',
                 labelWidth: 60,
                 anchor: '90%',
                 readOnly: false,
                 allowBlank: false,
                 readOnly: false,
                 style: "margin:20px 0 40px 0"
             },
             defaultType: "numberfield",
             items: [{
                 name: 'radio',
                 fieldLabel: '单选题',
                 value: 10,
                 maxValue: 100,
                 minValue: 0
             }, {
                 name: 'checkbox',
                 fieldLabel: '多选题',
                 value: 5,
                 maxValue: 100,
                 minValue: 0
             }, {
                 name: 'blank',
                 fieldLabel: '填空题',
                 value: 4,
                 maxValue: 100,
                 minValue: 0
             }, {
                 name: 'judge',
                 fieldLabel: '判断题',
                 value: 5,
                 maxValue: 100,
                 minValue: 0
             }, {
                 name: 'subject',
                 fieldLabel: '主观题',
                 value: 2,
                 maxValue: 100,
                 minValue: 0
             }, {
                 name: 'exotic',
                 fieldLabel: '混合题',
                 value: 0,
                 maxValue: 100,
                 minValue: 0
             }, {
                 fieldLabel: '总分',
                 xtype: 'numberfield',
                 value: 100,
                 name: "score",
                 minValue: 0,
                 maxValue: 1000
             }]
         }, {
             xtype: "fieldcontainer",
             width: 640,
             layout: {
                 type: 'hbox',
                 padding: '10',
                 pack: 'end',
                 align: 'right'
             },
             items: [{
                 labelWidth: 'auto',
                 labelAlign: 'right',
                 xtype: "checkboxfield",
                 fieldLabel: "启用智能出卷配置",
                 name: "intel",
                 checked: true,
                 inputValue: 1,
                 listeners: {
                     change: function(field, newValue, oldValue, eOpts) {
                         var fieldset = field.up("form").down('fieldset');
                         if (field.checked) {
                             field.inputValue = 1;
                             fieldset.enable(true);
                             fieldset.expand(true);
                         } else {
                             fieldset.disable(true);
                             field.inputValue = 0;
                         }
                     }
                 }
             }, {
                 xtype: "button",
                 style: "margin:0 0 0 100px;font-size:16px;letter-spacing:20px",
                 text: "提交",
                 scale: "large",
                 handler: function(button, e) {
                     var courseField = button.up('form').down('combobox[name=courseid]');
                     var form = button.up('form').getForm();
                     var values = form.getValues();
                     values = Ext.Object.merge({
                         radio: 0,
                         checkbox: 0,
                         blank: 0,
                         judge: 0,
                         subject: 0,
                         exotic: 0
                     }, values);
                     values['course'] = courseField.getRawValue();
                     var formString =  '<form id="monitor" action="./teacher/intel/paper.html"><input type="hidden" name="name" value="{0}"/><input type="hidden" name="courseid"  value="{1}"/><input type="hidden" name="course"  value="{2}"/><input type="hidden" name="radio"  value="{3}"/><input type="hidden" name="checkbox"  value="{4}"/><input type="hidden" name="judge"  value="{5}"/><input type="hidden" name="blank"  value="{6}"/><input type="hidden" name="subject"  value="{7}"/><input type="hidden" name="score"  value="{8}"/><input type="hidden" name="reload" value="{9}" /></form>';
                     var div = document.createElement('div');
                     debugger;
                     formString = Ext.String.format(
                     formString,
                     values.name,
                     values.courseid,
                     values.course,
                     values.radio,
                     values.checkbox,
                     values.judge,
                     values.blank,
                     values.subject,
                     values.score,
                     1);
                     div.innerHTML = formString;
                     formEle = div.childNodes[0];
                     if (!form.isValid()) {
                         return;
                     }

                     formEle.submit();
                 }
             }] 
         }];
         this.callParent(arguments);
     }
 });