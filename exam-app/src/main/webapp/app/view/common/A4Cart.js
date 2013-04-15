Ext.define('Exam.view.common.A4Cart', {   
    extend:'Ext.Component', 
    xtype:'cmna4cart',
    floating:true,
    renderTo:Ext.getBody(),    
    width:500,
    height:'auto',
    style:{
        background:'#fff',
        zIndex:'999999'
    },   
    tpl:new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="mod-tag-wrapper">',
                '<div class="mod-tag-body" >',
                    '<div class="tag-item-list" >',
                        '<div class="tag-item" data-id="{id}">',
                            '<span class="tag-name">{text}</span>',
                            '<a href="#" title="删除" class="tag-close"  >×</a>',
                        '</div>',                                
                    '</div>',
                    '<input id="tagInput" placeholder="添加标签，以逗号或回车隔开" class="tag-cursor"  type="text" autocomplete="off" />',
                '</div>',
           '</div>',
           '</tpl>'), 
    initComponent:function(){
        //this.addEvents('click');
       var me=this;
    
        me.listeners={
            click:{
                fn:function(i,j,k){
                    
                },
                element:'el'
            },
            mousemove:{
              fn:function(evt,ele,eOpts){
                    
                },
                element:'el'  
            }
        };
        debugger;
        me.renderTpl.overwrite(me.el, me.items);
    	this.callParent(arguments);
    } ,
    onRender:function(cmp,   eOpts ){
        debugger;
    },
    items:[
        {text:'test',id:12},
        {text:'test2',id:1222}
    ] 
});