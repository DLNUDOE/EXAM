/**
 * @class Exam.controller.Information
 * @controller
 * used for controlling the information management of navigation tree
 */
Ext.define('Exam.controller.Information', {
	extend: 'Ext.app.Controller',
	stores: ["Colleges", "Teachers", "CollegeSelections", "Students", "IPRooms", "Courses","PaperList","ExamStudent"],
	models: ["College", "Teacher", "Student", "IPRoom", "Course","PaperList","ExamStudent"],
	refs: [{
		ref: 'tabCollege',
		selector: 'tabcollege'
	}, {
		ref: 'tabTeacher',
		selector: 'tabteacher'
	}, {
		ref: 'tabStudent',
		selector: 'tabstudent'
	}, {
		ref: 'tabCourse',
		selector: 'tabcourse'
	}, {
		ref: 'tabIPRoom',
		selector: 'tabiproom'
	}, {
		ref: 'tabUser',
		selector: 'tabuser'
	},{
		ref:'tabPaperlist',
		selector:'tabpaperlist'
	},{
		ref:'tabExamstudent',
		selector:'tabexamstudent'
	}],
	requires: [		 
		"Exam.view.tab.College",
		"Exam.view.tab.Teacher",
		"Exam.view.tab.Student",
		"Exam.view.tab.IPRoom",
		"Exam.view.tab.Course",
		"Exam.view.tab.User",
		"Exam.view.tab.PaperList",
		 ],
	init: function() {
		var me = this;
		/**
		 *control xtype tabcollege
		 */
		this.control("maincenter tabcollege", {
			itemclick: function(view, record, item, index, e, eOpts) {
				var depth = record.getDepth();
				switch (depth) {
					case 1:
						view.up('tabcollege').down('toolbar > button[action=add-major]').setDisabled(false);
						view.up('tabcollege').down('toolbar > button[action=add-grade]').setDisabled(true);
						break;
					case 2:
						view.up('tabcollege').down('toolbar > button[action=add-major]').setDisabled(true);
						view.up('tabcollege').down('toolbar > button[action=add-grade]').setDisabled(false);
						break;
					case 3:
						view.up('tabcollege').down('toolbar > button[action=add-major]').setDisabled(true);
						view.up('tabcollege').down('toolbar > button[action=add-grade]').setDisabled(true);
						break;
					default:
						break;
				}

				var depth = record.getDepth(),
					typeMap = ["college", "major", "class"];
				var recordData = {};
				if (depth == 1) {
					recordData.collegeid = record.get("cid");
					recordData.college = record.get("name");
				} else if (depth == 2) {
					recordData.collegeid = record.parentNode.get("id");
					recordData.college = record.parentNode.get("name");

					recordData.majorid = record.get("cid");
					recordData.major = record.get("name");
				}
				if (!record.isLeaf() && !record.isDataLoaded) {
					var url = typeMap[depth] + "/list";
					Ext.Ajax.request({
						url: eDomain.getURL(url),
						method: "get",
						type: "json",
						params: recordData,
						success: function(res) {
						 
							var rs = Ext.JSON.decode(res.responseText);
							if (!rs.success) {
								alert(rs.msg);
								return false;
							}
							record.isDataLoaded = true;
							var list = rs.data;
							if (list.length == 0) {
								return;
							}
							record.appendChild(list);

							record.expand(true);
						},
						failure: function(response, options) {

						}
					});
				}

			}
		});
		this.control("maincenter > tabcollege > toolbar >button[action=add-college]", {
			click: me.onAddCollege
		});
		this.control("maincenter > tabcollege > toolbar >button[action=add-major]", {
			click: me.onAddMajor
		});
		this.control("maincenter > tabcollege > toolbar >button[action=add-grade]", {
			click: me.onAddGrade
		});

		/**
		 *control xtype tabteacher
		 */
		
		this.control("maincenter tabteacher", {
			afterrender: function(panel, eOpts) {
				 
				panel.getStore().load({
					param: {
						collegeid: -1,
						key: ''
					},
					trigger: true
				});
			},
			itemclick: function(view, record, item, index, e, eOpts) {

				var selCount = view.getSelectionModel().getSelection().length;
				if (selCount == 1) {
					var buttonList = view.up('gridpanel').query('button[action=delete-teacher],button[action=edit-teacher],button[action=register-course],button[action=manage-auth]');
					Ext.each(buttonList, function(item, index) {
						item.enable(true);
					});
				} else if (selCount >= 2 || selCount == 0) {
					!selCount && view.up('gridpanel').query('button[action=delete-teacher]').disable(true);
					var buttonList = view.up('gridpanel').query('button[action=edit-teacher],button[action=register-course],button[action=manage-auth]');
					Ext.each(buttonList, function(item, index) {
						item.disable(true);
					});
				}
			}
		});
		this.control("maincenter > tabteacher >combobox", {
			render: function(panel, eOpts) {
				panel.down('combobox').setValue(-1);
			}
		});

		this.control("maincenter > tabteacher  button[action=add-teacher]", {
			click: me.onAddTeacher
		});
		this.control("maincenter > tabteacher  button[action=edit-teacher]", {
			click: me.onEditTeacher
		});
		this.control("maincenter > tabteacher  button[action=edit-teacher]", {
			click: me.onDelTeacher
		});
		this.control("maincenter tabteacher button[action=register-course]", {
			click: me.onRegTeacherCourse
		});
		this.control("maincenter tabteacher button[action=button-query]", {
			click: me.onQueryTeacher
		});

		this.control("maincenter > tabteacher  button[action=delete-teacher]", {
			click: function(button, e, eOptons) {
				var randText = 'yes';
				Ext.Msg.prompt('系统要求输入以便核实', '请输入' + randText, function(btn, text) {
					if (btn == 'ok') {
						if (randText != text) {
							Ext.Msg.alert('提示', '不合法输入');
							return;
						}
						Ext.Msg.alert('提示', '删除成功');
					}
				});

			}
		});
		this.getTeachersStore().on({
			beforeload: function(store, operation, eOpts) {
			 
				if (operation.trigger) {
					store.proxy.extraParams = operation.param;
				} else {
					debugger;
					var panel = me.getTabTeacher(),
						clgCombo = panel.down('combobox'),
						collegeid = clgCombo.getValue(),
						college = clgCombo.getRawValue(),
						query = panel.down('textfield[name=query]').getValue(),
						page = operation.page,
						limit = operation.limit;

					var param = {
						collegeid: collegeid,
						college: college,
						key: query,
						page: page,
						limit: limit
					};
					store.proxy.extraParams = param;
				}
			},
			load: function(store, records, successful, eOpts) {

			}
		});


		/**
		 * control xtype tabstudent
		 */
		this.control("maincenter > tabstudent", {
			render: function(panel, eOpts) {
				debugger;
				panel.getStore().load({
					param: {
						collegeid: -1,
						majorid: -1,
						classid: -1,
						key: ''
					},
					trigger: true
				});
			},
			itemclick: function(view, record, item, index, e, eOpts) {

				var selCount = view.getSelectionModel().getSelection().length;
				if (selCount == 1) {
					var buttonList = view.up('gridpanel').query('button[action=delete-student],button[action=edit-student]');
					Ext.each(buttonList, function(item, index) {
						item.enable(true);
					});
				} else if (selCount >= 2 || selCount == 0) {
					!selCount && view.up('gridpanel').query('button[action=delete-student]').disable(true);
					var buttonList = view.up('gridpanel').query('button[action=edit-student],button[action=register-course],button[action=manage-auth]');
					Ext.each(buttonList, function(item, index) {
						item.disable(true);
					});
				}
			}
		});

		this.control("maincenter tabstudent button[action=add-student]", {
			click: me.onAddStudent
		});
		this.control("maincenter tabstudent button[action=edit-student]", {
			click: me.onEditStudent
		});
		this.control("maincenter tabstudent button[action=edit-student]", {
			click: me.onDelStudent
		});
		this.control("maincenter tabstudent button[action=query]", {
			click: me.onQueryStudent
		});
		this.control("maincenter tabstudent button[action=add-batch]", {
			click: me.onAddStudentExcel
		});
		this.getStudentsStore().on({
			beforeload: function(store, operation, eOpts) {

				if (operation.trigger) {
					store.proxy.extraParams = operation.param;
				} else {
					var panel = me.getTabStudent(),
						comboFieldList = panel.query("cmncollegeselection combobox"),
						collegeField = comboFieldList[0],
						majorField = comboFieldList[1],
						classField = comboFieldList[2],
						college = collegeField.getRawValue(),
						collegeid = collegeField.getValue(),

						major = majorField.getRawValue(),
						majorid = majorField.getValue(),

						grade = classField.getRawValue(),
						gradeid = classField.getValue(),
						key = panel.down("cmncollegeselection textfield[action=key]").getValue();

					var param = {
						college: college,
						collegeid: collegeid,
						major: major,
						majorid: majorid,
						'class': grade,
						classid: gradeid,
						key: Ext.String.trim(key)
					};
					store.proxy.extraParams = param;
				}
			},
			load: function(store, records, successful, eOpts) {

			}
		});
		/**
		 * control xtype tabexamstudent
		 */
		this.control("maincenter > tabexamstudent", {
			render: function(panel, eOpts) {
				debugger;
				panel.getStore().load({
					param: {
					},
					trigger: true
				});
			},
			itemclick: function(view, record, item, index, e, eOpts) {

				var selCount = view.getSelectionModel().getSelection().length;
				if (selCount == 1) {
					var buttonList = view.up('gridpanel').query('button[action=delete-student],button[action=edit-student]');
					Ext.each(buttonList, function(item, index) {
						item.enable(true);
					});
				} else if (selCount >= 2 || selCount == 0) {
					!selCount && view.up('gridpanel').query('button[action=delete-student]').disable(true);
					var buttonList = view.up('gridpanel').query('button[action=edit-student],button[action=register-course],button[action=manage-auth]');
					Ext.each(buttonList, function(item, index) {
						item.disable(true);
					});
				}
			}
		});

		this.control("maincenter tabexamstudent button[action=add-student]", {
			click: me.onAddStudent
		});
		this.control("maincenter tabexamstudent button[action=edit-student]", {
			click: me.onEditStudent
		});
		this.control("maincenter tabexamstudent button[action=edit-student]", {
			click: me.onDelStudent
		});
		this.control("maincenter tabexamstudent button[action=query]", {
			click: me.onQueryExamStudent
		});
		this.control("maincenter tabexamstudent button[action=add-batch]", {
			click: me.onAddStudentExcel
		});
		this.getExamStudentStore().on({
			beforeload: function(store, operation, eOpts) {
				debugger;
					store.proxy.extraParams = operation.param;
			},
			load: function(store, records, successful, eOpts) {

			}
		});
        /**
		 * control xtype tabpaperlist
		 */
		this.control("maincenter > tabpaperlist",{
			afterrender:function(panel,eOpts){
				debugger;
				panel.getStore().load({
					param:{
						cid: -1,
						key:'',
						page: 1,
						limit: 10000
					},

					trigger:true
				});
			},
			itemclick: function(view, record, item, index, e, eOpts) {

				var selCount = view.getSelectionModel().getSelection().length;
				if (selCount == 1) {
					var buttonList = view.up('gridpanel').query('button[action=delete-paperlist],button[action=edit-paperlist]');
					Ext.each(buttonList, function(item, index) {
						item.enable(true);
					});
				} else if (selCount >= 2 || selCount == 0) {
					!selCount && view.up('gridpanel').query('button[action=delete-paperlist]').disable(true);
					var buttonList = view.up('gridpanel').query('button[action=edit-paperlist]');
					Ext.each(buttonList, function(item, index) {
						item.disable(true);
					});
				}
			}
		});
		this.control("maincenter > tabpaperlist >combobox", {
			render: function(panel, eOpts) {
				panel.down('combobox').setValue(-1);
			}
		});
		this.control("maincenter tabpaperlist button[action=query]", {
			click: me.onQueryPaperlist
		});
		this.getPaperListStore().on({
			beforeload: function(store, operation, eOpts) {
				debugger;
				if (operation.trigger) {
					store.proxy.extraParams = operation.param;
				} else {
					var panel = me.getTabPaperlist(),
						clgCombo = panel.down('combobox'),
						courseid = clgCombo.getValue(),
						key = panel.down("textfield[action=key]").getValue();
						page = operation.page,
						limit = operation.limit;

					var param = {
						cid: courseid,
						key: key,
						page: page,
						limit: limit
					};
					store.proxy.extraParams = param;
				}
			},
			load: function(store, records, successful, eOpts) {

			}
		});
		/**
		 * control xtype tabiproom
		 */
		this.control("maincenter > tabiproom", {
			afterrender: function(panel, eOpts) {
				panel.getStore().load({
					param: {
						key: ''
					},
					trigger: true
				});
			},
			itemclick: function(view, record, item, index, e, eOpts) {

				var selCount = view.getSelectionModel().getSelection().length;
				if (selCount == 1) {
					var buttonList = view.up('gridpanel').query('button[action=delete-iproom],button[action=edit-iproom]');
					Ext.each(buttonList, function(item, index) {
						item.enable(true);
					});
				} else if (selCount >= 2 || selCount == 0) {
					!selCount && view.up('gridpanel').query('button[action=delete-iproom]').disable(true);
					var buttonList = view.up('gridpanel').query('button[action=edit-iproom]');
					Ext.each(buttonList, function(item, index) {
						item.disable(true);
					});
				}
			}
		});
		this.control("maincenter tabiproom button[action=add-iproom]", {
			click: me.onAddIPRoom
		});
		this.control("maincenter tabiproom button[action=edit-iproom]", {
			click: me.onEditIPRoom
		});
		this.control("maincenter tabiproom button[action=delete-iproom]", {
			click: me.onDelIPRoom
		});
		this.control("maincenter tabiproom button[action=query]", {
			click: me.onQueryIPRoom
		});

		this.getIPRoomsStore().on({
			beforeload: function(store, operation, eOpts) {

				if (operation.trigger) {
					store.proxy.extraParams = operation.param;
				} else {
					var panel = me.getTabIPRoom(),

						key = panel.down("textfield[action=key]").getValue();

					var param = {
						key: Ext.String.trim(key)
					};
					store.proxy.extraParams = param;
				}
			},
			load: function(store, records, successful, eOpts) {

			}
		});

		/**
		 * control xtype tabcourse
		 */
		this.control("maincenter > tabcourse", {
			afterrender: function(panel, eOpts) {
				panel.getStore().load({
					param: {
						key: '',
						collegeid: -1
					},
					trigger: true
				});
			},
			itemclick: function(view, record, item, index, e, eOpts) {

				var selCount = view.getSelectionModel().getSelection().length;
				if (selCount == 1) {
					var buttonList = view.up('gridpanel').query('button[action=delete-course],button[action=edit-course]');
					Ext.each(buttonList, function(item, index) {
						item.enable(true);
					});
				} else if (selCount >= 2 || selCount == 0) {
					!selCount && view.up('gridpanel').query('button[action=delete-course]').disable(true);
					var buttonList = view.up('gridpanel').query('button[action=edit-iproom]');
					Ext.each(buttonList, function(item, index) {
						item.disable(true);
					});
				}
			}
		});
		this.control("maincenter tabcourse button[action=add-course]", {
			click: me.onAddCourse
		});
		this.control("maincenter tabcourse button[action=edit-iproom]", {
			click: me.onEditCourse
		});
		this.control("maincenter tabcourse button[action=delete-iproom]", {
			click: me.onDelCourse
		});
		this.control("maincenter tabcourse button[action=query]", {
			click: me.onQueryCourse
		});
		this.getCoursesStore().on({
			beforeload: function(store, operation, eOpts) {

				if (operation.trigger) {
					store.proxy.extraParams = operation.param;
				} else {
					var panel = me.getTabCourse(),
						collegeField = panel.down("combobox"),
						college = collegeField.getRawValue(),
						collegeid = collegeField.getValue(),
						key = panel.down("textfield[action=key]").getValue();
					var param = {
						college: college,
						collegeid: collegeid,
						key: Ext.String.trim(key)
					};
					store.proxy.extraParams = param;
				}
			},
			load: function(store, records, successful, eOpts) {

			}
		});
		
		
	},
	/**
	 *@for  xtype:tabcollege,set children element toolbar button[action=add-college,add-major,add-grade]
	 *accessable,bridging event name gird itemclick
	 */

	onAddCollege: function(button, e, eOpts) {

		Ext.create('Exam.view.form.College', {

			itemType: "college",
			targetView: button.up("tabcollege"),
			recordData: {
				college: '输入名称'
			}
		});
	},
	onAddMajor: function(button, e, eOpts) {
		var record = button.up('tabcollege').getSelectionModel().getSelection()[0],
			collegeRecord = record;

		recordData = {
			college: collegeRecord.get('name'),
			collegeid: collegeRecord.get('cid'),
			major: '输入名称',
			majorid: -1
		};
		record && Ext.create('Exam.view.form.College', {
			itemType: "major",

			targetView: button.up("tabcollege"),
			recordData: recordData
		});
	},
	onAddGrade: function(button, e, eOpts) {
		var me = this;
		var record = button.up('tabcollege').getSelectionModel().getSelection()[0],
			majorRecord = record,
			collegeRecord = majorRecord.parentNode;

		recordData = {
			college: collegeRecord.get('name'),
			collegeid: collegeRecord.get('id'),
			major: majorRecord.get('name'),
			majorid: majorRecord.get('cid'),
			grade: '输入名称',
			gradeid: -1
		};
		record && Ext.create('Exam.view.form.College', {
			itemType: "class",

			targetView: button.up("tabcollege"),
			recordData: recordData
		});
	},
	onAddTeacher: function(button, e, eOptons) {
		Ext.create("Exam.view.form.Teacher", {
			targetView: button.up("tabteacher")
		});
	},
	onEditTeacher: function(button, e, eOptons) {

		var record = button.up('tabteacher').getSelectionModel().getSelection()[0];
		var win = Ext.create("Exam.view.edit.Teacher", {
			title: '修改教师信息',
			url: "teacher/mod",
			record: record
		});
		win.down('form').loadRecord(record);
	},
	onDelTeacher: function(button, e, eOptons) {

	},
	onRegTeacherCourse: function(button, e, eOptons) {

		var record = button.up("grid").getSelectionModel().getSelection()[0],
			selCourse = record.get("courses"),
			tid = record.get("id"),
			college = record.get("college").name,
			collegeid = record.get("college").id;
		Ext.Ajax.request({
			url: eDomain.getURL("course/list"),
			method: "get",
			type: "json",
			params: {
				collegeid: collegeid,
				college: college,
				page: 1,
				limit: 10000
			},
			success: function(res) {

				var rs = Ext.JSON.decode(res.responseText);
				if (!rs.success) {
					alert(rs.msg);
					return false;
				}

				var allCourse = rs.data;
				Ext.create("Exam.view.form.TeacherCourse", {
					selCourse: selCourse,
					allCourse: allCourse,
					record: record,
					tid: tid
				});



			},
			failure: function(response, options) {

			}
		});

	},
	onQueryTeacher: function(button, event, eOpts) {

		var queryFiled = button.previousNode(),
			param = {};
		param.page = 1;
		param.key = queryFiled.getValue();
		param.collegeid = queryFiled.previousNode().getValue() || -1;
		button.up('grid').getStore().load({
			param: param,
			trigger: true
		});
	},
	onAddStudent: function(button, e, eOptons) {
		Ext.create("Exam.view.form.Student", {
			title: '添加学生',
			targetView: button.up("tabstudent"),
		});
	},
	onAddStudentExcel: function(button, e, eOptons) {
		Ext.create("Exam.view.form.StudentExcel", {
			title: '批量添加学生',
			targetView: button.up("tabstudent"),
		});
	},
	onDelStudent: function() {},
	onEditStudent: function(button, e, eOptons) {

		var record = button.up('tabstudent').getSelectionModel().getSelection()[0];
		var win = Ext.create("Exam.view.edit.Student", {
			title: '修改学生信息',
			url: "student/mod",
			record: record
		});

		/*setTimeout(function() {
			win.down('form').loadRecord(record);
		}, 400);*/
	},
	onQueryStudent: function(button, e, eOptons) {

		var comboFieldList = button.ownerCt.query("combobox"),
			collegeField = comboFieldList[0],
			majorField = comboFieldList[1],
			classField = comboFieldList[2],
			college = collegeField.getRawValue(),
			collegeid = collegeField.getValue(),

			major = majorField.getRawValue(),
			majorid = majorField.getValue(),

			grade = classField.getRawValue(),
			gradeid = classField.getValue(),

			key = button.previousSibling().getValue();
		var param = {
			page: 1,
			collegeid: collegeid,
			college: college,
			majorid: majorid,
			major: major,
			classid: gradeid,
			'class': grade,
			key: Ext.String.trim(key)
		};
		button.up('grid').getStore().load({
			param: param,
			trigger: true
		});
	},
	onQueryExamStudent: function(button,e,eOptons){
	 	var comboFieldList = button.ownerCt.query("combobox"),
			collegeField = comboFieldList[0],
			majorField = comboFieldList[1],
			classField = comboFieldList[2],
			college = collegeField.getRawValue(),
			collegeid = collegeField.getValue(),

			major = majorField.getRawValue(),
			majorid = majorField.getValue(),

			grade = classField.getRawValue(),
			gradeid = classField.getValue(),
			examid=localStorage.getItem('examid'),
			key = button.previousSibling().getValue();
			debugger;
		var param = {
			page: 1,
			limit:14,
			collegeid: collegeid,
			majorid: majorid,
			classid: gradeid,
			examid: examid,
			key: Ext.String.trim(key)
		};
		button.up('grid').getStore().load({
			param: param,
			trigger: true
		});
	},
	showTeacherToolbarUI: function() {

	},
	onAddIPRoom: function(button, e, eOptons) {
		Ext.create("Exam.view.form.IPRoom", {
			title: '添加机房',
			url: "iproom/add",
			targetView: button.up("tabiproom")
		});
	},
	onEditIPRoom: function(button, e, eOptons) {
		var record = button.up('tabiproom').getSelectionModel().getSelection()[0];
		var win = Ext.create("Exam.view.edit.IPRoom", {
			title: '修改机房信息',
			url: "iproom/mod",
			record: record,
			targetView: button.up("tabiproom")
		});

		win.down('form').loadRecord(record);
	},
	onDelIPRoom: function(button, e, eOptons) {

	},
	onQueryIPRoom: function(button, e, eOptons) {
		debugger;
		var queryFiled = button.previousNode(),
			key = queryFiled.getValue();

		button.up('grid').getStore().load({
			param: {
				key: key
			},
			trigger: true
		});
	},

 	onQueryPaperlist: function(button, e, eOptons) {
 		debugger;
		var queryFiled = button.previousNode(),
		param = {};
		param.page = 1;
		param.limit=1000;
		param.key = queryFiled.getValue();
		param.cid = queryFiled.previousNode().getValue();
		button.up('grid').getStore().load({
			param: param,
			trigger: true
		});
	},
	onAddCourse: function(button, e, eOptons) {
		Ext.Ajax.request({
			url: eDomain.getURL("college/list"),
			method: "get",
			type: "json",

			success: function(res) {

				var rs = Ext.JSON.decode(res.responseText);
				if (!rs.success) {
					alert(rs.msg);
					return false;
				}

				var collegeList = rs.data;
				Ext.create("Exam.view.form.Course", {
					collegeList: collegeList,
					title: "添加课程",
					targetView: button.up("tabcourse")
				});



			},
			failure: function(response, options) {

			}
		});
	},
	onDelCourse: function() {},
	onDelCourse: function() {},
	onQueryCourse: function(button, e, eOptons) {
		var queryFiled = button.previousNode(),
			collegeid = queryFiled.previousNode().getValue(),
			key = queryFiled.getValue();
		debugger;
		button.up('grid').getStore().load({
			param: {
				key: key,
				collegeid: collegeid
			},
			trigger: true
		});
	},
	onLaunch: function() {

	}
});
