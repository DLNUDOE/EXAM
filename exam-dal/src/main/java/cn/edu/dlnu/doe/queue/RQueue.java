/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public interface RQueue {
	
	public static final String R_LIST_NAME_DEFAULT = "exam_r_list";
	public static final String EXAM_STU_TO_CMT = "answer";
	public static final Logger LOGGER = LoggerFactory.getLogger(RQueue.class);
	public void  push(String o);
    public void  push(String o,String qname);
	public String pop();
    public String pop(String qname);
    public String testpop(String name);
}
