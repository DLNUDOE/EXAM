/**
 * @class Exam.lib.LocalPaper
 * this is class for local paper item add ,delete, query, stasitics
 * the record item structure is :
 * {
 * 	 id:'ext-localstorage-id',type:'question type such as radio,checkbox,judge,blank,subject',
 * 	 type:'radio'
 * 	 topic:{//topic is an item of paper
 * 	 	id:1
 * 	 	desc:'descript of topic',
 * 	 	answer:'A'，
 * 	 	options:[{},{}]
 * 	 }
 * }
 */
Ext.define('Exam.model.LocalPaper', {
	fields: ['id', 'topic', 'type'],
	extend: 'Ext.data.Model',
	proxy: {
		type: 'localstorage',
		id: 'exam-local-paper'
	} 
});

