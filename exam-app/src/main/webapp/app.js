Ext.Loader.setConfig({
	enabled:true
});
Ext.Loader.setPath('Ext.ux', '../../extjs/examples/ux/');
Ext.application({     
    name: 'Exam',
    paths:['/exam/'],
    controllers:["View","Information","Topic","Exam","Paper","Monitor"],
    autoCreateViewport:true,
   //	requires:["Exam.lib.Singleton"],
    //requires:["Exam.view.Header","Exam.view.MainCenter","Exam.view.Navigation"],/*controller will help to load the views*/
    launch: function() {
 		    
    }
});

