Ext.define('Exam.controller.Common', {
	extend: 'Ext.app.Controller',
	stores: ["CollegeSelections"],
	//models: ["College" ],
	//requires: ["Exam.lib.util.TreeUtil"],
	refs: [{
		ref: 'commonCollegeSelectionlist',
		selector: 'commoncollegeselectionlist'
	}],
	init: function() { 
	},
	onLaunch: function() {
		//this.control('commoncollegeselectionlist')
	}
});