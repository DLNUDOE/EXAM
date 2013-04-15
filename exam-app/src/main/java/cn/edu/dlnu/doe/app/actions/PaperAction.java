/*
 * Copyright (c) 2013. Jiangang Xiao All rights reserved
 */

package cn.edu.dlnu.doe.app.actions;


import cn.edu.dlnu.doe.dal.bo.Paper;
import cn.edu.dlnu.doe.dal.bo.Question;
import cn.edu.dlnu.doe.util.Cache;
import cn.edu.dlnu.doe.util.MD5Util;
import cn.edu.dlnu.doe.util.ParamUtil;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.nutz.dao.FieldFilter;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.util.cri.SqlExpression;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.*;
import org.nutz.trans.Atom;

import java.text.SimpleDateFormat;
import java.util.*;


@Ok("ioc:template")
@Fail("ioc:errorjson")
@At("/paper")
@AdaptBy(type = PairAdaptor.class)
@InjectName("paperAction")
@SuppressWarnings({"unchecked", "unused"})
public class PaperAction {

    private static final Log log = Logs.getLog(PaperAction.class);
    private Dao rDao;
    private Dao wDao;
    private Cache cache;

    @At("/add")
//    @POST
    public Object add(@Param("id") Long id, @Param("title") String title, @Param("creator") String creator, @Param("cid") Long cid, @Param("cname") String cname, @Param("groups") String groups) {


        checkParam(title, creator, cid, cname, groups);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        List<Map<String, Object>> theGroups = Json.fromJson(List.class, groups);
        Map<Long, Map> qustionMap = new LinkedHashMap<Long, Map>();
        int score = 0;
        for (Map agroup : theGroups) {
            List<Map<String, Integer>> questions = (List<Map<String, Integer>>) agroup.get("scoreMap");
            for (Map<String, Integer> q : questions) {
                Long qid = Long.valueOf(q.get("id"));
                Question question = rDao.fetch(Question.class, qid);
                if (null == question) {
                    log.error("CAN NOT FIND QUESTION BY ID:[" + qid + "]");
                    throw new RuntimeException("CAN NOT FIND QUESTION BY ID:[" + qid + "]");
                }
                qustionMap.put(qid, QuestionAction.Qustion2Map(question));
                score += q.get("score");
            }
        }
        Map<String, Long> res = new HashMap<String, Long>();
        if (null != id && id.longValue() > 0) {
            this.mod(id, title, creator, cid, cname, groups, Json.toJson(qustionMap), score);
            res.put("id", id);
        } else {
            Paper paper = new Paper();
            paper.setTitle(title);
            paper.setC_time(df.format(new Date()));
            paper.setCreator(creator);
            paper.setCid(cid);
            paper.setCname(cname);
            paper.setGroups(groups);
            paper.setScore(score);
            paper.setQuestions(Json.toJson(qustionMap));
            wDao.insert(paper);
            res.put("id", paper.getId());
        }
        return res;
    }

    @At("/mod")
    @POST
    public void mod(Long id, String title, String creator, Long cid, String cname, String content, String questions, Integer score) {
        if (null == id || id < 0) {
            log.error("PARAM ERROR: ID:[" + id + "]");
            throw new RuntimeException("PARAM ERROR: ID:[" + id + "]");
        }
        checkParam(title, creator, cid, cname, content);
        Paper paper = new Paper();
        paper = rDao.fetch(Paper.class, id);
        if (null == paper) {
            log.error("CAN NOT FIND PAPER BY ID:[" + id + "]");
            throw new RuntimeException("CAN NOT FIND PAPER BY ID:[" + id + "]");
        }
        paper.setTitle(title);
        paper.setGroups(content);
        paper.setQuestions(questions);
        paper.setCreator(creator);
        paper.setCid(cid);
        paper.setCname(cname);
        paper.setScore(score);

        wDao.update(paper);
    }

