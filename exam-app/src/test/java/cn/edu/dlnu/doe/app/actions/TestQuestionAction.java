package cn.edu.dlnu.doe.app.actions;

import java.util.Date;

import org.junit.BeforeClass;
import org.junit.Test;

public class TestQuestionAction {

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@Test
	public void test() {
		
		Date date = new Date();
		System.out.println(date.getTime());
		
		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {}
		
		Date date2 = new Date();
		System.out.println(date2.getTime()-date.getTime());
		
	}

}
