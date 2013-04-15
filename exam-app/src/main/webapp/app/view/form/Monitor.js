/**
 * @Exam.view.tab.Monitor
 * @view
 * a tab for show Student's Status in exam
 */
Ext.define("Exam.view.form.Monitor", {
  extend: "Ext.grid.Panel",
  xtype: "formmonitor",
  store: "Monitor",
  title: "考试监控",
  config: {
    hasToolBarCRUD: true,
    hasToolBarQuery: true
  },
  multiSelect: true,
  requires: ['Exam.view.common.CollegeSelection'],
  // requires: ['Exam.view.common.CollegeSelection'],
  columns: [{
    text: '考试名称',
    dataIndex: 'name',
    renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {
      debugger;
      return "<a href='#'>" + value + "</a>";
    },
    flex: 1.5
  }, {
    text: '试卷名称',
    dataIndex: 'papername',

    flex: 1
  }, {
    text: '开始时间',
    dataIndex: 'starttime',
    flex: 1
  }, {
    text: '考试时长',
    dataIndex: 'duration',
    flex: 1
  }, {
    text: '创建者',
    dataIndex: 'creator',
    flex: 1
  }, {
    text: '状态',
    dataIndex: 'status',
    renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {
      debugger;
      var status = ["未开始", "进行中", "已结束"];
      var dur = record.data.duration;
      var tem = record.data.starttime;
      var startTime = new Date(tem);
      var startCur = Date.parse(startTime);
      var endCur = startCur + dur * 60 * 1000;
      var duration = dur * 60 * 1000;
      var nowTime = new Date();
      var nowCur = Date.parse(nowTime);
      var flag;
      if (nowCur >= endCur) {
        flag = 3;
      } else if (nowCur >= startCur) {
        flag = 2;
      } else {
        flag = 1;
      }
      return status[flag - 1];
    },
    flex: 1
  }, {
    renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {
      debugger;
      var status = ["未开始", "进行中", "已结束"];
      var dur = record.data.duration;
      var tem = record.data.starttime;
      var startTime = new Date(tem);
      var startCur = Date.parse(startTime);
      var endCur = startCur + dur * 60 * 1000;
      var duration = dur * 60 * 1000;
      var nowTime = new Date();
      var nowCur = Date.parse(nowTime);
      var flag;
      if (nowCur >= endCur) {
        flag = 3;
      } else if (nowCur >= startCur) {
        flag = 2;
      } else {
        flag = 1;
      }
      setInterval(function() {
        debugger;
        var nicefeng = function() {
        Ext.Ajax.request({
          url: "exam/status.do",
          method: "get",
          type: "json",
          params: {
            examid: record.internalId,
            status: flag
          },
          success: function(response) {
            debugger;
          }
        });
        };
        var r = this.newPanel.items.items[0].getStore();
        var index = r.find("name", record.data.name);
        var w = r.getAt(index);
        if (w.raw.name != record.data.name) {
          w = r.getAt(index + 1);
        }
        //alert(record.data.name+"在第"+index+"行");
        var curstatus = w.raw.status;
        var status = ["未开始", "进行中", "已结束"];
        var dur = record.data.duration;
        var tem = record.data.starttime;
        var startTime = new Date(tem);
        var startCur = Date.parse(startTime);
        var endCur = startCur + dur * 60 * 1000;
        var duration = dur * 60 * 1000;
        var nowTime = new Date();
        var nowCur = Date.parse(nowTime);
        var flag;
        if (nowCur >= endCur) {
          flag = 3;
        } else if (nowCur >= startCur) {
          flag = 2;
        } else {
          flag = 1;
        }
        if (curstatus != flag) {
          nicefeng();
        }
        w.raw.status = flag;
        w.set("status", status[flag - 1]);
      }, 6000);
    },
    flex: 0
  }],
  listeners: {
    'itemclick': function(view, record, item, index, e) {}
  },
  viewConfig: {
    forceFit: true,
    scrollOffset: 0
  },
  initComponent: function() {
    var me = this;

    var defaultField = [-1, '┈┈请选择┈┈'];
    this.dockedItems = [{
      xtype: 'toolbar',
      dock: 'top',
      defaults: {
        labelWidth: 'auto',
      },
      items: [{
        xtype: 'combobox',
        fieldLabel: '学院',
        name: 'collegeid',
        editable: false,
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
            debugger;
            Ext.Ajax.request({
              url: eDomain.getURL("college/list"),
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
          },
          change: function(field, newValue, oldValue, eOpts) {}
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
        text: '添加',
        action: 'add-paperlist',
        icon: 'static/img/icon-add.png',
        handler: function() {}
      }, "-", {
        xtype: 'button',
        text: '删除',
        disabled: true,
        action: 'delete-paperlist',
        icon: 'static/img/icon-delete.png',
        handler: function() {

        }
      }, "-", {
        xtype: 'button',
        text: '编辑',
        disabled: true,
        action: 'edit-paperlist',
        icon: 'static/img/icon-edit.png',
        handler: function() {

        }
      }]
    }, {
      xtype: 'pagingtoolbar',
      store: me.store,
      // same store GridPanel is using
      dock: 'bottom',
      displayInfo: true
    }];
    Ext.applyIf(me, {
      multiSelect: false
    });
    this.addListener('itemclick', click, this);

    function click(view, record, item, index, e) {
      if(e.getPageX()<=235){
      if (typeof(record.raw) != 'undefined') {
        debugger;
        name = record.raw.name; //获取单击行的相应数据
        num = index;
        debugger;
        localStorage.setItem("examid",record.raw.id);
        if (name == record.raw.name) {
          this.next().expand(true);
          this.next().getStore().load({
              param: {
              examid:record.raw.id,
              page:1,
              limit:14,
              collegeid:-1,
              majorid:-1,
              classid:-1,
              key:' '
            },
            trigger: true
          });
        }
      }
    }
    };
    this.callParent(arguments);
  }
});
