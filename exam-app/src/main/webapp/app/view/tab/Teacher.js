  /**
   * @Exam.view.tab.Teacher
   * @view
   * a tab for show Teacher information
   */
  Ext.define("Exam.view.tab.Teacher", {
      extend: "Ext.grid.Panel",
      xtype: "tabteacher",
      store: "Teachers",
      multiSelect: true,
      columns: [{
          text: 'ID',
          dataIndex: 'id'
      }, {
          text: '姓名',
          dataIndex: 'name'
      }, {
          text: '所属学院',
          flex: 1,
          dataIndex: 'college',
          renderer: function(collegeObj) {
              return collegeObj.name;
          }
      }, {
          text: '邮箱',
          flex: 1,
          dataIndex: 'email'
      }, {
          text: '电话',
          flex: 1,
          dataIndex: 'tel'
      }, {
          text: '已注册课程',
          dataIndex: 'courses',
          flex: 1,
          renderer: function(list) {

              var rs = [];
              for (var i = 0, len = list.length; i < len; i++) {
                  rs.push(list[i].name);
              }
              return rs.join('，');
          }
      }, {
          text: '角色',
          dataIndex: 'role'
      }],
      initComponent: function() {
          var me = this;
          var defaultField = {
              cid: -1,
              name: '┈┈请选择┈┈'
          };
          var collegeSelectionStore = Ext.create('Exam.store.CollegeSelections', {
              autoLoad: true,
              listeners: {
                  load: function(store, records, successful, eOpts) {
                      store.insert(0, defaultField);
                  }
              }
          });
          this.dockedItems = [{
              xtype: 'toolbar',
              dock: 'top',
              items: [{
                  labelWidth: 'auto',
                  xtype: 'combobox',
                  fieldLabel: '学院',
                  name: 'collegeid',
                  displayField: 'name',
                  valueField: 'cid',
                  editable: false,
                  store: collegeSelectionStore,
                  value: -1,
                  listeners: {
                      show: function(field, eOpts) {
                          field.setValue(defaultField);
                      }
                  }
              }, {
                  xtype: 'textfield',
                  emptyText: '搜索关键词',
                  name: 'query'
              }, {
                  xtype: 'button',
                  text: '搜索',
                  //scale:'medium',
                  action: 'button-query',
                  style: 'border:1px solid #A1A1A1',
                  icon: 'static/img/search.png',
                  iconAlign: 'right'

              }, {
                  xtype: 'tbfill'
              }, {
                  xtype: 'button',
                  text: '添加',
                  action: 'add-teacher',
                  icon: 'static/img/icon-add.png'
              }, "-", {
                  xtype: 'button',
                  text: '删除',
                  disabled: true,
                  action: 'delete-teacher',
                  icon: 'static/img/icon-delete.png'
              }, "-", {
                  xtype: 'button',
                  text: '编辑',
                  disabled: true,
                  action: 'edit-teacher',
                  icon: 'static/img/icon-edit.png'
              }, "-", {
                  xtype: 'button',
                  text: '课程',
                  disabled: true,
                  action: 'register-course',
                  icon: 'static/img/icon-course.png'
              }]
          }, {
              xtype: 'pagingtoolbar',
              store: me.store,
              // same store GridPanel is using
              dock: 'bottom',
              displayInfo: true
          }];
          this.callParent(arguments);
      }
  });