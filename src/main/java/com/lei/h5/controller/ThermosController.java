/**
 * 
 */
package com.lei.h5.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Properties;
import java.util.Random;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.drew.imaging.jpeg.JpegMetadataReader;
import com.drew.imaging.jpeg.JpegProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifDirectoryBase;
import com.lei.h5.controller.util.MediaOperator;
import com.lei.h5.model.ThermosUser;

import sun.misc.BASE64Decoder;


/**
 * @author Administrator
 *
 */
@Controller
public class ThermosController {
	Logger logger = LoggerFactory.getLogger(ThermosController.class);
	@Autowired
	JdbcTemplate jdbcTemplate;
	@Autowired
	Properties settings;
	
	@RequestMapping("/thermos/index")
	public String index() {
		return "redirect:/h5/thermos/leopard.html";
	}
	
	@RequestMapping("/thermos/adduser")
	@ResponseBody
	public void addUser(HttpServletResponse response, HttpServletRequest request, final ThermosUser user){
		if(user.getPhone() == null) return ;
		int row = jdbcTemplate.queryForInt("select count(1) from thermos where phone='" + user.getPhone()+ "'");
		if(row == 0) {
			jdbcTemplate.update("insert into thermos(user_name,email,phone,type,score) values(?,?,?,?,?)", new PreparedStatementSetter() {
				@Override
				public void setValues(PreparedStatement ps) throws SQLException {
					ps.setString(1, user.getName());
					ps.setString(2, user.getEmail());
					ps.setString(3, user.getPhone());
					ps.setInt(4, user.getType());
					ps.setInt(5, user.getScore());
				}
			});
		}
	}
	
	@RequestMapping(value="/thermos/upload")
	@ResponseBody
	public void upload(String img, HttpServletResponse response, String r) {
		logger.info("upload a file r={}",r);
		String fileName = decodeBase64ToImage(img, settings.getProperty("upload.path"));
		try {
			response.getWriter().write(fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
		finally{
			try {
				response.getWriter().close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	@RequestMapping(value="/upload")
	@ResponseBody
	public String upload(
			HttpServletRequest request,
			String serverId,
			ModelMap model){
		System.out.println(request.getRealPath("/"));
        String path = request.getRealPath("/") + "/temp";  
        String fileName = UUID.randomUUID().toString()+ getRandomStr(5) + ".jpg";
        File targetFile = new File(path);  
        if(!targetFile.exists()){  
            targetFile.mkdirs();  
        }
        targetFile = new File(path,fileName);
        try {
			MediaOperator.download(serverId, path + "/" + fileName);
//			System.out.println(getExifInfo(path + "/" + fileName));
		} catch (Exception e2) {
			e2.printStackTrace();
		}
        
        
		return fileName;
	}
	
	@RequestMapping("/share")
	@ResponseBody
	public void share(String type) {
		jdbcTemplate.update("update statistic set share = share+1 where type='" + type + "'");
	}
	@RequestMapping("/goshop")
	@ResponseBody
	public void goshop(String type, HttpServletRequest request,@RequestParam(defaultValue="1",value="linktype") Integer linktype) {
		logger.info(getIpAddr(request)+" have click shop link{}", linktype);
		if(linktype == 1) {
			jdbcTemplate.update("update statistic set jdlink = jdlink+1 where type='" + type + "'");
		}
		else{
			jdbcTemplate.update("update statistic set jdlink2 = jdlink2+1 where type='" + type + "'");
		}
	}
	private int getExifInfo(String path) throws JpegProcessingException, MetadataException{
		File jpegFile = new File(path);  
        Metadata metadata = null;
		try {
			metadata = JpegMetadataReader.readMetadata(jpegFile);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
        Directory exif = metadata.getFirstDirectoryOfType(ExifDirectoryBase.class);
        if (!exif.containsTag(ExifDirectoryBase.TAG_ORIENTATION)) return 0;  
        int orientation = exif.getInt(ExifDirectoryBase.TAG_ORIENTATION);  
        switch (orientation) {  
            case 1: return 0;//"Top, left side (Horizontal / normal)";  
//            case 2: return "Top, right side (Mirror horizontal)";  
            case 3: return 180;//"Bottom, right side (Rotate 180)";  
//            case 4: return "Bottom, left side (Mirror vertical)";  
//            case 5: return "Left side, top (Mirror horizontal and rotate 270 CW)";  
            case 6: return 90;//"Right side, top (Rotate 90 CW)";  
//            case 7: return "Right side, bottom (Mirror horizontal and rotate 90 CW)";  
            case 8: return 270;//"Left side, bottom (Rotate 270 CW)";  
            default:  
                return 0;//String.valueOf(orientation);  
        }  
//        Iterator tags = exif.getTagIterator();  
//        while (tags.hasNext()) {  
//            Tag tag = (Tag)tags.next();  
//            System.out.println(tag);  
//        } 
	}
	public static String decodeBase64ToImage(String base64, String path) {
		BASE64Decoder decoder = new BASE64Decoder();
		String [] imgMsg = base64.split(",");
		String ext = imgMsg[0].substring(imgMsg[0].lastIndexOf("/")+1,imgMsg[0].lastIndexOf(";"));
		String fileName = UUID.randomUUID().toString().replace("-", "") +"."+ext;
		try {
			FileOutputStream write = new FileOutputStream(new File(path
					+ fileName));
			byte[] decoderBytes = decoder.decodeBuffer(imgMsg[1]);
			write.write(decoderBytes);
			write.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fileName;
	}
	private String getRandomStr(int len){
		if(len < 1) return "";
		StringBuffer sb = new StringBuffer();
		Random rd = new Random(Calendar.getInstance().getTimeInMillis());
		for(int i=0; i<len; i++){
			int rdNum =  rd.nextInt(122);
			if(rdNum >= 97 || (rdNum<=90 && rdNum>=65))
				sb.append((char)rdNum);
			else
				sb.append(rdNum%10);
			
		}
		return sb.toString();
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
