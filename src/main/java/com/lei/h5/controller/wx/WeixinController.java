/**
 * 
 */
package com.lei.h5.controller.wx;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.w3c.dom.Document;

import com.lei.h5.controller.util.SignContext;
import com.lei.h5.model.WXSignMsg;
import com.lei.h5.service.MessageProcess;


/**
 * @author Administrator
 *
 */
@Controller
public class WeixinController {
	private static Logger log = LoggerFactory.getLogger(WeixinController.class);
	private static int visitNum = 0;
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@Autowired
	Properties settings;
	
	@Autowired
	MessageProcess messageProcess;
	
	@RequestMapping("getSignature")
	public void getSignature(HttpServletResponse response, HttpServletRequest request, String type){
		log.info("visit no: " + visitNum++ + " client ip:"+ getIpAddr(request));
		try {
			jdbcTemplate.update("update statistic set visit = visit+1 where type='" + type + "'");
			response.getWriter().write(SignContext.getSign(request.getParameter("url")));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("getWxSignature")
	@ResponseBody
	public WXSignMsg getWxSignature(HttpServletResponse response, HttpServletRequest request, String type){
		try {
			log.info("请求参数:{}", getParameterMap(request));
			return SignContext.getSignature(request.getParameter("url"));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("getWxAccessToken")
	@ResponseBody
	public String getWxAccessToken(){
		try {
			return SignContext.getAccessToken();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("getWxWebSignature")
	@ResponseBody
	public String getWxWebSignature(HttpServletRequest request){
		HttpMethod method = null;
		PostMethod post = null;
		HttpClient client = new HttpClient();
		try {
			Map<String, String[]> map = request.getParameterMap();
			
			String params = "";
			for(String s : map.keySet()) {
				params += ("&"+ s+"="+ URLEncoder.encode(map.get(s)[0], "utf-8"));
			}
			log.info("请求参数:{}", params);
			post = new PostMethod("http://lowbattery.leizhenxd.com/getWxSignature.htm?1=1"+params);
			post.setRequestBody(request.getInputStream());
			client.executeMethod(post);
			String result = post.getResponseBodyAsString();
			log.info("签名结果:{}",result);
			return result;
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally {
			if(method != null)
				method.releaseConnection();
			if(post != null)
				post.releaseConnection();
		}
		return "";
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
	
	@RequestMapping("lbverifyurl")
	@ResponseBody
	public String lbverifyurl(HttpServletRequest request, HttpServletResponse response) {
		String signature = request.getParameter("signature");
		String timestamp = request.getParameter("timestamp");
		String nonce = request.getParameter("nonce");
		String echostr = request.getParameter("echostr");
		try {
			InputStream is = request.getInputStream();
//			System.out.println(IOUtils.toString(is));
			if(is != null) {
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();   
				DocumentBuilder builder = factory.newDocumentBuilder();
				Document doc = builder.parse(IOUtils.toInputStream("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+IOUtils.toString(is, "UTF-8")));

				return messageProcess.xbAutoReply(doc);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return echostr;
		}
//		return echostr;
		return "success";
	}
	
	@RequestMapping("verifyurl")
	@ResponseBody
	public String verifyurl(HttpServletRequest request, HttpServletResponse response) {
		String signature = request.getParameter("signature");
		String timestamp = request.getParameter("timestamp");
		String nonce = request.getParameter("nonce");
		String echostr = request.getParameter("echostr");
		return echostr;
	}
	
	private Map<String, String> getParameterMap(HttpServletRequest request){
		Map<String, String[]> parameterMap = request.getParameterMap();
		Map<String, String> result = new HashMap<String, String>();
		Set<String> keys = parameterMap.keySet();
		if(keys != null) {
			for(String key : keys) {
				result.put(key, parameterMap.get(key)[0]);
			}
		}
		
		return result;
	}
}
