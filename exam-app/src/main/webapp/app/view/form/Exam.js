 Ext.define("Exam.view.form.Exam", {
     extend: "Ext.form.Panel",
     xtype: "formexam",
     title: "新建考试",
     defaultType: 'fieldcontainer',
     bodyPadding: 20,
     defaults: {
         labelAlign: 'right',
         labelWidth: 100,
         layout: 'hbox',
         allowBlank: false
     },
     initComponent: function() {
         var me = this;
       /*  name
paperid
starttime
mintime
iproom
creator*/
         me.items = [{
             xtype: 'textfield',
             fieldLabel: '考试名称',
             name: 'name',
             labelWidth: 100,
             emptyText: '考试名称将显示在考卷顶部',
             width: 420
         }, {
             xtype: 'hiddenfield',
             name: 'examid',
             value: ''
         }, {
             fieldLabel: '试卷名称',
             items: [{
                 xtype: 'textfield',
                 name: 'papername',
                 emptyText: '点击从弹窗试卷列表选择',
                 allowBlank: false,
                 readOnly: true,
                 width: 314
             }, {
                 xtype: 'hiddenfield',
                 name: 'paperid',
                 value: ''
             }, {
                 xtype: 'button',
                 text: "选择试卷",
                 action: "select-paper",
                 style: 'border:1px solid #A1A1A1',
                 icon: 'static/img/search.png',
                 iconAlign: 'right'
             }]
         }, {
             fieldLabel: '开始时间',
             defaults: {
                 labelWidth: 20
             },
             items: [{
                 xtype: 'datefield',
                 emptyText: '开始日期',
                 minValue: new Date(),
                 editable: false,
                 format: 'Y-m-d',
                 allowBlank: false,
                 name: 'date'
             }, {
                 xtype: 'displayfield',
                 value: '&nbsp-&nbsp'
             }, {
                 xtype: 'timefield',
                 emptyText: '开始时间',
                 format: 'H:i',
                 allowBlank: false,
                 editable: false,
                 name: 'time',
                 minValue: '8:00 AM',
                 maxValue: '9:00 PM'
             }]
         }, {
             fieldLabel: '考试时长',
             items: [{
                 xtype: 'numberfield',
                 name: 'duration',
                 value: 60,
                 minValue: 15,
                 maxValue: 150
             }, {
                 xtype: 'displayfield',
                 value: '分钟'
             }]
         }, {
             fieldLabel: '至少答卷 ',
             items: [{
                 xtype: 'numberfield',
                 name: 'mintime',
                 value: 15,
                 minValue: 15,
                 maxValue: 150
             }, {
                 xtype: 'displayfield',
                 value: ' 分钟（才能交卷）'
             }]
         }, {
             fieldLabel: '考试机房',
             items: [{
                 xtype: 'textfield',
                 labelWidth: 100,
                 emptyText: '从弹窗试卷列表选择',
                 name: 'iprooms',
                 allowBlank: false,
                 width: 420,
                 readOnly: true
             }, {
                 xtype: 'hiddenfield',
                 name: 'iproomlist',
                 value: '[]'
             }, {
                 xtype: 'button',
                 text: "选择机房",
                 action: "select-iproom",
                 style: 'border:1px solid #A1A1A1',
                 icon: 'static/img/search.png',
                 iconAlign: 'right'
             }, {
                 xtype: 'button',
                 text: "修改",
                 action: "eidt-iproom",
                 style: 'border:1px solid #A1A1A1',
                 icon: 'static/img/search.png',
                 iconAlign: 'right'
             }]
         }, {
             xtype: 'button',
             text: '下一步',
             scale: 'large',
             style: "margin:20px 0 0 300px;padding:auto 30px;",
             handler: function(button, eOpts) {
                 var form = button.up('form');
                 if (!form.getForm().isValid()) {
                     return;
                 }
                 var values = form.getForm().getValues();
                 var examIDFeild = form.down('hiddenfield[name=examid]');
                 var examid = examIDFeild.getValue();
                 var url = "exam/add";
                 if (examid != '') {
                     url = "exam/mod"
                 }
                 var dateArr=values['date'].split('-'),
                  timeArr=values['time'].split(':');
                 var starttime=new Date(dateArr[0],dateArr[1],dateArr[2],timeArr[0],timeArr[1],0);
                 //values['starttime']=starttime.getTime();
                 values['starttime']=values['date']+' '+values['time']+":00";
                 values['iprooms']=Ext.JSON.decode(values['iproomlist']);
                 debugger;
                 values['creator']=eUserInfo.name;
                 Ext.Ajax.request({
                     url:eDomain.getURL(url),
                     method: "post",
                     type: "json",
                     params: values,
                     success: function(res,eOpts) {
                         var rs=Ext.JSON.decode(res.responseText);
                         if (!rs.success) {
                             Ext.Msg.alert('Failed', res.msg);
                             return;
                         }
                         var examid = rs.data.id;
                         debugger;
                         examIDFeild.setValue(examid);
                         form.nextNode().expand(true);
                         form.nextNode().getStore().load({
                             param: {
                                 collegeid: -1,
                                 majorid: -1,
                                 classid: -1,
                                 key: ''
                             },
                             trigger: true
                         });
                     },
                     failure: function(res, options) {
                          Ext.Msg.alert('Failed', res.msg);
                     }
                 });

             }
         }];

         this.callParent(arguments);
     }
 });