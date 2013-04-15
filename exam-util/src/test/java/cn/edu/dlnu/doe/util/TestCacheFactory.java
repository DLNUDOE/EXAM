package cn.edu.dlnu.doe.util;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.exception.MemcachedException;
import org.junit.Test;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;

import java.util.concurrent.TimeoutException;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-8
 * Time: 下午8:25
 */
public class TestCacheFactory {
    public static final Ioc IOC = new NutIoc(new JsonLoader("ioc.js"));

    @Test
    public void test() throws InterruptedException, MemcachedException, TimeoutException {
       /*Ioc IOC = IOC;
        CacheFactory cacheFactory = IOC.get(CacheFactory.class,"cacheFactory");
        MemcachedClient client = cacheFactory.getCache();
        client.set("hello", 0, "hello doe memcached OK");
        System.out.println(client.get("hello"));

        Cache cache = IOC.get(Cache.class,"cache");
        cache.put("hello","OK");
        System.out.println(cache.get("hello"));
        System.out.println(client.get("hello"));
        */
    }
}
