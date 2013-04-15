var ioc = {

    //========================util==========================

    cacheFactory:{
        type:"cn.edu.dlnu.doe.util.CacheFactory",
        events:{
            depose:"shutdown"
        },
        fields:{
            address:"192.168.1.111:11211",
            connectionPoolSize:3
        }
    },
    cache:{
        type:"cn.edu.dlnu.doe.util.Cache",
        fields:{
            client:{java:"$cacheFactory.getCache()"}
        }
    }
}