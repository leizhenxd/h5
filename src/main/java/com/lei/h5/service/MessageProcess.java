package com.lei.h5.service;

import java.util.List;
import java.util.Properties;
import java.util.Random;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.google.gson.Gson;
import com.lei.h5.controller.util.MediaOperator;
import com.lei.h5.controller.util.MessageOperator;
import com.lei.h5.lowbattery.LowBattery;
import com.lei.h5.model.WxAutoReply;

@Service
public class MessageProcess {
	private static Logger log = LoggerFactory.getLogger(MessageProcess.class);
	@Autowired
	Properties settings;
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	public String xbAutoReply(Document doc) throws Exception {
		NodeList nl = doc.getElementsByTagName("MsgType");
		String msgType = nl.item(0).getTextContent().trim();
		if("image".equals(msgType)) {
			String mediaId = doc.getElementsByTagName("MediaId").item(0).getTextContent();
			String fileName = UUID.randomUUID().toString().replaceAll("-", "") + ".jpg";
			String path = settings.getProperty("static.path")+"wxapp/lowbattery/origin/" + fileName; 
			MediaOperator.download(mediaId, path);
			log.info("image path:"+path);
			LowBattery.instance.setBasePath(settings.getProperty("assert.path"));
			float result = LowBattery.instance.processScreenShot(path, settings.getProperty("static.path") + "wxapp/lowbattery/result/" + fileName, new Random().nextInt(10));
			System.out.println(result+"-"+settings.getProperty("static.path")+"wxapp/lowbattery/result/"+ fileName);
	        if(result < 0) {
	        	return MessageOperator.replyText(doc.getElementsByTagName("ToUserName").item(0).getTextContent(),doc.getElementsByTagName("FromUserName").item(0).getTextContent(), "图片格式不正确,请截图并选择发送原图");
	        }
			return MessageOperator.replyImage(doc.getElementsByTagName("ToUserName").item(0).getTextContent(),doc.getElementsByTagName("FromUserName").item(0).getTextContent(),settings.getProperty("static.path") + "wxapp/lowbattery/result/" + fileName);
		}
		else if("text".equals(msgType)) {
			String key = doc.getElementsByTagName("Content").item(0).getTextContent().trim();
			log.info("receive message content:{}", key);
			List<WxAutoReply> list = getReplyTemplate(msgType, key);
			log.info("message template:{}", new Gson().toJson(list));
			if(list != null && list.size() > 0) {
				if("text".equals(list.get(0).getReturnType())) {
					return MessageOperator.replyText(doc.getElementsByTagName("ToUserName").item(0).getTextContent(),doc.getElementsByTagName("FromUserName").item(0).getTextContent(), list.get(0).getContent());
				}
			}
			return MessageOperator.replyText(doc.getElementsByTagName("ToUserName").item(0).getTextContent(),doc.getElementsByTagName("FromUserName").item(0).getTextContent(), "微信内截图，回复截图图片并选择[原图]");
		}
		else if("event".equals(msgType)) {
			String eventType = doc.getElementsByTagName("Event").item(0).getTextContent().trim();
			List<WxAutoReply> list = getReplyTemplate(msgType, eventType);
			if(list != null && list.size() > 0) {
				if("text".equals(list.get(0).getReturnType())) {
					return MessageOperator.replyText(doc.getElementsByTagName("ToUserName").item(0).getTextContent(),doc.getElementsByTagName("FromUserName").item(0).getTextContent(), list.get(0).getContent());
				}
			}
		}
		
		
		return "success";
	}
	
	private List<WxAutoReply> getReplyTemplate(String type,String key){
		return jdbcTemplate.query("select id,key,content,type,return_type from wx_auto_reply where type='"+type+"' and key='"+key+"'", new BeanPropertyRowMapper<WxAutoReply>(WxAutoReply.class));
	}
}
