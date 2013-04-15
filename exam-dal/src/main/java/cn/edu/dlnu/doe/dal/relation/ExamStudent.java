package cn.edu.dlnu.doe.dal.relation;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.One;
import org.nutz.dao.entity.annotation.PK;
import org.nutz.dao.entity.annotation.Table;
import cn.edu.dlnu.doe.dal.bo.Student;

@Table("t_exam_student")
@PK({"examid", "studentid"})
public class ExamStudent {
    @Column
    private Long examid;
    @Column
    private String studentid;
    @Column
    private Integer objectiveMark=0;
    @Column
    private Integer subjectiveMark=0;
    @Column
    private String eachquestionMark;
    @Column
    //参考StuStat
    private Integer status = 0;
    @One(target = Student.class, field = "studentid")
    private Student student;

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Long getExamid() {
        return examid;
    }

    public void setExamid(Long examid) {
        this.examid = examid;
    }

    public String getStudentid() {
        return studentid;
    }

    public void setStudentid(String studentId2) {
        this.studentid = studentId2;
    }

    public Integer getObjectiveMark() {
        return objectiveMark;
    }

    public void setObjectiveMark(Integer objectiveMark) {
        this.objectiveMark = objectiveMark;
    }

    public Integer getSubjectiveMark() {
        return subjectiveMark;
    }

    public void setSubjectiveMark(Integer subjectiveMark) {
        this.subjectiveMark = subjectiveMark;
    }

    public String getEachquestionMark() {
        return eachquestionMark;
    }

    public void setEachquestionMark(String eachquestionMark) {
        this.eachquestionMark = eachquestionMark;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public ExamStudent(Long examid, String studentid) {
        this.examid = examid;
        this.studentid = studentid;
        this.status = 0;
    }

    public ExamStudent() {
    }
}