    @At("/intelligent")
    public Object intelligent(@Param("title") String title, @Param("creator") String creator, @Param("cid") Long cid, @Param("cname") String cname, @Param("radio") Integer radio, @Param("checkbox") Integer checkbox, @Param("judge") Integer judge, @Param("blank") Integer blank, @Param("obj") Integer obj, @Param("score") Integer score) {
        if (ParamUtil.isEmpty(title, creator, cname) || ParamUtil.isNull(cid, radio, checkbox, judge, blank, obj, score)
                || cid < 0 || radio < 0 || checkbox < 0 || judge < 0 || blank < 0 || obj < 0 || score < 0) {
            log.error("ParamError title:[" + title + "] creator:[" + creator + "] cid:{" + cid + "] cname:[" + cname + "] radio:[" + radio + "] checkbox:[" + checkbox + "] judge:[" + judge + "] blank:[" + blank + "] obj:{" + obj + "] score:[" + score + ']');
            throw new RuntimeException("ParamError title:[" + title + "] creator:[" + creator + "] cid:{" + cid + "] cname:[" + cname + "] radio:[" + radio + "] checkbox:[" + checkbox + "] judge:[" + judge + "] blank:[" + blank + "] obj:{" + obj + "] score:[" + score + ']');
        }
        Map<Long, Map> questionMap = new LinkedHashMap<Long, Map>();
        Map<String, Object> paper = new LinkedHashMap<String, Object>();
        paper.put("title", title);
        paper.put("creator", creator);
        paper.put("cid", cid);
        paper.put("cname", cname);
        Map res = generalGroups(cid, radio, checkbox, judge, blank, obj, score, questionMap);
        paper.put("groups", res.get("groups"));
        paper.put("realScore", res.get("realScore"));
        paper.put("questions", Json.fromJson(Map.class, Json.toJson(questionMap)));
        paper.put("score", score);
        return paper;
    }

