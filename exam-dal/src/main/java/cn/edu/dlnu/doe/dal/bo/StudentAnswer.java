/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.dal.bo;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.PK;
import org.nutz.dao.entity.annotation.Table;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-24
 * Time: 下午5:46
 */
@Table("t_student_answer")
@PK({"examid", "studentid", "questionid"})
public class StudentAnswer {
    @Column
    private Long examid;
    @Column
    private String studentid;
    @Column
    private Long questionid;
    @Column
    @ColDefine(type=ColType.TEXT)
    private String answer;

    public Long getExamid() {
        return examid;
    }

    public void setExamid(Long examid) {
        this.examid = examid;
    }

    public String getStudentid() {
        return studentid;
    }

    public void setStudentid(String studentid) {
        this.studentid = studentid;
    }

    public Long getQuestionid() {
        return questionid;
    }

    public void setQuestionid(Long questionid) {
        this.questionid = questionid;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
