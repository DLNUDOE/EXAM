/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.redis;


import java.util.Timer;
import java.util.TimerTask;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;


import org.junit.Test;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;

import cn.edu.dlnu.doe.queue.RQueue;
import cn.edu.dlnu.doe.queue.RQueueImpl;

/**
 * Created with IntelliJ IDEA. User: upupxjg Date: 13-3-28 Time: 上午9:53
 */
public class TestQueue {
	@Test
	public void test() throws InterruptedException {
		RedisPool redisPool = new RedisPool(new JedisPoolConfig(), "192.168.1.111:6379,192.168.1.111:6379");
		JedisPool jedisPool = redisPool.getJedisPool();
		Jedis jedis;
		jedis = jedisPool.getResource();
	/*	int i = 0;
		while (i++ < 3) {
			jedis = jedisPool.getResource();
			jedis.set("foo", "bar");
			jedisPool.returnResource(jedis);
			jedisPool = redisPool.getJedisPool();

			System.out.println(jedis.get("foo"));
			jedisPool.returnResource(jedis);
		}

	*/
		Ioc ioc = new NutIoc(new JsonLoader("ioc.js"));
		final RQueue queue = ioc.get(RQueueImpl.class, "queue");
	/*	Timer timer = new Timer();

		timer.schedule(new TimerTask() {
			@Override
			public void run() {

				queue.push("sdfsdf", "QQQ");
				System.out.println("ddddddddddddddddddddd");
				queue.push("sdfsdf12", "QQQ");
				queue.push("sdfsdf13", "QQQ");
				queue.push("sdfsdf14", "QQQ");
				queue.push("sdfsdf15", "QQQ");
				queue.push("sdfsdf16", "QQQ");
				queue.push("sdfsdf17", "QQQ");
				queue.push("sdfsdf18", "QQQ");
				queue.push("sdfsdf19", "QQQ");
				queue.push("sdfsdf20", "QQQ");
				queue.push("sdfsdf21", "QQQ");
				queue.push("sdfsdf22", "QQQ");
				queue.push("sdfsdf23", "QQQ");
				queue.push("sdfsdf24", "QQQ");
				queue.push("sdfsdf25", "QQQ");
				queue.push("sdfsdf26", "QQQ");
				queue.push("sdfsdf27", "QQQ");
				queue.push("sdfsdf28", "QQQ");
				queue.push("sdfsdf29", "QQQ");
				queue.push("sdfsdf30", "QQQ");
				int i = 0;
				System.out.println("start====================");
				while (i < 10000) {
					System.out.println(queue.pop("QQQ"));
				}
				System.out.println("end==========================");
			}
		}, 0, 10);

		while (true) {
			Thread.sleep(1000);
			System.out.println("=============================================");
		}*/
		queue.push("sdfsdf12", "QQQuu");
		queue.push("sdfsdf13", "QQQ2");
		queue.push("sdfsdf14", "QQQ2");
		queue.push("sdfsdf15", "QQQ2");
		queue.push("sdfsdf16", "QQQ2");
		queue.push("sdfsdf17", "QQQ2");
		queue.push("sdfsdf18", "QQQ2");
		queue.push("sdfsdf19", "QQQ2");
		queue.push("sdfsdf20", "QQQ2");
		queue.push("sdfsdf21", "QQQ2");
		queue.push("sdfsdf22", "QQQ2");
		queue.push("sdfsdf23", "QQQ2");
		queue.push("sdfsdf24", "QQQ2");
		queue.push("sdfsdf25", "QQQ2");
		queue.push("sdfsdf26", "QQQ2");
		queue.push("sdfsdf27", "QQQ2");
		queue.push("sdfsdf28", "QQQ2");
		queue.push("sdfsdf29", "QQQ2");
		queue.push("sdfsdf30", "QQQ2");
		int i=0;
	     while(true){
		System.out.println(queue.pop("QQQuu"));
          i++;
	     }
	 
		
		
	}
}
