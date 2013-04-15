/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.redis;

import org.nutz.log.Log;
import org.nutz.log.Logs;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-28
 * Time: 下午3:21
 */

public class RedisPool {
    private JedisPool[] jedisPool;
    private int poolSize = 0;
    private int index = 0;
    private static final Log log = Logs.getLog(RedisPool.class);
    public RedisPool(JedisPoolConfig config,String servers){
        String server[] = servers.split(",");
        poolSize = server.length;
        jedisPool = new JedisPool[poolSize];
        for (int i=0;i<poolSize;i++){
            String host = server[i].split(":")[0];
            int port = Integer.parseInt(server[i].split(":")[1]);
            jedisPool[i] = new JedisPool(config,host,port);
            log.info("*******[ get JedisPool =="+host+":"+port+"== ]*********");
        }
    }
    public JedisPool getJedisPool(){
        JedisPool pool = this.jedisPool[index];
        index+=1;
        index%=poolSize;
        return pool;
    }
    public void destory(){
        for(JedisPool pool:jedisPool){
            pool.destroy();
        }
    }
}