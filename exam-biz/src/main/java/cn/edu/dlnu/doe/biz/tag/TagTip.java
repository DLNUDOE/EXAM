package cn.edu.dlnu.doe.biz.tag;

import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.sql.SqlCallback;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.mvc.adaptor.PairAdaptor;
import org.nutz.mvc.annotation.AdaptBy;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Fail;
import org.nutz.mvc.annotation.Ok;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-13
 * Time: 上午10:48
 */
@Ok("ioc:template")
@Fail("ioc:errorjson")
@AdaptBy(type = PairAdaptor.class)
@InjectName("tagTip")
@SuppressWarnings({"unchecked", "unused"})
public class TagTip {
    private Set<String> tagSet = new LinkedHashSet<String>();
    private static final int ADD_WEIGHT = 1;
    private static final int REMOVE_WEIGHT = 5;
    private static final int REPLACE_WEIGHT = 10;
    private int tagMaxLength = 0;
    private Dao rDao;
    private void loadTags() {
        Sql sql = Sqls.create("select kp from t_question where kp is not null");
        sql.setCallback(new SqlCallback() {
            @Override
            public Object invoke(Connection conn, ResultSet rs, Sql sql) throws SQLException {
                List<String> list = new LinkedList<String>();
                while (rs.next()) {
                    Collections.addAll(list, rs.getString("kp").split(","));
                }
                return list;
            }
        });
        rDao.execute(sql);
        tagSet.addAll(sql.getList(String.class));
    }

    public void init() {
        loadTags();
    }

    public void addToSet(String tag) {
        tagSet.add(tag);
    }

    public List<String> search(String target) {
        List<TagWeightPair> tagList = new ArrayList<TagWeightPair>();
        int targetLength = target.length();
        char[] targetCharAarray = target.toCharArray();
        int tagNum = tagSet.size();
        Set<String> preFind = new HashSet<String>();
        for (String tag : tagSet) {
            if (tag.length() > tagMaxLength) {
                tagMaxLength = tag.length();
            }
            if (findMatch(tag, target)) {
                int weight = computeWeight(tag, target);
                tagList.add(new TagWeightPair(tag, weight));
            }
        }
        Collections.sort(tagList);
        List<String> result = new ArrayList<String>();
        int bra = 0;
        for (TagWeightPair pair : tagList) {
            System.out.println("debug: str:" + pair.getTag() + " weight:" + pair.getWeight());
            result.add(pair.getTag());
            if (++bra == 10)
                break;
        }
        return result;
    }

    public boolean belike (String tag, String target) {
        if (findMatch(tag, target)) {
            int weight = computeWeight(tag, target);
            if (weight < 10) {
                return true;
            }
        }
        return false;
    }

    private boolean findMatch(String tag, String target) {
        for (int i = 0; i < tag.length(); i++) {
            for (int j = 0; j < target.length(); j++) {
                if (tag.charAt(i) == target.charAt(j))
                    return true;
            }
        }
        return false;
    }

    private int computeWeight(String tag, String target) {
        int[][] disMartix = new int[target.length() + 1][tag.length() + 1];
//        System.out.println("range:"+(tag.length()+1)+","+(target.length()+1));

        for (int i = 0; i <= target.length(); i++) {
            for (int j = 0; j <= tag.length(); j++) { disMartix[i][j] = Integer.MAX_VALUE;}
        }
        disMartix[0][0] = 0;
        for (int i = 0; i <= target.length(); i++) {
            for (int j = 0; j <= tag.length(); j++) {
                if (i > 0)
                    disMartix[i][j] = min(disMartix[i][j], disMartix[i - 1][j] + REMOVE_WEIGHT);
                if (j > 0)
                    disMartix[i][j] = min(disMartix[i][j], disMartix[i][j - 1] + ADD_WEIGHT);
                if (i > 0 && j > 0) {
                    if (target.charAt(i - 1) != tag.charAt(j - 1))
                        disMartix[i][j] = min(disMartix[i][j], disMartix[i - 1][j - 1] + REPLACE_WEIGHT);
                    else
                        disMartix[i][j] = min(disMartix[i][j], disMartix[i - 1][j - 1]);
                }
            }
        }
        return disMartix[target.length()][tag.length()];
    }

    private int min(int m, int n) {
        return m > n ? n : m;
    }

   class TagWeightPair implements Comparable {
        String tag;
        int weight;

        TagWeightPair(String tag, int weight) {
            this.tag = tag;
            this.weight = weight;
        }

        public String getTag() {
            return tag;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public int getWeight() {
            return weight;
        }

        public void setWeight(int weight) {
            this.weight = weight;
        }

        @Override
        public int compareTo(Object o) {
            if (o == null || !(o instanceof TagWeightPair)) {
                throw new RuntimeException("CAN NOT COMPARABLE target:[" + o + "]");
            }
            TagWeightPair tag = (TagWeightPair) o;
            if (this.getWeight() == tag.getWeight()){
                return tag.getTag().length() - this.getTag().length();
            }
            return this.getWeight() - tag.getWeight();
        }
    }

    public void setrDao(Dao rDao) {
        this.rDao = rDao;
    }
}
