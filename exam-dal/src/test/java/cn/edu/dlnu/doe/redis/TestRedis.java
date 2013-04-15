/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.redis;

import org.junit.Test;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-25
 * Time: 下午7:25
 */
public class TestRedis {
    @Test
    public void Test(){
        Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
        RedisClient rc = ioc.get(RedisClient.class, "redisClient");
        rc.put("hello", "world");
        rc.put("foo", "bar");
        System.out.println(rc.get("foo"));
        System.out.println(rc.get("hello"));
        System.out.println(rc.get("hello___12321"));
    }
}
