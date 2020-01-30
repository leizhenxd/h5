package com.lei.h5.controller.util;



import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

/**
 * 用于从指定的网站上抓取html数据
 * @author Administrator
 *
 */
public class FetchWebMsg
{
	
	private StringBuffer content;
	private BufferedReader br;
	private String str = "";
	
	/**
	 * 从给定的网站中抓取html页面的信息
	 * @param url 需要获取数据的网页
	 * @return 返回字符串形式的html页面内容
	 * @throws Exception
	 */
	public  String fetchWeb(String url) throws Exception
	{
		URL newUrl = new URL(url);
		URLConnection urlConnection = newUrl.openConnection();
		
		//如果正确的链接上网络
		br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(),"utf-8"));
		content = new StringBuffer();
		while ((str = br.readLine()) != null)
		{
			content.append(str);
		}
		br.close();
		return content.toString();
	}
	
	public  String fetchWeb(String url, String charset) throws Exception
	{
		URL newUrl = new URL(url);
		URLConnection urlConnection = newUrl.openConnection();
		
		//如果正确的链接上网络
		br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(),charset));
		content = new StringBuffer();
		while ((str = br.readLine()) != null)
		{
			content.append(str);
		}
		br.close();
		return content.toString();
	}
	public static void main(String[] args) {
		FetchWebMsg f = new FetchWebMsg();
		try {
			System.out.println(f.fetchWeb("http://www.weather.com.cn/html/weather/101280601.shtml"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
