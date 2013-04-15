 /**
  * @Exam.view.tab.Person
  * @view
  * a tab for show Person information
  */
 Ext.define("Exam.view.tab.Monitor", {
  title: '新建考试',
  xtype: 'tabmonitor',
  extend: "Ext.panel.Panel",
  layout: 'accordion',

  requires: [
    "Exam.view.form.Monitor",
    "Exam.view.tab.FilterStudent"],
  layoutConfig: {
    titleCollapse: false,
    animate: true,
    activeOnTop: true
  },
  items: [{
    title: '考试监控',
    xtype: 'formmonitor'
  }, {
    title: '考生信息',
    xtype: 'tabexamstudent',
    hasToolBarCRUD: false,
    buttons: [{
      action: 'add-list',
      text: '添加',
      style: "margin-right:22px",
      handler: function(button, eOpts) {
        var grid=button.up('panel');
        var records = grid.getSelectionModel().getSelection();
        if (records.length < 1) {
          Ext.Msg.alert('提示', '没有选中人和记录 <br />按住 shift &nbsp;或&nbsp;ctrl 点击记录可多选');
          return;
        }
        var idList = [];
        for (var i = 0, len = records.length; i < len; i++) {
          var rec = records[i];
          idList.push(rec.get('id'));
        }
        var form=grid.up('panel').down('form');
        var examid=form.down('hiddenfield[name=examid]').getValue();
        if(examid==''){
          Ext.Msg.alert('提示', "请先提交考试基本信息");
          form.expand(true);
          return;
        }
        Ext.Ajax.request({
          //url: eDomain.getURL("exam/add/student"),
          url:eDomain.getURL('exam/student/add'),
          method: "POST",
          type: "json",
          params: {
            examid: examid,
          //  paperid: paperid,
            studentids: idList
          },
          success: function(res) {
            var rs = Ext.JSON.decode(res.responseText);
            if (!rs.success) {
              alert(rs.msg);
              return false;
            }
            grid.store.reload();
            Ext.getBody().mask("<span style='color:Green'> 本次导入考生共计 "+len+" 人 </span>");
            setTimeout(function() {
              Ext.getBody().unmask();
            },
            1200);    

          },
          failure: function(response, options) {
            Ext.Msg.alert('提示', response.msg);
          }
        });
      }
    }, {
      action: 'submit',
      text: '完成',
      handler:function(button,eOpts){
        button.up('tabexamwizard').destroy();
      }
    }],
    buttonAlign: "center"
  }],
  initComponent: function() {
    this.callParent(arguments);
  }
 });