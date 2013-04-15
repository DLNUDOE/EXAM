 /**
  * @Exam.view.tab.Person
  * @view
  * a tab for show Person information
  */
 Ext.define("Exam.view.tab.Person", {
     extend: "Ext.form.Panel",
     xtype: "tabperson",   
     html:'sayowurala',
     initComponent: function() {
         var me = this;

          
         this.callParent(arguments);
     }
 });