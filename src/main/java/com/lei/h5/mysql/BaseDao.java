package com.lei.h5.mysql;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

public class BaseDao<T> {
	@Autowired
	JdbcTemplate mysqljdbcTemplet;
	
	public T getById(Integer id) {
		return null;
	}
}
