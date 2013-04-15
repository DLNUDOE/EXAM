/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.redis;

import org.nutz.log.Log;
import org.nutz.log.Logs;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-25
 * Time: 下午4:23
 */
public class RedisClient {
    private static final Log log = Logs.getLog(RedisClient.class);
    private RedisPool redisPool;

    public void put(String key, String value) {
        JedisPool jedisPool = redisPool.getJedisPool();
        Jedis jedis = jedisPool.getResource();
        try {
            jedis.set(key, value);
            log.debug("Set [" + value + "] by key:[" + key + ']');
        } finally {
            jedisPool.returnResource(jedis);
        }

    }

    public String get(String key) {
        JedisPool jedisPool = redisPool.getJedisPool();
        Jedis jedis = jedisPool.getResource();
        String res;
        try {
            res = jedis.get(key);
            log.debug("get [" + res + "] by key:[" + key + ']');
        } finally {
            jedisPool.returnResource(jedis);
        }

        return res;
    }

    public void setRedisPool(RedisPool redisPool) {
        this.redisPool = redisPool;
    }
}
