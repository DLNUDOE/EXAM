/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.queue;

import java.util.List;

import org.nutz.json.Json;

import cn.edu.dlnu.doe.redis.RedisPool;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.ShardedJedis;
import redis.clients.jedis.ShardedJedisPool;

@SuppressWarnings({"unused"})
public class RQueueImpl implements RQueue{
    private RedisPool redisPool;

    private String rListName = R_LIST_NAME_DEFAULT;

    @Override
    public void push(String o) {
        this.push(o,rListName);
    }

    @Override
    public void push(String cmd,String qname) {
        JedisPool jedisPool = redisPool.getJedisPool();
        Jedis jedis = jedisPool.getResource();
        try {
            jedis.lpush(qname, cmd);
            LOGGER.info("PUSH: [" + cmd + "] to QUEUE:["+qname+']');

        } finally {
            jedisPool.returnResource(jedis);
        }
    }

    @Override
    public String pop() {
        return this.pop(rListName);
    }

    @Override
    public String pop(String qname) {
        JedisPool jedisPool = redisPool.getJedisPool();
        Jedis jedis = jedisPool.getResource();
        try {
            List<String> res = jedis.brpop(0,qname);
            LOGGER.info("POP:[ " + Json.toJson(res) + "] FROM :["+qname+']');
            if (res == null || res.size() != 2){
                return null;
            }    
            
            LOGGER.info("====================="+res.get(1)+"=====================");
            return res.get(1);
        } finally {
            jedisPool.returnResource(jedis);
        }

    }
    
    
    public void setrListName(String rListName) {
        if (rListName == null || rListName.trim().equals("")) {
            rListName = R_LIST_NAME_DEFAULT;
        }
        this.rListName = rListName;
    }

    public void setRedisPool(RedisPool redisPool) {
        this.redisPool = redisPool;
    }
    
    
    //////niecheng use test/////////
    @Override
    public String testpop(String name){
        JedisPool jedisPool = redisPool.getJedisPool();
        Jedis jedis = jedisPool.getResource();
    	 return jedis.rpop(name);  
    }
   
}
