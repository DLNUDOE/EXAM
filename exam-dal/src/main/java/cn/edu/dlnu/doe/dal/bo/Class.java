package cn.edu.dlnu.doe.dal.bo;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-7
 * Time: 下午1:12
 */
@Table("t_class")
public class Class implements Serializable {
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
    private Long majorid;

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

    public Long getMajorid() {
        return majorid;
    }

    public void setMajorid(Long majorid) {
        this.majorid = majorid;
    }
}
