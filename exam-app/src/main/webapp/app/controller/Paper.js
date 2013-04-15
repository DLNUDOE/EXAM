Ext.define('Exam.controller.Paper', {
	extend: 'Ext.app.Controller',
	stores: ["PaperList","PaperROList"],
	models: ["PaperList","ReadOverlist"],	
	refs: [{
		ref: 'tabPaperreadover',
		selector: 'tabpaperreadover'
	},{
		ref: 'tabPaperList',
		selector: 'tabpaperlist'
	},{
		ref: 'tabPaper',
		selector: 'tabpaper'
	}],
	requires: ["Exam.view.tab.PaperList","Exam.view.tab.Paper","Exam.view.tab.PaperROList"],
	init: function(){
		var me=this;
		this.control("maincenter tabpaperreadover", {
			afterrender: function(panel, eOpts) {	
			debugger;			 
				panel.getStore().load({
					param: {
						/*collegeid: -1,
						key: ''*/
						page: 1,
						limit: 10000
					},
					trigger: true
				});
			} 
		});	
		this.control("maincenter tabpaperreadover button[action=button-query]", {
			click: this.onQueryPaperROList
		});
		this.getPaperROListStore().on({
			beforeload: function(store, operation, eOpts) {
					debugger;
					var panel = me.getTabPaperreadover(),
					    courseid=panel.down("toolbar combobox[name=courseid]").getValue(),
						key = panel.down("toolbar textfield[action=key]").getValue();
						page = operation.page;
					var param = {
						page: page,
						limit: 20,
						courseid:courseid,
						key: Ext.String.trim(key)
					};
					store.proxy.extraParams = param;
				},
		
			load: function(store, records, successful, eOpts) {

			}
		});
	},
	onQueryPaperROList: function(button, event, eOpts) {
		debugger;
		var queryFiled = button.previousNode(),
		param = {};
		param.page = 1;
		param.limit=20;
		param.key = queryFiled.getValue();
		param.courseid = queryFiled.previousNode().getValue() || -1;
		button.up('grid').getStore().load({
			param: param,
			trigger: true
		});
	},
	onLaunch: function() {

	}
});
