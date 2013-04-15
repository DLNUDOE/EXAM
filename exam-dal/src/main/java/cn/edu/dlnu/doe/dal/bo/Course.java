package cn.edu.dlnu.doe.dal.bo;

import java.io.Serializable;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.One;
import org.nutz.dao.entity.annotation.Table;

@Table("t_course")
public class Course implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column
	private Long id;
	@Column
	private String name;
	@Column
	private Long collegeid;
	@Column
	private String subcollege;
	@Column
	private Integer active = 1;
	@One(target = College.class, field = "collegeid")
	private College college;
    public College getCollege() {
		return college;
	}

	public void setCollege(College college) {
		this.college = college;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getCollegeid() {
		return collegeid;
	}

	public void setCollegeid(Long collegeid) {
		this.collegeid = collegeid;
	}

	public String getSubcollege() {
		return subcollege;
	}

	public void setSubcollege(String subcollege) {
		this.subcollege = subcollege;
	}

	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}

	

}
