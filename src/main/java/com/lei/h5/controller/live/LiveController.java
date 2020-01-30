/**
 * 
 */
package com.lei.h5.controller.live;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.lei.h5.jaguar.MemoryCache;
import com.lei.h5.jaguar.Score;
import com.lei.h5.sqlite.SQLiteSource;


/**
 * @author Administrator
 *
 */
@Controller
@RequestMapping("live")
public class LiveController {
	
	/**
	 * 	id-StreamName
	 * 	app-live.leizhenxd.com
	 * 	time-1473477101
	 * 	node-eu6
	 * 	usrargs-vhost=live.leizhenxd.com
	 *	appname-jaguar
	 *	action-publish
	 *	ip-180.171.171.143
	 * @param request
	 */
	@RequestMapping("notify")
	@ResponseBody
	public void nofity(HttpServletRequest request){
		
		String action = request.getParameter("action");
		if("publish".equals(action)) {
			MemoryCache.isPublish = true;
		}
		if("publish".equals(action)) {
			MemoryCache.isPublish = false;
		}
		Map<String, String[]> map = request.getParameterMap();
		Set<String> keys = map.keySet();
		for(String key : keys) {
			System.out.println(key+"-"+map.get(key)[0]);
		}
		System.out.println(request.getParameterMap());
	}

	@RequestMapping("status")
	@ResponseBody
	public ResponseEntity<String> status(HttpServletRequest request){
		HttpStatus statusCode = HttpStatus.OK;
		MultiValueMap<String, String> headers = new HttpHeaders();
		headers.add("Content-Type", "text/event-stream");
		headers.add("Cache-Contro", "no-cache");
		ResponseEntity<String> resp =  new ResponseEntity<String>(MemoryCache.isPublish + "\n\n", headers, statusCode);
		return resp;
	}
	
	@RequestMapping("/scoreList")
	public String getScoreList() {
		Connection conn = SQLiteSource.getConnection();
		Statement stmt = null;
		List<Score> result = new ArrayList<Score>();
		try {
			stmt = conn.createStatement();
			ResultSet resultSet = stmt.executeQuery("select name,score from jaguar_score order by score desc limit 10");
			while(resultSet.next()) {
				Score s = new Score();
				s.setName(resultSet.getString("name"));
				s.setScore(resultSet.getLong("score"));
				result.add(s);
			}
			return new Gson().toJson(result);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			
				try {
					if(conn != null) conn.close();
					if(stmt != null) stmt.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
		}
		return null;
		
	}
	
	@RequestMapping("/recordScore")
	@ResponseBody
	public void score(String name, Long score, HttpSession session) {
		if(name == null || score == null) return ;
		Connection conn = SQLiteSource.getConnection();
		PreparedStatement stmt = null;
		try {
			stmt = conn.prepareStatement("insert into jaguar_score(name, score) values(?,?)");
			stmt.setString(1, name);
			stmt.setLong(2, score);
			int resultInt = stmt.executeUpdate();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			
				try {
					if(conn != null) conn.close();
					if(stmt != null) stmt.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
		}
	}
	
	public static void main(String[] args) {
		LiveController l = new LiveController();
//		l.score("李四", 23132L);
		System.out.println(l.getScoreList());
	}
}