    public Map generalGroups(Long courseid, Integer radio, Integer checkbox, Integer judge, Integer blank, Integer obj, Integer score, Map<Long, Map> questionMap) {

        List groups = new LinkedList();
        int questionNum = radio + checkbox + judge + blank + obj;
        if (questionNum > score) {
            throw new RuntimeException("SO MANY QUESTIONS!");
        }
        List<Question> blankList = null;
        int blankNum = 0;
        int[] qNumEach = null;
        if (blank != 0) {
            qNumEach = new int[blank];
            blankList = rDao.query(Question.class, Cnd.where("courseid", "=", courseid).wrap("type=3 ORDER BY rand() LIMIT " + blank));
            int c = 0;
            for (Question q : blankList) {
                List asws = Json.fromJsonAsList(String.class, q.getAnswer());
                qNumEach[c] = asws.size();
                blankNum += qNumEach[c++];
                questionMap.put(q.getId(), QuestionAction.Qustion2Map(q));
            }
        }


        int qNumAll = checkbox + judge + blankNum + obj + radio;
        double radioScore = 2 * (1 - radio / qNumAll);
        double checkboxScore = 4 * (1 - checkbox / qNumAll);
        double judgeScore = 2 * (1 - judge / qNumAll);
        double blankScore = 2 * (1 - blankNum / qNumAll);
        double objScore = 10 * (1 - obj / qNumAll);


        double sumScore = radioScore * radio + checkbox * checkboxScore + judge * judgeScore + obj * objScore + blankNum * blankScore;
        double scale = score / sumScore;
        //=====================compute real score
        radioScore = Math.round(radioScore * scale);
        checkboxScore = Math.round(checkboxScore * scale);
        judgeScore = Math.round(judgeScore * scale);
        objScore = Math.round(objScore * scale);


        radioScore = radioScore < 1 ? 1 : radioScore;
        judgeScore = judgeScore < 1 ? 1 : judgeScore;
        blankScore = blankScore < 1 ? 1 : blankScore;
        objScore = objScore < 1 ? 1 : objScore;
        checkboxScore = checkboxScore < 1 ? 1 : checkboxScore;

        radioScore = radio == 0 ? 0 : radioScore;
        checkboxScore = checkbox == 0 ? 0 : checkboxScore;
        judgeScore = judge == 0 ? 0 : judgeScore;
        blankScore = blank == 0 ? 0 : blankScore;
        objScore = obj == 0 ? 0 : objScore;

        sumScore = radioScore * radio + checkbox * checkboxScore + judge * judgeScore + obj * objScore + blankNum * blankScore;

        int diff = score - (int) sumScore;

        log.debug("get radioscore:[" + radioScore + "] checkboxScore:[" + checkboxScore + "] judgeScore:[" + judgeScore + "] objScore:[" + objScore + "] blankEach:[" + blankScore + "] blankNum:[" + blankNum + "]");


        if (radio > 0) {
            double lastEach = Math.round(diff * radioScore / sumScore);
            double[] scoreEach = new double[radio];
            double plusScore;
            if (diff >= 0) {
                plusScore = Math.round(radioScore * 1.6);
            } else {
                plusScore = Math.round(radioScore * 0.6);
            }
            int plusNum1 = (int) Math.abs(Math.floor(diff / plusScore));
            int plusNum2 = (int) Math.round(radio * 0.3);
            int big = plusNum1 > plusNum2 ? plusNum1 : plusNum2;
            big = big < radio ? big : radio;
            int small = plusNum1 < plusNum2 ? plusNum1 : plusNum2;
            int plusNum = diff < 0 ? big : small;
            log.debug("radio: plusNum:[" + plusNum + "] plusscore:[" + plusScore + "] score:[" + radioScore + "] diff:[" + diff + "]");
            int i = 0;
            for (; i < radio - plusNum; i++) {
                scoreEach[i] = radioScore;
            }
            for (; i < radio - 1; i++) {
                scoreEach[i] = plusScore;
                diff -= (plusScore - radioScore);
            }
            if (obj + checkbox + judge == 0) {
                scoreEach[radio - 1] = radio + diff;
                diff = 0;
            } else {
                scoreEach[radio - 1] = plusScore;
                diff -= (plusScore - radioScore);
            }
            groups.add(generalGroup(courseid, QuestionAction.RADIO_TYPE, radio, "单选题", scoreEach, questionMap));
        }
        if (checkbox > 0) {
            double[] scoreEach = new double[checkbox];
            double plusScore;
            if (diff >= 0) {
                plusScore = Math.round(checkboxScore * 1.6);
            } else {
                plusScore = Math.round(checkboxScore * 0.6);
            }
            int plusNum1 = (int) Math.abs(Math.floor(diff / plusScore));
            int plusNum2 = (int) Math.round(checkbox * 0.3);
            int big = plusNum1 > plusNum2 ? plusNum1 : plusNum2;
            big = big < checkbox ? big : checkbox;
            int small = plusNum1 < plusNum2 ? plusNum1 : plusNum2;
            int plusNum = diff < 0 ? big : small;
            log.debug("checkbox: plusNum:[" + plusNum + "] plusscore:[" + plusScore + "] score:[" + checkboxScore + "] diff:[" + diff + "]");
            int i = 0;
            for (; i < checkbox - plusNum; i++) {
                scoreEach[i] = checkboxScore;
            }
            for (; i < checkbox - 1; i++) {
                scoreEach[i] = plusScore;
                diff -= (plusScore - checkboxScore);
            }
            if (obj + judge == 0) {
                scoreEach[checkbox - 1] = checkboxScore + diff;
                diff = 0;
            } else {
                scoreEach[checkbox - 1] = plusScore;
                diff -= (plusScore - checkboxScore);
            }
            groups.add(generalGroup(courseid, QuestionAction.CHECKBOX_TYPE, checkbox, "多选题", scoreEach, questionMap));
        }
        //万恶的填空题
        if (blank > 0) {
            Map<String, Object> group = new LinkedHashMap<String, Object>();
            group.put("title", "填空题");
            group.put("desc", "共 " + blank + " 题");
            List<Map> scoreMapList = new LinkedList<Map>();
            int c = 0;
            for (Question q : blankList) {
                Map scoreMap = new HashMap();
                scoreMap.put("id", q.getId());
                scoreMap.put("score", blankScore * qNumEach[c++]);
                scoreMapList.add(scoreMap);
            }
            group.put("scoreMap", scoreMapList);
            groups.add(group);
        }

        if (judge > 0) {
            double[] scoreEach = new double[judge];
            double plusScore;
            if (diff >= 0) {
                plusScore = Math.round(judgeScore * 1.6);
            } else {
                plusScore = Math.round(judgeScore * 0.6);
            }
            int plusNum1 = (int) Math.abs(Math.floor(diff / plusScore));
            int plusNum2 = (int) Math.round(judge * 0.3);
            int big = plusNum1 > plusNum2 ? plusNum1 : plusNum2;
            big = big < judge ? big : judge;
            int small = plusNum1 < plusNum2 ? plusNum1 : plusNum2;
            int plusNum = diff < 0 ? big : small;
            log.debug("judge: plusNum:[" + plusNum + "] plusscore:[" + plusScore + "] score:[" + judgeScore + "] diff:[" + diff + "]");
            int i = 0;
            for (; i < judge - plusNum; i++) {
                scoreEach[i] = judgeScore;
            }
            for (; i < judge - 1; i++) {
                scoreEach[i] = plusScore;
                diff -= (plusScore - judgeScore);
            }
            if (obj == 0) {
                scoreEach[judge - 1] = judgeScore + diff;
                diff = 0;
            } else {
                scoreEach[judge - 1] = plusScore;
                diff -= (plusScore - judgeScore);
            }
            groups.add(generalGroup(courseid, QuestionAction.T_F_TYPE, judge, "判断题", scoreEach, questionMap));
        }
        if (obj > 0) {
            double lastEach = Math.round(diff * objScore / sumScore);
            double[] scoreEach = new double[obj];
            double plusScore;
            if (diff >= 0) {
                plusScore = Math.round(objScore * 1.6);
            } else {
                plusScore = Math.round(objScore * 0.6);
            }
            int plusNum1 = (int) Math.abs(Math.floor(diff / plusScore));
            int plusNum2 = (int) Math.round(obj * 0.3);
            int big = plusNum1 > plusNum2 ? plusNum1 : plusNum2;
            big = big < obj ? big : obj;
            int small = plusNum1 < plusNum2 ? plusNum1 : plusNum2;
            int plusNum = diff < 0 ? big : small;
            log.debug("obj: plusNum:[" + plusNum + "] plusscore:[" + plusScore + "] score:[" + objScore + "] diff:[" + diff + "]");
            int i = 0;
            for (; i < obj - plusNum; i++) {
                scoreEach[i] = objScore;
            }
            for (; i < obj - 1; i++) {
                scoreEach[i] = plusScore;
                diff -= (plusScore - objScore);
            }
            scoreEach[obj - 1] = objScore + diff;
            diff = 0;
            groups.add(generalGroup(courseid, QuestionAction.OBJ_TYPE, obj, "主观题", scoreEach, questionMap));
        }
        Map res = new HashMap();
        res.put("groups", groups);
        res.put("realScore", score - diff);
        return res;
    }

