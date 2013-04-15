Ext.define("Exam.view.tab.TopicBank", {
    extend: "Ext.panel.Panel",
    xtype: "tabtopicbank",
    store: 'TopicBank',
    layout: 'fit',
    requires: ["Ext.view.View", "Ext.toolbar.Paging", "Exam.view.common.TopicTypeList"],
    initComponent: function() {
        var me = this;
        var isShowOp = true;
        me.tplMap = [ '<tpl for="."><div class="topic-item"><div class="topic-item-header"><span class="topic-item-id">{id}.</span><div class="topic-item-operation"><span class="topic-item-edit" data-op="edit">✎编辑</span><span class="topic-item-delete" data-op="delete">×删除</span></div></div> <div class="topic-item-body"><div class="topic-item-desc">{[values.stem.title]}</div><ul class="topic-item-options"><tpl for="stem.option"><li><label>{[String.fromCharCode(64+xindex)]}.</label><span>{[values]}</span></li></tpl></ul>        </div><div class="topic-item-footer"><span>参考答案：{answer}</span>{[this.showAdderA4UI(false,values.id)]}</div></div></tpl>', '<tpl for="."><div class="topic-item"><div class="topic-item-header"><span class="topic-item-id">{id}.</span><div class="topic-item-operation"><span class="topic-item-edit" data-op="edit">✎编辑</span><span class="topic-item-delete" data-op="delete">×删除</span></div></div>  <div class="topic-item-body"><div class="topic-item-desc">{[values.stem.title]}</div><ul class="topic-item-options"><tpl for="stem.option"><li><label>{[String.fromCharCode(64+xindex)]}.</label><span>{[values]}</span></li></tpl></ul>        </div><div class="topic-item-footer"><span>参考答案：{answer}</span>{[this.showAdderA4UI(false,values.id)]}</div></div></tpl>', '<tpl for="."><div class="topic-item"><div class="topic-item-header"><span class="topic-item-id">{id}.</span><div class="topic-item-operation"><span class="topic-item-edit">✎编辑</span><span class="topic-item-delete">×删除</span></div></div><div class="topic-item-body"><div class="topic-item-desc">{[values.stem.title]}</div>             </div><div class="topic-item-footer">       <span>参考答案：<tpl for="answer"><span class="blank-asw-item">{.}</span>                    </tpl></span>{[this.showAdderA4UI(false,values.id)]}</div></div></tpl>', '<tpl for="."><div class="topic-item"><div class="topic-item-header"><span class="topic-item-id">{id}.</span><div class="topic-item-operation"><span class="topic-item-edit">✎编辑</span><span class="topic-item-delete">×删除</span></div></div><div class="topic-item-body"><div class="topic-item-desc">{[values.stem.title]}</div><ul class="topic-item-options"><li><label  >√ </label><span>正确</span></li><li><label  >× </label><span>错误</span></li>          </ul>       </div><div class="topic-item-footer"><span>参考答案：{answer}</span>{[this.showAdderA4UI(false,values.id)]}</div></div></tpl>', '<tpl for="."><div class="topic-item"><div class="topic-item-header"><span class="topic-item-id">{id}.</span><div class="topic-item-operation"><span class="topic-item-edit">✎编辑</span><span class="topic-item-delete">×删除</span></div></div><div class="topic-item-body"><div class="topic-item-desc">{[values.stem.title]}</div><div class=\'subject-std-answer\'><span>参考答案:</span><div>{answer}</div></div>            </div><div class="topic-item-footer">{[this.showAdderA4UI(false,values.id)]}</div></div></tpl>', "" ];
        var itemTpl =  me.tplMap[1];
        var frameUrl = "remote=0&id=" + eUserInfo.id + "&name=" + encodeURIComponent(eUserInfo.name);
        var total = localStorage.length;
        this.items = [{
            xtype: 'dataview',
            tpl: itemTpl,
            overflowY: 'auto',
            store: me.store,
            itemSelector: '.topic-item'
        }];
        this.dockedItems = [{
            xtype: 'cmntopictypelist',
            dock: "top"
        }, {
            xtype: 'pagingtoolbar',
            store: me.store,
            // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true,
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                id: 'btnA4Cart',
                text: me.showCountUI(total),
                menu: {
                    items: [{
                        xtype: 'button',
                        text: '查看A4纸',
                        href: 'static/module/paper/paper.bk.html?' + frameUrl,
                        targe: '_blank'
                    }, {
                        xtype: 'button',
                        text: '删除A4纸',
                        action: 'destroy'
                    }]
                }
            }]
        }];
        this.callParent(arguments);
    },

    setTemplate: function(type) {
        debugger;
        var me = this,
            index = parseInt(type-1);
        
         var itemTpl = new Ext.XTemplate(me.tplMap[index], {
            showAdderA4UI: me.showAdderA4UI
        });
        me.down('dataview').tpl=itemTpl;         
    },
    checkItemInPaper: function(item) {
       
        debugger;
        var flag = localTopic.isExisted(item.id);
        debugger;
        if (flag) {
            return '<a href="#" class="added-to-a4" data-opertaion="add-a4cart">√已在试卷中</a>'
        } else {
            return '<a href="#" class="add-to-a4" data-opertaion="add-a4cart">添加到A4纸</a>'
        }
    },
    renderItemRating: function(item) {
        /*var ratingMap=[
            '<span class="rating-stars">★☆☆☆☆</span>',
            '<span class="rating-stars">★★☆☆☆</span>',
            '<span class="rating-stars">★★★☆☆</span>',
            '<span class="rating-stars">★★★★☆</span>',
            '<span class="rating-stars">★★★★★</span>'
        ];
        return ratingMap[item.rating-1]||ratingMap[0];
        */
        return "";
    },
    renderDesc: function(item) {

        return "dsfdfs";
    },
    renderOptions: function(item) {
        return "";
    },
    showCountUI: function(count) {
        if (count == 0) {
            return "<span >暂无记录</span>"
        } else {
            return "<span style='color:orange'>共 (" + count + ") 个记录</span>"
        }
    },
    showAdderA4UI: function(added, id) {
        var eUI = ['<a href="#" class="added-to-a4 boots-bubtton adder" ><i></i>已添加到A4纸<i title="从A4删除" class="delete-from-a4" data-op="delete-1"></i></a>',
            '<a href="#" class="add-to-a4 boots-bubtton  adder" data-op="add-to-a4"><i  data-op="add-to-a4"></i>添加到A4纸</a>'];
        if (id) {
            var me = this;
            if (localTopic.isExisted(id)) {
                return eUI[0]
            } else {
                return eUI[1];
            }
        }
        if (added) {
            return eUI[0]
        } else {
            return eUI[1];
        }
    }
});