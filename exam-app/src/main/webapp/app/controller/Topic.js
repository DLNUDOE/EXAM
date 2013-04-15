/**
 * @class Exam.controller.Topic
 * @controller
 * used for controlling the Topic management of navigation tree
 */
Ext.define('Exam.controller.Topic', {
	extend: 'Ext.app.Controller',
	stores: ["TopicBank", "CollegeSelections"],
	models: [],
	requires: ["Exam.lib.util.LocalPaperUtil"],
	refs: [{
		ref: 'tabTopicBank',
		selector: 'tabtopicbank'
	},{
		ref: 'tabTopicAdder',
		selector: 'tabtopic'
	},{
		ref: 'buttonA4Cart',
		selector: 'tabtopicbank #btnA4Cart'
	}],
	requires: [
        "Exam.view.tab.TopicAdder" ,
         "Exam.view.tab.TopicBank" 
    ],
	init: function() {},
	onLaunch: function() {
		var me = this;
		/**
		 * control the item and distribute event by the source element
		 */
		this.control("maincenter tabtopicbank dataview", {
			afterrender: function(panel, eOpts) {
				debugger;
				panel.getStore().load({
					param: {
						type: 1,
						courseid:-1,
						key:''
					},
					trigger: true
				});
			} 
		});
		this.getTopicBankStore().on({
			beforeload: function(store, operation, eOpts) {
				debugger;
				 var panel = me.getTabTopicBank();
				if (operation.trigger) {
					panel.setTemplate(1);
					store.proxy.extraParams = operation.param;
				} else {
						var comboField  = panel.down("cmntopictypelist combobox"),
						type = comboField.getValue(),
						courseField=comboField.nextNode(),
						courseid=courseField.getValue(),
						key=courseField.nextNode().getValue();
						panel.setTemplate(type);
					var param = { 
						type:type,
						courseid:courseid,						
						key: Ext.String.trim(key)
					};
					store.proxy.extraParams = param;
				}
			},
			load: function(store, records, successful, eOpts) {
				 
			}
		});
		this.control('tabtopicbank dataview', {
			itemclick: me.dispatchEvent
		});
		this.control("tabtopicbank #btnA4Cart",{
			click:function( button  ,   e,   eOpts ){
				  var me=this;
				 var panel=me.getTabTopicBank();
				    if(localStorage.getItem('courseid')!=null || localStorage.getItem('examid')!=null){
				    var total=localStorage.length-1;
				    }
				    if(localStorage.getItem('courseid')!=null && localStorage.getItem('examid')!=null){
		    		var total=localStorage.length-2;
		    		}else{
				    var total=localStorage.length;
					}
				 	button.setText(panel.showCountUI(total));
			}
		});
		this.control("maincenter tabtopicbank button[action=query]", {
			click: me.onQueryTopic
		});
		this.control("tabtopicbank #btnA4Cart menu button[action=btn-a4cart-destroy]",{
			click:function( button  ,   e,   eOpts ){
				Exam.lib.util.LocalPaperUtil.clear();
				me.getButtonA4Cart().setText('+(0)');
			}
		});
	},
	dispatchEvent: function(view, record, item, index, e, eOpts) {
		 debugger;
		var data = record.getData(),
			target = e.target,
			operation = target.getAttribute('data-op');
		if(operation == 'edit') {
			this.doItemEdit(data);
		} else if(operation == 'delete') {
			this.doItemDelete(data);
		} else if(operation == 'add-to-a4') {
			this.doItemToA4Cart(data, target);
		}else if(operation == 'delete-1') {
			this.doItemRemoveA4Cart(data, target);
		}
		e.preventDefault();
	},
	onQueryTopic: function(button, e, eOptons) {
		debugger;
		var comboFieldList = button.ownerCt.query("combobox"),
			typeField = comboFieldList[0],
			courseField = comboFieldList[1],
			type = typeField.getRawValue(),
			typeid = typeField.getValue(),
			course = courseField.getRawValue(),
			courseid = courseField.getValue(),
			key = button.previousSibling().getValue();
		var param = {
			type:typeid,
			courseid:courseid,						
			key: Ext.String.trim(key)
		};
		button.nextNode().getStore().load({
			param: param,
			trigger: true
		});
	},
	doItemEdit: function(data) {
		Ext.Ajax.request({
			url: 'topic/edit',
			params: {
				id: data.id
			},
			success: function(res) {
				 
				Ext.Msg.alert('提示', "成功!");
			},
			failure: function(req, res) {
				 
			}
		});
	},
	doItemDelete: function(data) {
		Ext.Ajax.request({
			url: 'topic/edit',
			params: {
				id: data.id
			},
			success: function(res) {
				 
				Ext.Msg.Alert('提示', "成功!");
			},
			failure: function(req, res) {
				 
			}
		});
	},
	doItemToA4Cart: function(data, target) {
		var me=this;
		  var panel=me.getTabTopicBank();
		if(localTopic.addItem(data)==true) {
			//Ext.Msg.alert('提示', "已加入~");
			
			//var clsName=target.className;
			//target.className=clsName.replace('add-to-a4','added-to-a4');
			 debugger;
			var footer=Ext.get(target).findParent('.topic-item-footer'),
			item=Ext.get(target).findParent(".topic-item");
			Ext.get(footer).child(".adder").remove();
			Ext.get(footer).insertHtml("beforeEnd",panel.showAdderA4UI(true));
			   if(localStorage.getItem('courseid')!=null || localStorage.getItem('examid')!=null){
			   var total=localStorage.length-1;
			    }
			    if(localStorage.getItem('courseid')!=null && localStorage.getItem('examid')!=null){
		    	var total=localStorage.length-2;
		    	}else{
			   		var total=localStorage.length;
				}
			 	var targetX=Ext.get(item).getLeft(),
			    targetY=Ext.get(item).getTop(),
				buttonA4Cart=me.getButtonA4Cart();
				buttonA4Cart.setText(panel.showCountUI(total));
				toPos=buttonA4Cart.getPosition();

 			var domParser=null,html='',div=document.createElement('div');
 			 div.innerHTML='';
 			 
 			 div.appendChild(item.cloneNode(true));
			var transfor=Ext.create('Ext.Component', {
				 
			    html:div.innerHTML,
			  	width:Ext.get(item).getWidth(),
		    	height: Ext.get(item).getHeight(),	
		    	floating:true,		     			   
			    renderTo: Ext.getBody()
			});
			transfor.showAt(targetX,targetY);
			transfor.animate({to:{left:toPos[0],top:toPos[1],width:200,height:100,opacity:0.4},easing:'easeInOut',duration:800,callback:function(i,j){				 
				transfor.destroy();				
			}});
		 
		} else {
			var footer=Ext.get(target).findParent('.topic-item-footer'),
			item=Ext.get(target).findParent(".topic-item");
			Ext.get(footer).child(".adder").remove();
			Ext.get(footer).insertHtml("beforeEnd",panel.showAdderA4UI(true));
			Ext.Msg.alert('提示', "已在试卷中!");
		}
	},
	doItemRemoveA4Cart: function(data, target) {
		 var me=this;
		 var panel=me.getTabTopicBank();

        localTopic.removeItem(data.id);
        	debugger;
		    if(localStorage.getItem('courseid')!=null || localStorage.getItem('examid')!=null){
		    var total=localStorage.length-1;
		    }
		    if(localStorage.getItem('courseid')!=null && localStorage.getItem('examid')!=null){
		    	var total=localStorage.length-2;
		    }else{
		  var total=localStorage.length;
		}
        	var footer=Ext.get(target).findParent('.topic-item-footer'),
			item=Ext.get(target).findParent(".topic-item");
			Ext.get(footer).child(".adder").remove();
			Ext.get(footer).insertHtml("beforeEnd",panel.showAdderA4UI(false));
			buttonA4Cart=me.getButtonA4Cart();
			buttonA4Cart.setText(panel.showCountUI(total));
	}
});
