package com.lei.h5.controller;

import java.io.File;
import java.util.Properties;
import java.util.Random;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.lei.h5.controller.util.MediaOperator;
import com.lei.h5.lowbattery.LowBattery;

@Controller
@RequestMapping("wxapp")
public class WXAppUploader {
	Logger log = LoggerFactory.getLogger(WXAppUploader.class);
	@Autowired
	Properties settings;
	
	@RequestMapping(value="/upload")
	@ResponseBody
	public String upload(@RequestParam(value = "file", required = false) MultipartFile file,int imgWidth,int imgHeight){
		
        String path = settings.getProperty("static.path")+"wxapp/lowbattery/origin/"; 
        System.out.println(imgWidth+"-"+imgHeight);
        String fileName = UUID.randomUUID().toString().replaceAll("-", "") + StringUtils.getFilenameExtension(file.getOriginalFilename());
        File targetFile = new File(path);  
        if(!targetFile.exists()){  
            targetFile.mkdirs();  
        }
        targetFile = new File(path,fileName);
        //淇濆瓨  
        try {  
            file.transferTo(targetFile);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }
       
        float result;
		try {
			System.out.println("set base path"+settings.getProperty("assert.path"));
			System.out.println(LowBattery.instance);
			LowBattery.instance.setBasePath(settings.getProperty("assert.path"));
			System.out.println("set base path end");
			result = LowBattery.instance.processScreenShot(settings.getProperty("static.path") + "wxapp/lowbattery/origin/" + fileName, settings.getProperty("static.path") + "wxapp/lowbattery/result/" + fileName, 4);
			System.out.println(settings.getProperty("static.path")+"wxapp/lowbattery/result/"+ fileName);
	        if(result < 0) {
	        	return "fail";
	        }
		} catch (Exception e) {
			e.printStackTrace();
		}
        
		return settings.getProperty("static.url.pre")+"wxapp/lowbattery/result/"+ fileName;
	}
	
	@RequestMapping(value="/uploadServerId")
	@ResponseBody
	public String uploadServerId(HttpServletRequest request, String serverId, @RequestParam(defaultValue="temp") String pageType, @RequestParam(defaultValue="1")Integer percent){
		percent = new Random().nextInt(5)+1;
        String path = settings.getProperty("static.path")+"wxapp/"+pageType+"/origin/";
        String resultPath = settings.getProperty("static.path") + "wxapp/"+pageType+"/result/";
        String fileName = UUID.randomUUID().toString().replaceAll("-", "") + ".jpg";
        File targetFile = new File(path);  
        File resultFile = new File(resultPath);
        if(!targetFile.exists()){  
            targetFile.mkdirs();  
        }
        if(!resultFile.exists()){  
        	resultFile.mkdirs();  
        }
        try {
			MediaOperator.download(serverId, path + fileName);
			float result;
			try {
				log.info("percent:{}", percent);
				LowBattery.instance.setBasePath(settings.getProperty("assert.path"));
				result = LowBattery.instance.processScreenShot(path + fileName, settings.getProperty("static.path") + "wxapp/"+pageType+"/result/" + fileName, percent);
		        if(result < 0) {
		        	/**
		        	 *  -1 输入的参数有误
						-2 打不开源图片
						-3 分辨率不匹配任何设备
						-4 不支持的设备(4S和Pad1)
						-5 源图片可能不是微信截屏
						-6 保存图片失败
		        	 */
		        	System.out.println("处理结果："+result);
		        	return LowBatteryStatus.getMsgByCode((int)result);
		        }
			} catch (Exception e) {
				e.printStackTrace();
				log.error("{}", e);
			}finally {
//				new File(path + fileName).delete();
			}
	        log.info("上传文件结果:{}", settings.getProperty("static.url.pre")+"wxapp/"+pageType+"/result/"+ fileName);
			return settings.getProperty("static.url.pre")+"wxapp/"+pageType+"/result/"+ fileName;
		} catch (Exception e2) {
			e2.printStackTrace();
			log.error("{}", e2);
		}
        
		return fileName;
	}
	
	@RequestMapping(value="/upload1")
	@ResponseBody
	public String upload1(int imgWidth,int imgHeight){
		
       
		try {
			System.out.println("set base path"+settings.getProperty("assert.path"));
			System.out.println(LowBattery.instance);
//			LowBattery.instance.setBasePath(settings.getProperty("assert.path"));
//			System.out.println("set base path end");
//			result = LowBattery.instance.processScreenShot(settings.getProperty("static.path") + "wxapp/lowbattery/origin/" + fileName, imgWidth, imgHeight, settings.getProperty("static.path") + "wxapp/lowbattery/result/" + fileName);
//			System.out.println(settings.getProperty("static.path")+"wxapp/lowbattery/result/"+ fileName);
//	        if(result < 0) {
//	        	return "fail";
//	        }
		} catch (Exception e) {
			e.printStackTrace();
			
		}
//        LowBattery.instance.processScreenShot("D:/test.jpg", 640, 1136, "D:/test1.jpg");
       
        
		return "http://static.leizhenxd.com/wxapp/lowbattery/result/";
	}
	
	public enum LowBatteryStatus {
		F1(-1, "输入的参数有误"),
		F2(-2, "打不开源图片"),
		F3(-3, "分辨率不匹配任何设备"),
		F4(-4, "不支持的设备(4S和Pad1)"),
		F5(-5, "源图片可能不是微信截屏"),
		F6(-6, "保存图片失败");
		public Integer code;
		public String msg;
		private LowBatteryStatus(Integer code, String msg) {
			this.code = code;
			this.msg = msg;
		}
		public static String getMsgByCode(Integer code) {
			for(LowBatteryStatus status : LowBatteryStatus.values()) {
				if(status.code == code) 
					return status.msg;
			}
			return null;
		}
	}
	@RequestMapping(value="/test")
	@ResponseBody
	public String test(String text) {
		log.info("####{}", text);
		return "OK";
	}
	
	public static void main(String[] args) {
		System.out.println(new Random().nextInt(5));
	}
}
