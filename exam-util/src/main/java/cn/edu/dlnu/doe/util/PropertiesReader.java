package cn.edu.dlnu.doe.util;

import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;

/**
 * Created with IntelliJ IDEA.
 * User: xiaojiangang
 * Date: 13-2-22
 * Time: 下午4:29
 */
public class PropertiesReader {
    public static final String CONFIG = "config.properties";
    private Properties properties;
    public PropertiesReader(String config) throws IOException {
        URL url =  this.getClass().getClassLoader().getResource(config);
        properties.load(new FileReader(url.getFile()));
    }
    public String get(String key){
        return properties.getProperty(key);
    }
    public static String getProperties(String configFile,String propertyName){
        String res = null;

        Properties properties = new Properties();
        try {
            properties.load(PropertiesReader.class.getClassLoader().getResourceAsStream(configFile));
            res = properties.getProperty(propertyName);
        }catch (Exception e){
            return null;
        }
        return res;
    }
    public static String getProperties(String propertyName){
        return getProperties(CONFIG,propertyName);
    }
    public static Integer getPropertiesInt(String propertyName){
        String res = getProperties(propertyName);
        if (null != res){
            return Integer.parseInt(res);
        }
        return  0;
    }
    public static Boolean getPropertiesBool(String propertyName){
        String res = getProperties(propertyName);
        if (null != res){
            return res.equalsIgnoreCase("true");//
        }
        return false;
    }
}
