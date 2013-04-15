package cn.edu.dlnu.doe.dal.bo;

import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-6
 * Time: 上午10:55
 */
@Table("t_teacher")
public class Teacher implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final transient int ROLE_NORMAL = 1;
    public static final transient int ROLE_ADMIN = 0;

    @Column
    @Name
    private String id;
    @Column
    private String name;
    @Column
    private String password;
    private College college;

    @Column
    private Integer role;
    @Column
    private Long collegeid;
    @Column
    private String email;
    @Column
    private String tel;
    @ManyMany(target = Course.class,relation = "t_teacher_course",from = "teacherid",to="courseid")
    private List<Course> courses;

    public List<Course> getCourses() {
        return courses;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }

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

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public Long getCollegeid() {
        return collegeid;
    }

    public void setCollegeid(Long collegeid) {
        this.collegeid = collegeid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public College getCollege() {
        return college;
    }

    public void setCollege(College college) {
        this.college = college;
    }

}
