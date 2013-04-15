package cn.edu.dlnu.doe.dal.bo;

import java.io.Serializable;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


@Table("t_question")
public class Question implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column
	@Id
	private Long id;
	@Column
	private Integer type;
	@Column
	@ColDefine(type=ColType.TEXT)
	private String stem;
	@Column
	@ColDefine(type=ColType.TEXT)
	private String kp;
	@Column
	@ColDefine(type=ColType.TEXT)
	private String answer;
	@Column
	private Long courseid;
	
	public Long getCourseid() {
		return courseid;
	}
	public void setCourseid(Long courseid) {
		this.courseid = courseid;
	}
	public String getAnswer() {
		return answer;
	}
	public String getStem() {
		return stem;
	}
	public void setStem(String stem) {
		this.stem = stem;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getKp() {
		return kp;
	}
	public void setKp(String kp) {
		this.kp = kp;
	}

}
