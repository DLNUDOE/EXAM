package cn.edu.dlnu.doe.dal.bo;

import java.io.Serializable;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t_paper")
public class Paper implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column
	@Id
	private Long id;
	@Column
	private String title;
	@Column
	private String c_time;
	@Column
	private String creator;
	@Column
	private Long cid;
	@Column
	private String cname;
	@Column
	@ColDefine(type=ColType.TEXT)
	private String groups;
    @Column
    @ColDefine(type = ColType.TEXT)
    private String questions;
    @Column
    private Integer score;

    public String getQuestions() {
        return questions;
    }

    public void setQuestions(String questions) {
        this.questions = questions;
    }

    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getC_time() {
		return c_time;
	}
	public void setC_time(String c_time) {
		this.c_time = c_time;
	}
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	public Long getCid() {
		return cid;
	}
	public void setCid(Long cid) {
		this.cid = cid;
	}
	public String getCname() {
		return cname;
	}
	public void setCname(String cname) {
		this.cname = cname;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}

    public String getGroups() {
        return groups;
    }

    public void setGroups(String groups) {
        this.groups = groups;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
