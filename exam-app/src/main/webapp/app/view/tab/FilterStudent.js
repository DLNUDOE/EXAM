 /**
  * @Exam.view.tab.Student
  * @view
  * a tab for show student information
  */
 Ext.define("Exam.view.tab.FilterStudent", {
     extend: "Ext.grid.Panel",
     xtype: "tabexamstudent",
     store: "ExamStudent",
     //selType: 'checkboxmodel',
     config: {
         hasToolBarCRUD: true,
         hasToolBarQuery: true
     },
     multiSelect: true,
     requires: ['Exam.view.common.CollegeSelection'],
     columns: [{
         text: 'ID',
         dataIndex: 'stuid'
     }, {
         text: '姓名',
         dataIndex: 'name',
         flex: 1
     }, {
         text: '学院',
         dataIndex: 'collegename',
         flex: 1
     }, {
         text: '专业',
         dataIndex: 'major',
         flex: 1
     }, {
         text: '班级',
         dataIndex: 'clazz',
         flex: 1
     }, {
         text: '考生状态',
         dataIndex: 'status',
         renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {
          debugger;
          var status=["没登陆","在线","正在考试","异常退出","已提交","作弊"];
          if(value==0){
            return status[0];
          }else if(value==1){
            return status[1];
          }else if(value==2){
            return status[2];
          }else if(value==4){
            return status[3];
          }else if(value==5){
            return status[4];
          }else if(value==6){
            return status[5];
          }
    },
         flex: 1
     }, {
        xtype: 'actioncolumn',
        text: '操作',
        width: 70,
        menuDisabled: true,
        tooltip: '考生违纪',
        align: 'center',
        icon: 'static/img/icon-edit.png',
        handler: function(grid, rowIndex, colIndex, actionItem, event, record, row){
        debugger;
        var index=this.up().up().getStore().find("stuid",record.raw.stuid);
        var recover=this.up().up().getStore().getAt(index);
        if(recover.raw.status==2||recover.raw.status==6||recover.raw.status==1){
        if(recover.raw.status==6){
            if(confirm("你确定要取消'"+record.raw.name+"'违纪状态吗")){
                Ext.Ajax.request({
              url: "exam/cheating.do",
              method: "get",
              type: "json",
              params: {
                studentid: record.raw.stuid,
                examid:localStorage.getItem("examid"),
                status:record.raw.status
              },
              success: function(res) {
                debugger;
                var index = this.newPanel.child().next().getStore().find("stuid",record.raw.stuid);
                var w = this.newPanel.child().next().getStore().getAt(index);
                w.raw.status = 2;
                w.set("status", 2);
                }
            });
            }
        }else{
        if(confirm("你确定'"+record.raw.name+"'违纪了吗")){
            Ext.Ajax.request({
              url: "exam/cheating.do",
              method: "get",
              type: "json",
              params: {
                studentid: record.raw.stuid,
                examid:localStorage.getItem("examid"),
                status:2
              },
              success: function(res) {
                debugger;
                var index = this.newPanel.child().next().getStore().find("stuid",record.raw.stuid);
                var w = this.newPanel.child().next().getStore().getAt(index);
                w.raw.status = 6;
                w.set("status", 6);
                }
            });
        }
        }
    }
        }
     },{
        renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {
            setInterval(function() {
            debugger;
            Ext.Ajax.request({
            url: "exam/stu/status.do",
            method: "get",
            type: "json",
            params: {
              examid: localStorage.getItem("examid"),
              status: record.raw.status
            },
            success: function(response) {
              debugger;
              var stulist=JSON.parse(response.responseText);
              for(var i=0;i<stulist.data.length;i++){
                var stuid = stulist.data[i].id;
                var index = this.newPanel.child().next().getStore().find("stuid",stuid);
                var w = this.newPanel.child().next().getStore().getAt(index);
                w.raw.status = stulist.data[i].status;
                value=w.raw.status;
                if(value==0){
                w.set("status",0);
              }else if(value==1){
                w.set("status",1);
              }else if(value==2){
                w.set("status",2);
              }else if(value==4){
                w.set("status",4);
              }else if(value==5){
                w.set("status",5);
              }else if(value==6){
                w.set("status",6);
              }
              }
            }
          });
            },4000);
        },
        flex: 0
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