    private Map<String, Object> generalGroup(Long courseid, int qType, int qNum, String title, double[] scoreEach, Map<Long, Map> questionMap) {
        Map<String, Object> group = new LinkedHashMap<String, Object>();
        group.put("title", title);
        group.put("desc", "共 " + qNum + " 题");
        List<Question> qList = rDao.query(Question.class, Cnd.where("courseid", "=", courseid).wrap("type=" + qType + " ORDER BY rand() LIMIT " + qNum));
        if (qList.size() < qNum) {
            throw new RuntimeException("DOSE NOT HAVE SO MANY QUESTIONS IN DB real:[" + qList.size() + "] require:[" + qNum + "]");
        }
        List<Map> scoreMapList = new LinkedList<Map>();
        for (int i = 0; i < qList.size(); i++) {
            Question q = qList.get(i);
            Map scoreMap = new HashMap();
            scoreMap.put("id", q.getId());
            scoreMap.put("score", scoreEach[i]);
            scoreMapList.add(scoreMap);
            questionMap.put(q.getId(), QuestionAction.Qustion2Map(q));
        }

        group.put("scoreMap", scoreMapList);

        return group;
    }

    @At("/del")
    @POST
    public void del(@Param("id") Long id) {
        if (null == id || id < 0) {
            log.error("PARAM ERROR: id:" + id);
            throw new RuntimeException("PARAM ERROR: id:" + id);
        }

        String key = MD5Util.generalMD5(id.toString());
        key = key.substring(8, 16);
        Cache.getInstance().del(key);

        if (1 != wDao.delete(Paper.class, id)) {
            log.error("CAN NOT FIND PAPER BY ID [" + id + "]");
            throw new RuntimeException("CAN NOT FIND PAPER BY ID [" + id + "]");
        }
    }

