Ext.define('Exam.controller.Exam', {
	extend: 'Ext.app.Controller',
	stores: ["ExamList"],
	models: ["ExamList"],
	refs: [{
		ref: 'tabExamList',
		selector: 'tabexamlist'
	}, {
		ref: 'tabExamWizard',
		selector: 'tabexawizard'
	}],
	requires: ["Exam.view.tab.ExamList", "Exam.view.tab.ExamWizard", "Exam.view.dialog.PaperList"],
	init: function() {
		/*xtype examwizard*/
		var me=this;
		this.control("maincenter tabexamwizard button[action=select-paper]", {
			click:function(button,eOpts){
				debugger;
				Ext.create('Exam.view.dialog.PaperList',{
					title:'选择试卷',
					targetView:button.up('form')
				});
			}
		});
		this.control("maincenter tabexamwizard button[action=select-iproom]", {
			click:function(button,eOpts){
				Ext.create('Exam.view.dialog.IPRoom',{
					title:'选择考试机房',
					targetView:button.up('form')
				});
			}
		});
		/*xtype tabexamlist*/
		this.control("maincenter tabexamlist", {
			afterrender: function(panel, eOpts) {
			debugger;				 
				panel.getStore().load({
					param: {
						courseid: -1,
						key: ''
					},
					trigger: true
				});
			} 
		});	
		this.control("maincenter tabexamlist button[action=query]", {
			click: me.onQueryExamlist
		});
		this.getExamListStore().on({
			beforeload: function(store, operation, eOpts) {
				if (operation.trigger) {
					store.proxy.extraParams = operation.param;
				} else {
					var panel = me.getTabExamList(),
					    courseid=panel.down("toolbar combobox[name=courseid]").getValue(),
						key = panel.down("toolbar textfield[action=key]").getValue();
					var param = {
						courseid:courseid,
						key: Ext.String.trim(key)
					};
					store.proxy.extraParams = param;
				}
			},
			load: function(store, records, successful, eOpts) {

			}
		}); 

	},
	onQueryExamlist: function(button, event, eOpts) {

		var queryFiled = button.previousNode(),
		param = {};
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