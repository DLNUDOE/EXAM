package cn.edu.dlnu.doe.dal.bo;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-7
 * Time: 下午1:11
 */

@Table("t_major")
public class Major implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column
    @Id
    private Long id;
    @Column
    private String name;
    @Column
    private Long collegeid;

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
}
