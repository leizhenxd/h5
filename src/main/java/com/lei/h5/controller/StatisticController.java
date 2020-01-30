/**
 * 
 */
package com.lei.h5.controller;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lei.h5.model.StatisticLog;
import com.lei.h5.model.ThermosUser;


/**
 * @author Administrator
 *
 */
@Controller
@RequestMapping("statistic")
public class StatisticController {
	private static Logger log = Logger.getLogger(StatisticController.class);
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@RequestMapping("visit")
	public void visit(HttpServletResponse response, final HttpServletRequest request, final String type, final String project){
		log.info("visit client ip:"+ getIpAddr(request));
		try {
			jdbcTemplate.update("update statistic set visit = visit+1 where type='" + type + "'");
			jdbcTemplate.update("insert into statistic_log(type,ip,project) values(?,?,?)", new PreparedStatementSetter() {
				@Override
				public void setValues(PreparedStatement ps) throws SQLException {
					ps.setString(1, type);
					ps.setString(2, getIpAddr(request));
					ps.setString(3, project);
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping("statisticUser")
	@ResponseBody
	public List<ThermosUser> statisticUser(HttpServletResponse response, final HttpServletRequest request, final String type){
		log.info("visit client ip:"+ getIpAddr(request));
		try {
			return jdbcTemplate.query("select email,user_name,phone,score,strftime('%Y-%m-%d %H:%m:%S',create_time) from thermos where type = '"+type+"' order by create_time desc", new RowMapper<ThermosUser>(){

				@Override
				public ThermosUser mapRow(ResultSet arg0, int arg1)
						throws SQLException {
					ThermosUser user = new ThermosUser();
					user.setEmail(arg0.getString(1));
					user.setName(arg0.getString(2));
					user.setPhone(arg0.getString(3));
					user.setScore(arg0.getInt(4));
					user.setCreateTime(arg0.getString(5));
					return user;
				}
				
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("statisticLog")
	@ResponseBody
	public List<StatisticLog> statisticLog(HttpServletResponse response, final HttpServletRequest request, final String project){
		log.info("visit client ip:"+ getIpAddr(request));
		try {
			return jdbcTemplate.query("select type, strftime('%Y-%m-%d',create_time) as log_day, count(1) from statistic_log where project='"+project+"' group by type,log_day order by log_day desc,type desc", new RowMapper<StatisticLog>(){

				@Override
				public StatisticLog mapRow(ResultSet arg0, int arg1)
						throws SQLException {
					StatisticLog log = new StatisticLog();
					log.setType(arg0.getString(1));
					log.setLogDay(arg0.getString(2));
					log.setCount(arg0.getInt(3));
					return log;
				}
				
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private String getIpAddr(HttpServletRequest request) {   
	     String ipAddress = null;   
	     //ipAddress = request.getRemoteAddr();   
	     ipAddress = request.getHeader("x-forwarded-for");   
	     if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {   
	      ipAddress = request.getHeader("Proxy-Client-IP");   
	     }   
	     if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {   
	         ipAddress = request.getHeader("WL-Proxy-Client-IP");   
	     }   
	     if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {   
	      ipAddress = request.getRemoteAddr();   
	      if(ipAddress.equals("127.0.0.1")){   
	       //根据网卡取本机配置的IP   
	       InetAddress inet=null;   
	    try {   
	     inet = InetAddress.getLocalHost();   
	    } catch (UnknownHostException e) {   
	     e.printStackTrace();   
	    }   
	    ipAddress= inet.getHostAddress();   
	      }   
	            
	     }   
	  
	     //对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割   
	     if(ipAddress!=null && ipAddress.length()>15){ //"***.***.***.***".length() = 15   
	         if(ipAddress.indexOf(",")>0){   
	             ipAddress = ipAddress.substring(0,ipAddress.indexOf(","));   
	         }   
	     }   
	     return ipAddress;    
	  }
}
