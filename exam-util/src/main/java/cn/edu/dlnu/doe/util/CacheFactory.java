package cn.edu.dlnu.doe.util;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClientBuilder;
import net.rubyeye.xmemcached.utils.AddrUtil;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-8
 * Time: 下午8:21
 */
public class CacheFactory {
    private MemcachedClient memcachedClient;
    private XMemcachedClientBuilder builder;
    private String address;
    private int connectionPoolSize;

    public MemcachedClient getCache() {
        if (memcachedClient == null){
            if (builder == null){
                builder = new XMemcachedClientBuilder(AddrUtil.getAddressMap(address));
                builder.setConnectionPoolSize(connectionPoolSize);
            }
            try {
                memcachedClient = builder.build();
            } catch (IOException e) {
               throw new RuntimeException(e);
            }
        }
        return memcachedClient;
    }
    public void shutdown() throws IOException {
        memcachedClient.shutdown();
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setConnectionPoolSize(int connectionPoolSize) {
        this.connectionPoolSize = connectionPoolSize;
    }

    public CacheFactory(int connectionPoolSize, String address) {
        this.connectionPoolSize = connectionPoolSize;
        this.address = address;
        builder = new XMemcachedClientBuilder(AddrUtil.getAddressMap(address));
        builder.setConnectionPoolSize(connectionPoolSize);
        try {
            memcachedClient = builder.build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public CacheFactory() {}
}
