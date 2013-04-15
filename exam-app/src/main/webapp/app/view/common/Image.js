Ext.define('Exam.view.common.Image', {
    extend: 'Ext.Component', // subclass Ext.Component
    alias: 'widget.managedimage', // this component will have an xtype of 'managedimage'
    autoEl: {
        tag: 'img',
        src: Ext.BLANK_IMAGE_URL,
        cls: 'my-managed-image'
    },
    initComponent:function(){
        this.callParent(arguments);
    },
    // Add custom processing to the onRender phase.
    // Add a ‘load’ listener to the element.
    onRender: function () {
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
        this.el.on('load', this.onLoad, this),                  //load不是img的事件
        this.el.on('click', this.onclick, this);
        debugger;
    },

    onLoad: function () {
        this.fireEvent('load', this);
        debugger;
    },

    onClick: function () {
        this.fireEvent('click', this);
        debugger;
    },

    setSrc: function (src) {
        debugger;
        if (this.rendered) {
            this.el.dom.src = src;                      //el是Ext.Element类的一个实例,应该指向中的是ExtJS组件的根结点
        } else {
            this.src = src;
        }
    },

    getSrc: function (src) {
        debugger;
        return this.el.dom.src || this.src;
    }
});