/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

var ioc = {

    jedisPoolConfig: {
        type: "redis.clients.jedis.JedisPoolConfig"
    },
    redisPool: {
        type: "cn.edu.dlnu.doe.redis.RedisPool",
        args: [
            {refer: "jedisPoolConfig"},
            {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("redis.url")'}
        ],
        events:{
            depose:"destory"
        }
    },
    redisClient: {
        type: "cn.edu.dlnu.doe.redis.RedisClient",
        fields: {
            redisPool: {refer: "redisPool"}
        }
    },
    queue: {
        type: "cn.edu.dlnu.doe.queue.RQueueImpl",
        fields: {
            redisPool: {refer: "redisPool"}
        }
    }



}