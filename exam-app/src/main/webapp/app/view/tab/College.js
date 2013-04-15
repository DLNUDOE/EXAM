Ext.define("Exam.view.tab.College", {
	extend: "Ext.tree.Panel",
	xtype: 'tabcollege',
	title: '学院机构',
	collapsible: true,
	useArrows: true,
	rootVisible: false,
	store: "Colleges",
	multiSelect: false,
	singleExpand: false,
	columns: [{
		xtype: 'treecolumn',
		text: '名称',
		flex: 1,
		sortable: true,
		dataIndex: 'name'
	}, {
		text: '编号',
		flex: 1,
		sortable: true,
		dataIndex: 'cid'
	}, {
		xtype: 'actioncolumn',
		text: '编辑',
		width: 40,
		menuDisabled: true,
		tooltip: 'Edit task',
		align: 'center',
		icon: 'static/img/icon-edit.png',
		handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
			var depth = record.getDepth(),recordData=null;
			debugger;
			switch(depth) {
			case 1:
				recordData = {
					college: record.get('name'),
					collegeid: record.get('cid') 
				};

				Ext.create('Exam.view.edit.College', {
					 
					itemType: "college", 
					record:record,
					 
					recordData: recordData
				});
				break;
			case 2:

				var  collegeRecord = record.parentNode;

				recordData = {
					college: collegeRecord.get('name'),
					collegeid: collegeRecord.get('cid'),
					major: record.get('name'),
					majorid: record.get('cid')
				};
				Ext.create('Exam.view.edit.College', {
					 
					itemType: "major", 
					record:record,
					recordData: recordData
				});
				break;
			case 3:
				var majorRecord = record.parentNode,
					collegeRecord = majorRecord.parentNode;

				recordData = {
					college: collegeRecord.get('name'),
					collegeid: collegeRecord.get('cid'),
					major: majorRecord.get('name'),
					majorid: majorRecord.get('cid'),
					class: record.get('name'),
					classid: record.get('cid')
				};
				 Ext.create('Exam.view.edit.College', {				 
					itemType: "class", 
					record:record,
					recordData: recordData
				});
				break;
			default:
				break;
			}
			 
		}       
	}],
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'top',
		items: [{
			xtype: 'button',
			disabled: false,
			action: 'add-college',
			icon: 'static/img/icon-add.png',
			text: '添加学院'
		}, "-",
		{
			xtype: 'button',
			disabled: true,
			action: 'add-major',
			icon: 'static/img/icon-add.png',
			text: '添加专业'			
		}, "-",
		{
			xtype: 'button',
			disabled: true,
			action: 'add-grade',
			icon: 'static/img/icon-add.png',
			text: '添加班级'
		}, "-",
		{
			xtype: 'button',
			disabled: true,
			action: 'refresh-college',
			icon: 'static/img/icon-add.png',
			text: '刷新'
		}]
	}],
	initComponent: function() {
		this.callParent(arguments);
	},
	onSelectionChange: function(selModel, selected, eOpts) {
		var depth = Exam.lib.util.TreeUtil.getNodeDepth(record);
		debugger;
	}
});