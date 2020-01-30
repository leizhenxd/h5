package com.lei.h5.sqlite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

public class BaseDao<T> {
	@Autowired
	JdbcTemplate jdbcTemplet;
	
	public T getById(Integer id) {
		return null;
	}
}
