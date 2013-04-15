Ext.define('Exam.view.Viewport', {
	extend: 'Ext.container.Viewport',
	layout: 'border',
	requires: [
		"Exam.view.Navigation",
		"Exam.view.MainCenter" ,
		"Exam.view.Banner"
		],
	items: [
	{
		xtype:"banner"
	},	 
	{
		xtype: 'maincenter'
	}, {
		xtype: 'navigation'
	}]
});