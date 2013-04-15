package cn.edu.dlnu.doe.util;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.exception.MemcachedException;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import java.util.concurrent.TimeoutException;

public class Cache {

	private static Cache cache;
	private MemcachedClient client;
	private  int defaultTimeOut = 12*3600;//30mins
	private String prefix="doe_";
	
	private static final Log LOGGER = Logs.getLog(Cache.class);
	
	private Cache(){}
	public void setClient(MemcachedClient client) {
		this.client = client;
	}
	public static Cache getInstance(){
		if(cache == null){
			cache = new Cache();
		}
		return cache;
	}
    public boolean has(String key){
        try {
            return client.get(key) != null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void flushAll() {
        try {
            client.flushAll();
            LOGGER.debug("[Cache] flush all memcache object");
        } catch (Exception e) {
            LOGGER.error("[Cache] flush all memcache object failed",e);
            throw new RuntimeException(e);
        }
    }

    public void replace(String key, Object value, int secounds) {
        key = prefix + key;
        try {
            client.replace(key, secounds, value);
            LOGGER.debug("[Cache] replace a memcache object:["+Json.toJson(value)+"] by key:["+key+"] timeout:["+secounds+"]s");
        } catch (Exception e) {
            LOGGER.error("[Cache] replace "+key+" failed",e);
            throw new RuntimeException(e);
        }
    }

    public void replace(String key, Object value) {
        replace(key, value, defaultTimeOut);
    }

	public void put(String key,Object value,int secounds){
		try {
			key = prefix+key;//doe_
			client.set(key, secounds, value);
            LOGGER.debug("[Cache] add to memcache object:["+Json.toJson(value)+"] by key:["+key+"] timeout:["+secounds+"]s");
		} catch (Exception e) {
			LOGGER.error("[Cache] put "+key+" failed",e);
			throw new RuntimeException(e);
		}
	}
	
	public void put(String key,Object value){
        put(key,value,defaultTimeOut);
	}
	
	public void setDefaultTimeOut(int timeOut){
		defaultTimeOut = timeOut;
	}
	
	public Object get(String key){
		try {
			key = prefix+key;

			Object o = client.get(key);
            LOGGER.debug("[Cache]get result:["+ Json.toJson(o)+"] by key:["+key+"]");
            return o;
		} catch (Exception e) {
			LOGGER.error("[Cache] get key "+key+" failed",e);
			throw new RuntimeException(e);
		}
	}
	
	public boolean del(String key){
		try {
			key = prefix+key;
            LOGGER.debug("[Cache]delete from memcache by key:["+key+"]");
			return client.delete(key);
		} catch (Exception e) {
			LOGGER.error("[Cache] del key "+key+" failed",e);
			throw new RuntimeException(e);
		}
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}
}
