package com.lei.h5.controller.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class MediaOperator {
	private static Logger log = LoggerFactory.getLogger(MediaOperator.class);
	static String url = "https://file.api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID";
	private static String downloadUrl = "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=image";

	public static void download(String serverId, String path) throws Exception {
		String downloadUrl = url.replace("ACCESS_TOKEN",
				SignContext.webGetAccessToken()).replace("MEDIA_ID", serverId);
		log.info("download mediaId:{}", serverId);
		HttpClient client = new HttpClient();
		GetMethod getMethod = new GetMethod(downloadUrl);
		client.executeMethod(getMethod);
		byte[] bs = getMethod.getResponseBody();
		OutputStream os = new FileOutputStream(path);
		os.write(bs);
		os.flush();
		os.close();
		getMethod.releaseConnection();
	}

	public static String uploadTempFile(String path) throws Exception {
		String downloadUrl = MediaOperator.downloadUrl.replace("ACCESS_TOKEN", SignContext.webGetAccessToken());
		HttpClient client = new HttpClient();
		PostMethod postMethod = new PostMethod(downloadUrl);
		File file = new File(path);
		Part[] parts = { new FilePart(file.getName(), file, "image/jpeg", "utf-8") };

		postMethod.setRequestEntity(new MultipartRequestEntity(parts, postMethod.getParams()));

		client.executeMethod(postMethod);
		String result = postMethod.getResponseBodyAsString();
		postMethod.releaseConnection();
		return (String) new Gson().fromJson(result, Map.class).get("media_id");
	}
	
	public static void main(String[] args) throws Exception {
		download(uploadTempFile("d:/d.jpg"), "d:/c.jpg");
	}
}
