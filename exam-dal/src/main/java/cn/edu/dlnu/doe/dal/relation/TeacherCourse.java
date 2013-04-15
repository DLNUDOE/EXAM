package cn.edu.dlnu.doe.dal.relation;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-9
 * Time: 下午9:12
 */
@Table("t_teacher_course")
public class TeacherCourse {
    @Column
    private String teacherid;
    @Column
    private Long courseid;
}
