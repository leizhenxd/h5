package com.lei.h5.controller.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;
import java.util.Map;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.lei.h5.model.WXSignMsg;
/**
 * 
 * appID:wx7db444f1023a797d
 * secretKey:2b761461faa358a94faaa905b199a5f2
 * @author Administrator
 *
 */
@Component
public class SignContext implements InitializingBean{
	
	public static String appid = "";
	public static String noncestr = "";
	public static String secretKey = "";

	@Autowired
	private Properties settings;
	//own
//	public static String appid = "wx3186816a7bd3b649";
//	public static String noncestr = "lilei";
//	public static String secretKey = "48ee3147d65221268edcbf26f85527b3";
	public static String accessToken = null;
	public static String ticket;
	public static long acLastUpdateTime = System.currentTimeMillis();
	private static boolean needGetTicket = true;;
	
	private static Logger log = LoggerFactory.getLogger(SignContext.class);
	
	//12ad34be35c
	
	public static String getAccessToken() throws Exception{
		long curTime = System.currentTimeMillis();
		log.info("appid:"+appid);
		
		if(accessToken != null && curTime-acLastUpdateTime < 3600*1500)
			return accessToken;
		FetchWebMsg fwm = new FetchWebMsg();
		System.out.println("get a new accessToken");
		String access_token = fwm.fetchWeb("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appid+"&secret="+secretKey);
		log.info(access_token);
		Gson gson = new Gson();
		System.out.println(gson.fromJson(access_token, Map.class).get("access_token"));
		accessToken = (String) gson.fromJson(access_token, Map.class).get("access_token");
		acLastUpdateTime = curTime;
		needGetTicket = true;
		 
		return accessToken;
	}
	
	public static String webGetAccessToken() throws Exception {
		return new FetchWebMsg().fetchWeb("http://lowbattery.leizhenxd.com/getWxAccessToken.htm");
	}
	
	public static Map<String, Object> getUserAccessToken (String code) throws Exception{
		FetchWebMsg fwm = new FetchWebMsg();
		String access_token = fwm.fetchWeb("https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid+"&secret="+secretKey+"&code="+ code +"&grant_type=authorization_code");
		log.info(access_token);
		return new Gson().fromJson(access_token, Map.class);
	}
	public static Map<String, Object> getUserInfo (String token, String openid) throws Exception{
		FetchWebMsg fwm = new FetchWebMsg();
		String result = fwm.fetchWeb("https://api.weixin.qq.com/sns/userinfo?access_token="+token+"&openid="+openid+"&lang=zh_CN");
		return  new Gson().fromJson(result, Map.class);
	}
	public static Map<String, Object> getUserInfo (String code) throws Exception{
		Map<String, Object> accessData = getUserAccessToken(code);
		FetchWebMsg fwm = new FetchWebMsg();
		String result = fwm.fetchWeb("https://api.weixin.qq.com/sns/userinfo?access_token="+accessData.get("access_token")+"&openid="+accessData.get("openid")+"&lang=zh_CN");
		System.out.println(result);
		return  new Gson().fromJson(result, Map.class);
	}
	public static boolean verifyUserAccessToken(String token, String openid) throws Exception{
		FetchWebMsg fwm = new FetchWebMsg();
		String result = fwm.fetchWeb("https://api.weixin.qq.com/sns/auth?access_token="+token+"&openid="+openid);
		System.out.println(result);
		if("ok".equals(new Gson().fromJson(result, Map.class).get("errmsg"))){
			return true;
		}
		return false;
	}
	public static String getJsapiTicket() throws Exception{
		getAccessToken();
		if(! needGetTicket && ticket!= null)
			return ticket;
		FetchWebMsg fwm = new FetchWebMsg();
		Gson gson = new Gson();
		log.info("get a new jsapi ticket");
		ticket = (String) gson.fromJson(fwm.fetchWeb("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+ accessToken +"&type=jsapi"), Map.class).get("ticket");
		needGetTicket = false;
		return ticket;
	}
	
	public static String getSign(String url) throws Exception{
		String s = "jsapi_ticket=" + getJsapiTicket()
					+ "&noncestr=" + "vicecity" + "&timestamp=" + 1414587457
					+ "&url=" + "http://h5.leizhenxd.com/" + url;
		String signature = SHAsum(s.getBytes());
		return signature;
	}
	public static WXSignMsg getSignature(String url) throws Exception{
		String s = "jsapi_ticket=" + getJsapiTicket()
				+ "&noncestr=" + noncestr + "&timestamp=" + 1414587457
				+ "&url=" + url;
		String signature = SHAsum(s.getBytes());
		WXSignMsg result = new WXSignMsg();
		result.setAppid(appid);
		result.setNonceStr(noncestr);
		result.setSignature(signature);
		result.setTimestamp("1414587457");
		return result;
	}
	
	public static String SHAsum(byte[] convertme)
			throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("SHA-1");
		return byteArray2Hex(md.digest(convertme));
	}

	private static String byteArray2Hex(final byte[] hash) {
		Formatter formatter = new Formatter();
		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		try {
			return formatter.toString();
		} catch (Exception e) {
			return null;
		}finally{
			formatter.close();
		}
	}
	
	public static void main(String[] args) {
		try {
//			System.out.println(SignContext.getUserAccessToken("04185ed65071bf576d52cbfa9898d0bK"));
//			System.out.println(SignContext.getUserInfo("OezXcEiiBSKSxW0eoylIeN_JviArHworzRgRbSgMGnLuRaWCURqUYweZqwid5B-j2dR4aWUJAWpHHYHXz8LhRfB_Nwxt-Ul8n2lW6p_QLcTUuzlUgt2K0rIDksphAlT97RfMRMRPtgH7U7GEOonsdA", "ohGc-sxZxK8sq9StynV9xjcVZjsc"));
//			System.out.println(SignContext.verifyUserAccessToken("OezXcEiiBSKSxW0eoylIeN_JviArHworzRgRbSgMGnLuRaWCURqUYweZqwid5B-j2dR4aWUJAWpHHYHXz8LhRfB_Nwxt-Ul8n2lW6p_QLcTUuzlUgt2K0rIDksphAlT97RfMRMRPtgH7U7GEOonsdA", "ohGc-sxZxK8sq9StynV9xjcVZjsc"));
			System.out.println(getAccessToken());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		appid = settings.getProperty("wx.appid");
		noncestr = settings.getProperty("wx.noncestr");
		secretKey = settings.getProperty("wx.secretKey");
	}
}
