/**
 * @class Exam.controller.View
 * @controller
 * used for controlling the  navigation tree whose item is clicked to show a tab
 */
Ext.define('Exam.controller.View', {
	extend: 'Ext.app.Controller',
	stores: ["Navigations", "Host"],
	models: ["Navigation"],
	refs: [{
		ref: 'navigation',
		selector: 'navigation'
	}, {
		ref: 'banner',
		selector: 'banner'
	}, {
		ref: 'mainCenter',
		selector: 'maincenter'
	}],
	requires: ["Exam.lib.Util"],
	init: function() {
		var me = this;
		this.control('navigation', {
			itemclick: me.showTabPanel
		});


	},
	showTabPanel: function(view, record, item, index, e, eOpts) {

		if (record.get("leaf") == false) {
			return;
		}
		 debugger;
		var title = record.get("text"),
			xtype = record.get("xtype"),
			mainCenter = this.getMainCenter(),
			targetPanel = mainCenter.down(xtype);
		if ( !! targetPanel) {
			mainCenter.setActiveTab(targetPanel);
			return;
		}
		 
		newPanel = this.getMainCenter().add({
			xtype: xtype,
			title: title
		});
		mainCenter.setActiveTab(newPanel);

	},
	onLaunch: function() { 
	}
});