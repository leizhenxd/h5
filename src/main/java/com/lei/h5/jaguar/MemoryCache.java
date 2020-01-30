package com.lei.h5.jaguar;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.lei.h5.sqlite.SQLiteSource;

@Component
public class MemoryCache {

	public static long totalHit = 0L;
	public static long dbHit = 0;
	
	public static boolean isPublish = false;
	
	Statement stmt = null;
	Connection conn = null;
	ResultSet executeQuery = null;
	@PostConstruct
	public void init(){
		conn = SQLiteSource.getConnection();
		try {
			stmt = conn.createStatement();
			executeQuery = stmt.executeQuery("select num from jaguar_totalhit;");
			while(executeQuery.next()) {
				totalHit = executeQuery.getLong("num");
			}
			executeQuery.close();
		} catch (SQLException e) {
			if(e.getMessage() != null && e.getMessage().contains("no such table")) {
				try {
					stmt.executeUpdate( "create table jaguar_totalhit(num int);" );
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
		}
		finally {
			try {
				if (executeQuery != null) executeQuery.close();
				if(stmt != null) stmt.close();
				if(conn != null) conn.close();
			} catch (Exception e2) {
				// TODO: handle exception
			}
		}
		
		new Thread(new Runnable() {
			
			@Override
			public void run() {
				while(true) {
					persistence();
					try {
						Thread.sleep(5000);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
			}
		});
	}
	
	
	private void persistence() {
		if(dbHit == totalHit) return;
		conn = SQLiteSource.getConnection();
		try {
			stmt = conn.createStatement();
			stmt.execute("update jaguar_totalhit set num = "+totalHit+";");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			try {
				if(stmt != null) stmt.close();
				if(conn != null) conn.close();
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		}
	}
	
	public static void hitAdd() {
		synchronized (MemoryCache.class) {
			totalHit ++ ;
		}
	}
}
