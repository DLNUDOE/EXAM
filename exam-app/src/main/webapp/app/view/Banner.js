/**
 * The application header displayed at the top of the viewport
 * @Ext.panel.Panel
 * sometimes Ext framework has some limiations: alias like widget.header is not admitted,never,so 
 * Header is replaced by Banner
 */
Ext.define("Exam.view.Banner",{
	extend:"Ext.panel.Panel",	 
	contentEl:"content-banner",
	height:72,
	xtype:"banner",	
	region:"north",	
	bodyCls:'mod-banner',	
	initComponent:function(){
		var html=[
			""
		];
		 
		Ext.apply(this,{
			listeners:{
				click:function(){
					alert(1);
				},
				afterrender:function( cmp,   eOpts ){
					//debugger;
					cmp.addEvents({
					    click: function(){
					alert(1);
				},
					    dblclick: true
					});
				}
			}
		});
		this.callParent(arguments);
	}

});