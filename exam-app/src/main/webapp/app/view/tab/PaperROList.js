  /**
   * @Exam.view.tab.IPRoom
   * @view
   * a tab for show IPRoom information
   */
  Ext.define("Exam.view.tab.PaperROList", {
    extend: "Ext.grid.Panel",
    xtype: "tabpaperreadover",
    store: "PaperROList",
    columns: [{
      text: '考试名称',
      dataIndex: 'name',
      renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {

        return "<a href='readover.html?examid="+record.get('id')+"' target='_blank'>"+value+"</a>";
      },
      flex: 1
    }, {
      text: '试卷名称',
      dataIndex: 'papername',
      flex: 1
    }, {
      text: '创建时间',
      dataIndex: 'starttime',
      flex: 1
    }, {
      text: '创建人',
      dataIndex: 'creator'
    }, {
      text: '课程名',
      dataIndex: 'coursename',
      flex: 1
    }],
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
          fieldLabel: '课程名',
          name: 'courseid',
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
          xtype: 'textfield',
          emptyText: '搜索关键词',
          action: "key"
        }, {
          xtype: 'button',
          text: '搜索',
          //scale:'medium',
          action: "button-query",
          style: 'border:1px solid #A1A1A1',
          icon: 'static/img/search.png',
          iconAlign: 'right'

        },   {
          xtype: 'tbfill'
        }, {
          xtype: 'button',
          text: '添加',
          action: 'add',
          icon: 'static/img/icon-add.png'
        },
          "-", {
          xtype: 'button',
          text: '删除',
          disabled: true,
          action: 'delete',
          icon: 'static/img/icon-delete.png'
        },
          "-", {
          xtype: 'button',
          text: '编辑',
          disabled: true,
          action: 'edit',
          icon: 'static/img/icon-edit.png'
        }],
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
      this.callParent(arguments);
    }
  });