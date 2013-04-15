package cn.edu.dlnu.doe.app.actions;

import java.text.ParseException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.easymock.EasyMock;
import org.junit.Test;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;
import cn.edu.dlnu.doe.dal.bo.Exam;
import cn.edu.dlnu.doe.dal.bo.Student;
import cn.edu.dlnu.doe.dal.relation.ExamStudent;

