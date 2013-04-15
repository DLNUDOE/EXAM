Ext.define('Exam.view.Navigation', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.navigation',
    title: '导航',
    region: "west",
    width: 180,
    minWidth: 100,
    maxWidth: 250,
    useArrows: true,
    splitable: true,
    rootVisible: false,
    split: true,
    collapsible: true,
    titleCollapsible: false,
    animCollapse: true,
    store: "Navigations",
    tools: [{
        type: 'expand',
        qtip: '展开',
        handler: function(e) {
            this.up('treepanel').expandAll(true);
        }
    }, {
        type: 'collapse',
        qtip: '折叠',
        handler: function(e) {
            this.up('treepanel').collapseAll(true);
        }
    }],
    initComponent: function() {

        this.callParent(arguments);
    },
    onItemSelectionChange: function(item) {

    }
});