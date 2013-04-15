Ext.define('Exam.store.Navigations', {
    extend: 'Ext.data.TreeStore',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'text', type: 'string' },
        { name: 'clsPath', type: 'string' },
        { name: 'xtype', type: 'string' },
        { name: 'admin' }
    ],
    defaultRootProperty: 'data',
    proxy: {
        type: 'ajax',
        api: {
            // read:eDomain.getURL("user/auth"),            
            read: "test/userauth.json",
            update: 'data/updateUsers.json'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },
    root: {
        text: '导航栏',
        expand: true
    },
    listeners: {
        load: function(store, model, records, successful) {
            if(eUserInfo.role=='0'){
                return;
            }
            var root = store.getRootNode();

             
          
            var rootChildren = root.childNodes;
            for (var i = 0, len = rootChildren.length; i < len; i++) {
                var child = rootChildren[i];
               
                if (child.get("admin")) {
                    child.remove();
                } else {
                    var subChild=child.childNodes;
                    for (var j = 0, sublen = subChild.length; j < sublen; j++) {
                        var subItem = subChild[i];
                       
                        if (subItem&&subItem.get("admin")) {
                            subItem.remove();
                        }  
                    }
                }
            }
        }

    }
});