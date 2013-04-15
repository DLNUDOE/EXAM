Ext.define('Exam.controller.Monitor', {
	extend: 'Ext.app.Controller',
	stores: ["Monitor"],
	models: ["Monitor"],	
	refs: [{
		ref: 'formMonitor',
		selector: 'formmonitor'
	},{
		ref: 'tabMonitor',
		selector: 'tabmonitor'
	}],
	requires: ["Exam.view.tab.Monitor"],
	init: function(){
		this.control("maincenter formmonitor", {
			afterrender: function(panel, eOpts) {	
			debugger;			 
				panel.getStore().load({
					param: {
						/*collegeid: -1,
						key: ''*/
						page: 1,

						limit: 100
					},
					trigger: true
				});
			} 
		});	
		this.getMonitorStore().on({
			beforeload: function(store, operation, eOpts) {
				if (operation.trigger) {
					store.proxy.extraParams = operation.param;
				} else {
					debugger;
					var panel = this.getFormMonitor(),
					    collegeid=panel.down("toolbar combobox[name=collegeid]").getValue(),
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
	onLaunch: function() {

	}
});
