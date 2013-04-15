  /**
   * @Exam.view.tab.IPRoom
   * @view
   * a tab for show IPRoom information
   */
  Ext.define("Exam.view.tab.PaperList", {
    extend: "Ext.grid.Panel",
    xtype: "tabpaperlist",
    store: "PaperList",
    columns: [{
      text: 'ID',
      dataIndex: 'id'
    }, {
      text: '试卷名称',
      dataIndex: 'name',
     renderer: function(value, cellmeta, record, rowIndex, columnIndex, store) {

        return "<a href='teacher/get/paper.html?paperid="+record.get('id')+"' target='_blank'>"+value+"</a>";
      },
      flex: 1
    }, {
      text: '创建时间',
      dataIndex: 'c_time',
      flex: 1
    }, {
      text: '创建人',
      dataIndex: 'creator'
    }, {
      text: '课程id',
      dataIndex: 'cid'
    }, {
      text: '课程名',
      dataIndex: 'cname',
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
              handler: function() {

              }
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
      this.callParent(arguments);
    }
  });