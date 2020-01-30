package com.lei.h5.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

public class BaseService {
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@Autowired
	JdbcTemplate mysqljdbcTemplate;
}
