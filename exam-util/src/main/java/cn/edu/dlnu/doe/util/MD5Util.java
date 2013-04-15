package cn.edu.dlnu.doe.util;

import org.nutz.log.Log;
import org.nutz.log.Logs;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * <p>
 * MD5工具类
 * </p>
 * 
 * @author IceWee
 * @date 2012-5-15
 * @version 1.0
 */
public class MD5Util {

	private static final String ALGORIGTHM_MD5 = "MD5";
	private static final Log LOGGER = Logs.getLog(MD5Util.class);

    /**
	 * <p>
	 * 字符串生成MD5
	 * </p>
	 * 
	 * @param input
	 * @return
	 * @throws Exception
	 */
	public static String generalMD5(String input){
		try {
			return generalMD5(input, null);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(),e);
			throw new Error("CAN NOT GENERAL MD5 STRING!",e);
		}
	}

	/**
	 * <p>
	 * 字符串生成MD5
	 * </p>
	 * 
	 * @param input
	 * @param charset
	 *            编码(可选)
	 * @return
	 * @throws Exception
	 */
	public static String generalMD5(String input, String charset) throws Exception {
		byte[] data;
		if (charset != null && !"".equals(charset)) {
			data = input.getBytes(charset);
		} else {
			data = input.getBytes();
		}
		MessageDigest messageDigest = getMD5();
		messageDigest.update(data);
		return byteArrayToHexString(messageDigest.digest());
	}

    /**
     * 双重MD5加密
     * @param input
     * @return
     */
    public static String generalMD5E2(String input){
        return generalMD5(generalMD5(input));
    }
    /**
     * 双重MD5加密 with key
     * @param input
     * @param key
     * @return
     */
    public  static String generalMD5E2WithKey(String input,String key){
        return generalMD5E2(key+input+key);
    }
    /**
     * 双重MD5加密
     * @param input
     * @param key
     * @return
     */
    public  static String generalMD5WithKey(String input,String key){
        return generalMD5(key+input+key);
    }

	/**
	 * <p>
	 * MD5摘要字节数组转换为16进制字符串
	 * </p>
	 * 
	 * @param data
	 *            MD5摘要
	 * @return
	 */
	private static String byteArrayToHexString(byte[] data) {
		// 用来将字节转换成 16 进制表示的字符
		char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
		// 每个字节用 16 进制表示的话，使用两个字符，所以表示成 16 进制需要 32 个字符
		char arr[] = new char[16 * 2];
		int k = 0; // 表示转换结果中对应的字符位置
		// 从第一个字节开始，对 MD5 的每一个字节转换成 16 进制字符的转换
		for (int i = 0; i < 16; i++) {
			byte b = data[i]; // 取第 i 个字节
			// 取字节中高 4 位的数字转换, >>>为逻辑右移，将符号位一起右移
			arr[k++] = hexDigits[b >>> 4 & 0xf];
			// 取字节中低 4 位的数字转换
			arr[k++] = hexDigits[b & 0xf];
		}
		// 换后的结果转换为字符串
		return new String(arr);
	}

	/**
	 * <p>
	 * 获取MD5实例
	 * </p>
	 * 
	 * @return
	 * @throws java.security.NoSuchAlgorithmException
	 */
	private static MessageDigest getMD5() throws NoSuchAlgorithmException {
		return MessageDigest.getInstance(ALGORIGTHM_MD5);
	}
}
