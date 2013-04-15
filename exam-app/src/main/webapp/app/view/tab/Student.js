 /**
  * @Exam.view.tab.Student
  * @view
  * a tab for show student information
  */
 Ext.define("Exam.view.tab.Student", {
     extend: "Ext.grid.Panel",
     xtype: "tabstudent",
     store: "Students",
     //selType: 'checkboxmodel',
     config: {
         hasToolBarCRUD: true,
         hasToolBarQuery: true
     },
     multiSelect: true,
     requires: ['Exam.view.common.CollegeSelection'],
     columns: [{
         text: 'ID',
         dataIndex: 'id'
     }, {
         text: '姓名',
         dataIndex: 'name',
         flex: 1
     }, {
         text: '学院',
         dataIndex: 'college',
         flex: 1
     }, {
         text: '专业',
         dataIndex: 'major',
         flex: 1
     }, {
         text: '班级',
         dataIndex: 'class',
         flex: 1
     }, {
         text: '邮箱',
         dataIndex: 'email',
         flex: 1
     }, {
         text: '密码',
         dataIndex: 'password',
         flex: 1
     }],
     initComponent: function() {
         var me = this;
         this.initConfig(this.config);

         var toolBarCURD = {
             xtype: 'toolbar',
             dock: 'top',
             items: [{
                 xtype: 'button',
                 action: 'add-student',
                 icon: 'static/img/icon-add.png',
                 text: '添加'
             }, "-",

             {
                 xtype: 'button',
                 action: 'edit-student',
                 disabled: true,
                 icon: 'static/img/icon-edit.png',
                 text: '编辑'
             }, "-", {
                 xtype: 'button',
                 action: 'delete-student',
                 disabled: true,
                 icon: 'static/img/icon-delete.png',
                 text: '删除'
             }, {
                 xtype: 'button',
                 action: 'add-batch',
                 icon: 'static/img/icon-import-students.png',
                 text: '批量导入'
             }]
         };
                
         this.dockedItems = [];
 
         if (me.hasToolBarCRUD) {
             this.dockedItems.push(toolBarCURD);
         }
         if (me.hasToolBarQuery) {
             this.dockedItems.push({
                 xtype: 'cmncollegeselection'
             });
         }
         this.dockedItems.push({
             xtype: 'pagingtoolbar',
             store: me.store,
             dock: 'bottom',
             displayInfo: true
         });
         this.callParent(arguments);
     }
 });