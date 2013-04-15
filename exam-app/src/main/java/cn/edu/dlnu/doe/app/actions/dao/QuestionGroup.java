package cn.edu.dlnu.doe.app.actions.dao;

import java.util.Map;
@SuppressWarnings({"unchecked", "unused"})
public class QuestionGroup {

	private String title;
	private String desc;
	private Map<String, Integer> scoreMap;
	
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}

    public Map<String, Integer> getScoreMap() {
        return scoreMap;
    }

    public void setScoreMap(Map<String, Integer> scoreMap) {
        this.scoreMap = scoreMap;
    }
}
