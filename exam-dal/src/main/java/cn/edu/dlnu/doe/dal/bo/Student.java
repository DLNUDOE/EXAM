package cn.edu.dlnu.doe.dal.bo;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-7
 * Time: 下午1:23
 */
@Table("t_student")
public class Student implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final transient int COMP_YES = 1;
	public static final transient int COMP_NO = 0;
	public static final transient String DEFAULTPASSWD = "123456";
	public static final transient int ROLE_ID = 2;
	
    @Name
    @Column
    private String id;
    @Column
    private String name;
    @Column
    private String password;
    @Column
    private Long collegeid;
    private College college;
    @Column
    private Long majorid;
    private Major major;
    @Column
    private Long classid;
    private Class clazz;
    @Column
    private String email;
    @Column
    private String img;
    @Column
    private Integer complete;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getCollegeid() {
        return collegeid;
    }

    public void setCollegeid(Long collegeid) {
        this.collegeid = collegeid;
    }

    public Long getMajorid() {
        return majorid;
    }

    public void setMajorid(Long majorid) {
        this.majorid = majorid;
    }

    public Long getClassid() {
        return classid;
    }

    public void setClassid(Long classid) {
        this.classid = classid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

	public Integer getComplete() {
		return complete;
	}

	public void setComplete(Integer complete) {
		this.complete = complete;
	}

	public College getCollege() {
		return college;
	}

	public void setCollege(College college) {
		this.college = college;
	}

	public Major getMajor() {
		return major;
	}

	public void setMajor(Major major) {
		this.major = major;
	}

	public Class getClazz() {
		return clazz;
	}

	public void setClazz(Class clazz) {
		this.clazz = clazz;
	}

}
