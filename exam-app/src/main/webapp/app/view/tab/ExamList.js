  Ext.define("Exam.view.tab.ExamList", {
    extend: "Ext.grid.Panel",
    xtype: "tabexamlist",
    store: "ExamList",
    title: "考试列表",
    layout: 'fit',
    multiSelect: true,
    columns: [{
      text: 'ID',
      dataIndex: 'id'
    }, {
      text: '考试名称',
      dataIndex: 'name',
      renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {
        return Ext.String.format("<a href='teacher/get/paper.html?paperid={0}' target='_blank'>{1}</a>",record.get('paperid'),value);
      },
      flex: 1
    }, {
      text: '开考时间',
      dataIndex: 'starttime',
      flex: 1
    }, {
      text: '考试时长',
      dataIndex: 'duration'
    }, {
      text: '创建者',
      dataIndex: 'creator' 
    }, {
      text: '状态',
      dataIndex: 'status',
      renderer: function(value ) {
        //1，未开始  2.进行中 3.已结束  默认的考试状态是1即未开始
        var styleMap=["color:gray;","color:green;","color:red;"];
        var statusMap=["未开始","进行中","已结束"];
        return  Ext.String.format("<span style='{0}'>{1}</span>",styleMap[value-1],statusMap[value-1]);
      }
    }],
    initComponent: function() {
      var me = this;
      var defaultField = {
        cid: -1,
        name: '┈┈请选择┈┈'
      };
      var defaultKV = [-1, '┈┈请选择┈┈'];
      this.dockedItems = [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
          xtype: 'combobox',
          fieldLabel: '课程名',
          name: 'courseid',
          labelWidth: 'auto',
          editable: false,
          store: [
            [-1, '']
          ],
          value: -1,
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
                  courseList.unshift(defaultKV);
                  field.store.loadData(courseList);
                  field.setValue(-1);

                },
                failure: function(response, options) {
                  debugger;
                  Ext.Msg.alert("Faild", rs.msg);
                }
              });
            },
            change: function(field, newValue, oldValue, eOpts) {

            }
          }
        }, {
          xtype: 'textfield',
          emptyText: '搜索关键词',
          action: "key"
        }, {
          xtype: 'button',
          text: '搜索',
          //scale:'medium',
          action: "query",
          style: 'border:1px solid #A1A1A1',
          icon: 'static/img/search.png',
          iconAlign: 'right'

        }, {
          xtype: 'tbfill'
        }, {
          xtype: 'button',
          text: '添加学生',
          action: 'add-exam',
          icon: 'static/img/icon-add.png',
          handler: function() {

          }
        }, "-", {
          xtype: 'button',
          text: '删除学生',
          disabled: true,
          action: 'delete-exam',
          icon: 'static/img/icon-delete.png',
          handler: function() {

          }
        }, "-", {
          xtype: 'button',
          text: '编辑信息',
          disabled: true,
          action: 'edit-exam',
          icon: 'static/img/icon-edit.png',
          handler: function() {

          }
        }]
      }, {
        xtype: 'pagingtoolbar',
        store: me.store,
        dock: 'bottom',
        displayInfo: true
      }];
      this.callParent(arguments);
    }
  });