    @At("/list")
    @GET
    public Object list(@Param("cid") final Long cid, @Param("key") final String key, @Param("page") final Integer page, @Param("limit") final Integer limit) {

        if (ParamUtil.isNull(cid, page, limit) || page.intValue() < 1 || limit.intValue() < 0 || cid.longValue() < -2L) {
            log.error("PARAM: cid:" + cid + ",key" + key + ",page" + page + ",limit" + limit);
            throw new RuntimeException("PARAM: cid:" + cid + ",key" + key + ",page" + page + ",limit" + limit);
        }

        final Map<String, Object> res = new HashMap<String, Object>();

        FieldFilter.locked(Paper.class, "^groups$").run(new Atom() {
            @Override
            public void run() {
                // TODO Auto-generated method stub

                List<Paper> list = new ArrayList<Paper>();
                Integer total;
                Condition cnd;

                Pager pager = rDao.createPager(page, limit);

                SqlExpression ecid = Cnd.exps("cid", "=", cid);

                if (key.trim().equalsIgnoreCase("")) {
                    if (-1 == cid) {
                        cnd = Cnd.orderBy().desc("id");
                        total = rDao.count(Paper.class);
                    } else {
                        cnd = Cnd.where(ecid).desc("id");
                        total = rDao.count(Paper.class, Cnd.where(ecid));
                    }
                } else {
                    String keyString = "%" + key.trim() + "%";
                    SqlExpression etitle = Cnd.exps("title", "like", keyString);
                    SqlExpression ec_time = Cnd.exp("c_time", "like", keyString);
                    SqlExpression ecreator = Cnd.exp("creator", "like", keyString);
                    SqlExpression ecname = Cnd.exp("cname", "like", keyString);

                    if (-1 == cid) {
                        cnd = Cnd.where(ecname).or(ecreator).or(ec_time).or(etitle).desc("id");
                        total = rDao.count(Paper.class, Cnd.where(ecname).or(ecreator).or(ec_time).or(etitle));
                    } else {
                        cnd = Cnd.where(ecid).and(Cnd.exps(ecname).or(ecreator).or(ec_time).or(etitle)).desc("id");
                        total = rDao.count(Paper.class, Cnd.where(ecid).and(Cnd.exps(ecname).or(ecreator).or(ec_time).or(etitle)));
                    }
                }
                list = rDao.query(Paper.class, cnd, pager);

                log.debug("Got Question list:[" + Json.toJson(list) + "]");
                log.info("Got Question list size:[" + list.size() + "]");

                res.put("list", list);
                res.put("total", total);
            }
        });
        return res;
    }


    @At("/get")
    @GET
    public Object get(@Param("id") Long id) {
        final String PAPER_HEADER = "doe_paper_";
        final int DEFUALT_PAPER_TIME = 3600 * 2;//2hours

        if (null == id || id < 0) {
            log.error("PARAM ERROR: id:[" + id + "]");
            throw new RuntimeException("PARAM ERROR: id:[" + id + "]");
        }
        String key = PAPER_HEADER + id;
        Map<String, Object> paperMap = null;
        paperMap = (Map) cache.get(key);
        if (null != paperMap) {
            return paperMap;
        }
        Paper paper = rDao.fetch(Paper.class, id);
        if (null == paper) {
            log.error("CAN NOT FIND PAPER BY ID [" + id + "]");
            throw new RuntimeException("CAN NOT FIND PAPER BY ID [" + id + "]");
        }
        paperMap = new LinkedHashMap<String, Object>();

        paperMap.put("id", paper.getId());
        paperMap.put("title", paper.getTitle());
        paperMap.put("c_time", paper.getC_time());
        paperMap.put("cid", paper.getCid());
        paperMap.put("cname", paper.getCname());
        paperMap.put("creator", paper.getCreator());

        paperMap.put("groups", Json.fromJson(List.class, paper.getGroups()));
        paperMap.put("questions", Json.fromJson(Map.class, paper.getQuestions()));
        paperMap.put("score", paper.getScore());

        //add to cache
        cache.put(key, paperMap, DEFUALT_PAPER_TIME);
        return paperMap;

    }


    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }

    public void setwDao(Dao wDao) {
        this.wDao = wDao;
    }

    public void checkParam(String title, String creator, Long cid, String cname, String content) {
        if (ParamUtil.isNull(title, creator, cid, cname, content) || ParamUtil.isEmpty(title, creator, cname, content) || cid.longValue() < -1L) {
            log.error("PARAM ERROR: title:[" + title + "],creator:[" + creator + "],cid:[" + cid + "],cname:[" + cname + "],groups:[" + content + "]");
            throw new RuntimeException("PARAM ERROR: title:[" + title + "],creator:[" + creator + "],cid:[" + cid + "],cname:[" + cname + "],groups:[" + content + "]");
        }

    }

}
