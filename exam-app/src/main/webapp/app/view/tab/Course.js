  /**
  * @Exam.view.tab.Course
  * @view
  * a tab for show Course information
  */
 Ext.define("Exam.view.tab.Course", {
    extend: "Ext.grid.Panel",
    xtype: "tabcourse",
    store: "Courses",
    multiSelect:true,
    columns: [{
        text: 'ID',
        dataIndex: 'id'
    }, {
        text: '课程名',
        dataIndex: 'name' 
    }, {
        text: '所属学院',
        dataIndex: 'college',
        flex: 1 
    }, {
        text: '选修学院',
        dataIndex: 'subcollege',
        flex: 1 
    },{
        text: '状态',
        dataIndex: 'active',        
        renderer: function(active) {           
            return active==1?"可见":"隐藏";
        }
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
              },{
                xtype:'textfield',
                action:"key",
                emptyText:'搜索关键词'
            },{
                xtype:'button',
                text:'搜索',
                //scale:'medium',
                action:"query",
                style:'border:1px solid #A1A1A1',
                icon:'static/img/search.png',
                iconAlign:'right' 
                    
            }, {xtype:'tbfill'},{
                xtype: 'button',
                text: '添加',
                action:'add-course',
                icon: 'static/img/icon-add.png',
                handler: function() {

                }
            }, "-",
            {
                xtype: 'button',
                text: '删除',
                disabled:true,
                action:'delete-course',
                icon: 'static/img/icon-delete.png',
                handler: function() {

                }
            }, "-",
            {
                xtype: 'button',
                text: '编辑',
                disabled:true,
                action:'edit-course',
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
        this.callParent(arguments);
    }
 });