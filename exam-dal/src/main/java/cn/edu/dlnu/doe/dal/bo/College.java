package cn.edu.dlnu.doe.dal.bo;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-7
 * Time: 下午1:05
 */
@Table("t_college")
public class College implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column
    @Id
    private Long id;
    @Column
    private String name;

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
}
