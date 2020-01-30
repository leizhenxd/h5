package com.lei.h5.controller.wx;

import java.net.URLEncoder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.lei.h5.controller.util.SignContext;

@Controller
public class WxAuthorizeController {

	Logger log = LoggerFactory.getLogger(WxAuthorizeController.class);
	
	@RequestMapping("/authorize/{gameType}")
	public ModelAndView gameType(@PathVariable String gameType) throws Exception {
		StringBuffer sb = new StringBuffer("https://open.weixin.qq.com/connect/oauth2/authorize?appid=").append(SignContext.appid)
				.append("&redirect_uri=").append(URLEncoder.encode("http://h5.leizhenxd.com/authorizecb.htm", "utf-8"))
				.append("&response_type=code")
				.append("&scope=snsapi_userinfo")
//				.append("&scope=snsapi_base")
				.append("#wechat_redirect");
				
		ModelAndView mv = new ModelAndView("redirect:"+sb.toString());
		return mv;
	}
	
	@RequestMapping("authorizecb")
	public String authorizeCallback(String code) throws Exception {
		log.info("authorize code {}", code);
		log.info("user wxinfo:{}", SignContext.getUserInfo(code));
		return "redirect:http://h5.leizhenxd.com/h5/lowbattery/index.html";
	}
}
