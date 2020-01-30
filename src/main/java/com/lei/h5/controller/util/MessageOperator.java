package com.lei.h5.controller.util;

import org.w3c.dom.Document;

public class MessageOperator {
	
	public static String replyText(String fromUser, String toUser,String text) {
		StringBuffer sb = new StringBuffer();
		sb.append("<xml>\n");
		sb.append("<ToUserName><![CDATA["+toUser+"]]></ToUserName>\n");
		sb.append("<FromUserName><![CDATA["+fromUser+"]]></FromUserName>\n");
		sb.append("<CreateTime>"+System.currentTimeMillis()+"</CreateTime>\n");
		sb.append("<MsgType><![CDATA[text]]></MsgType>\n");
		sb.append("<Content><![CDATA["+text+"]]></Content>\n");
		sb.append("</xml>\n");
		return sb.toString();
	}

	public static String replyImage(String fromUser, String toUser,String filePath) {
		String mediaId = null;
		try {
			mediaId = MediaOperator.uploadTempFile(filePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		StringBuffer sb = new StringBuffer();
		sb.append("<xml>\n");
		sb.append("<ToUserName><![CDATA["+toUser+"]]></ToUserName>\n");
		sb.append("<FromUserName><![CDATA["+fromUser+"]]></FromUserName>\n");
		sb.append("<CreateTime>"+System.currentTimeMillis()+"</CreateTime>\n");
		sb.append("<MsgType><![CDATA[image]]></MsgType>\n");
		sb.append("<Image>\n");
		sb.append("<MediaId><![CDATA["+mediaId+"]]></MediaId>\n");
		sb.append("</Image>\n");
		sb.append("</xml>\n");
		return sb.toString();
	}
}
