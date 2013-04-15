  /**
  * @Exam.view.tab.IPRoom
  * @view
  * a tab for show IPRoom information
  */
  Ext.define("Exam.view.tab.IPRoom", {
    extend: "Ext.grid.Panel",
    xtype: "tabiproom",
    store: "IPRooms",
    multiSelect:true,
    columns: [{
        text: 'ID',
        dataIndex: 'id'
    }, {
        text: '机房名',
        dataIndex: 'name',
         flex:1
    }, {
        text: 'IP范围',
        dataIndex: 'iprange',
        flex:1
    }, {
        text: '容量',
        dataIndex: 'capacity',
        flex:1
    }],
    initComponent: function() {
        var me = this;
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype:'textfield',
                emptyText:'搜索关键词',
                action:"key"
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
                action:'add-iproom',
                icon: 'static/img/icon-add.png',
                handler: function() {

                }
            }, "-",
            {
                xtype: 'button',
                text: '删除',
                disabled:true,
                action:'delete-iproom',
                icon: 'static/img/icon-delete.png',
                handler: function() {

                }
            }, "-",
            {
                xtype: 'button',
                text: '编辑',
                disabled:true,
                action:'edit-iproom',
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