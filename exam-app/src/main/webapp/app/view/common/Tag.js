Ext.define('Exam.view.common.Tag', {
    extend: 'Ext.view.View',
    xtype: 'cmntag',
    height: 'auto',

    itemSelector: 'div.tag-item',
    tpl: ['<div class="mod-tag-wrapper">', '<div class="mod-tag-body" >', '<div class="tag-item-list" >', '<tpl for=".">', '<div class="tag-item" data-id="{id}">', '<span class="tag-name">{name}</span>', '<a href="#" title="删除" class="tag-close"  >×</a>', '</div>', '</tpl>', '</div>', '<input   placeholder="添加标签，以逗号或回车隔开" class="tag-cursor"  type="text" autocomplete="off" />', '</div>', '</div>'],
    initComponent: function() {
        //this.addEvents('click');
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            data: [{
                id: '1',
                name: '知识点一'
            }, {
                id: '331',
                name: '知识点二'
            }, {
                id: '21',
                name: '知识点三知识点三知识点三知识点三'
            }],
            fields: ['id', 'name'],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        });
        me.listeners = {
            click: {
                fn: function(i, j, k) {

                },
                element: 'el'
            },
            mousemove: {
                fn: function(evt, ele, eOpts) {

                },
                element: 'el'
            }
        };

        this.callParent(arguments);
    },
    setStoreData: function(list) {
        //me.store.load
    }
});