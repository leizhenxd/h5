/**
 * 
 */
package com.lei.h5.controller.fourc;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;


/**
 * @author Administrator
 *
 */
@Controller
@RequestMapping("4c")
public class FourCController {
	private static Logger log = Logger.getLogger(FourCController.class);
	private static int visitNum = 0;
	
	@RequestMapping("getAnswers")
	@ResponseBody
	public int getAnswers(HttpServletResponse response, HttpServletRequest request, String q1, String q2, String q3){
		List<Map<String, Integer>> result = new ArrayList<Map<String, Integer>>();
		int rightNum = 0;
		if(Integer.valueOf(q1.split("-")[1]).equals(answers.get(Integer.valueOf(q1.split("-")[0])).get("answer")))
			rightNum ++;
		if(Integer.valueOf(q2.split("-")[1]).equals(answers.get(Integer.valueOf(q2.split("-")[0])).get("answer")))
			rightNum ++;
		if(Integer.valueOf(q3.split("-")[1]).equals(answers.get(Integer.valueOf(q3.split("-")[0])).get("answer")))
			rightNum ++;
		log.info("have "+ visitNum++ +" clients submit the answer");
		return rightNum;
	}
	@RequestMapping("getQuestions")
	@ResponseBody
	public String getQuestions(HttpServletResponse response, HttpServletRequest request, int q1, int q2, int q3){
		List<Map<String, Integer>> result = new ArrayList<Map<String, Integer>>();
		result.add(questions.get(q1));
		result.add(questions.get(q2));
		result.add(questions.get(q3));
		return new Gson().toJson(result);
	}
	
	
	public static List<Map<String, Integer>> answers = new ArrayList<Map<String, Integer>>();
	public static List<Map<String, Integer>> questions = new ArrayList<Map<String, Integer>>();
	static {
		Map<String, Integer> map1 = new HashMap<String, Integer>();
		map1.put("num", 4);
		map1.put("answer", 2);
		answers.add(map1);
		
		
		Map<String, Integer> map5 = new HashMap<String, Integer>();
		map5.put("num", 4);
		map5.put("answer", 1);
		answers.add(map5);
		
		Map<String, Integer> map6 = new HashMap<String, Integer>();
		map6.put("num", 3);
		map6.put("answer", 2);
		answers.add(map6);
		
		Map<String, Integer> map8 = new HashMap<String, Integer>();
		map8.put("num", 4);
		map8.put("answer", 3);
		answers.add(map8);
		
		Map<String, Integer> map9 = new HashMap<String, Integer>();
		map9.put("num", 3);
		map9.put("answer", 2);
		answers.add(map9);
	}
	
	static {
		Map<String, Integer> map1 = new HashMap<String, Integer>();
		map1.put("num", 4);
		map1.put("index", 0);
		questions.add(map1);
		
		
		Map<String, Integer> map5 = new HashMap<String, Integer>();
		map5.put("num", 4);
		map5.put("index", 1);
		questions.add(map5);
		
		Map<String, Integer> map6 = new HashMap<String, Integer>();
		map6.put("num", 3);
		map6.put("index", 2);
		questions.add(map6);
		
		
		Map<String, Integer> map8 = new HashMap<String, Integer>();
		map8.put("num", 4);
		map8.put("index", 3);
		questions.add(map8);
		
		Map<String, Integer> map9 = new HashMap<String, Integer>();
		map9.put("num", 3);
		map9.put("index", 4);
		questions.add(map9);
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
