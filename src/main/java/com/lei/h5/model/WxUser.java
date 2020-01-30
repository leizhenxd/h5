package com.lei.h5.model;

import java.io.Serializable;
import java.util.Date;

public class WxUser implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6889057323154438585L;
	private Long id;
	private String openId;
	private String nickName;
	private String headUrl;
	private Date craeteTime;
	private Date updateTime;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getOpenId() {
		return openId;
	}
	public void setOpenId(String openId) {
		this.openId = openId;
	}
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public String getHeadUrl() {
		return headUrl;
	}
	public void setHeadUrl(String headUrl) {
		this.headUrl = headUrl;
	}
	public Date getCraeteTime() {
		return craeteTime;
	}
	public void setCraeteTime(Date craeteTime) {
		this.craeteTime = craeteTime;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
}
