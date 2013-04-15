package cn.edu.dlnu.doe.dal.relation;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.PK;
import org.nutz.dao.entity.annotation.Table;


@Table("t_student_paper")
@PK({"sid","pid"})
public class StudentPaper {
	
	@Column
	private String sid;
	@Column
	private Long pid; 
	@Column
	private String answer;
	
	public String getSid() {
		return sid;
	}
	public void setSid(String sid) {
		this.sid = sid;
	}
	public Long getPid() {
		return pid;
	}
	public void setPid(Long pid) {
		this.pid = pid;
	}
	public String getAnswer() {
		return answer;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}	
}
