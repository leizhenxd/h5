package com.lei.h5.sqlite;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

import org.springframework.stereotype.Component;
@Component
public class SQLiteSource {
	private static String dbpath;
	
	private SQLiteSource(){
		
	}
	static {
		ResourceBundle bundle = PropertyResourceBundle.getBundle("config");
		dbpath = bundle.getString("dbpath");
	}
	public static Connection getConnection() {
		try {
			Class.forName("org.sqlite.JDBC");
			return DriverManager.getConnection("jdbc:sqlite://" + dbpath);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
}
