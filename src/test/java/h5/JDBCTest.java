package h5;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.gson.Gson;
import com.lei.h5.model.WxAutoReply;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class JDBCTest {
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@Autowired
	JdbcTemplate mysqljdbcTemplate;
	
	@Test
	public void test() {
		System.out.println(new Gson().toJson(jdbcTemplate.query("select id,key,content,type,return_type from wx_auto_reply", new BeanPropertyRowMapper<WxAutoReply>(WxAutoReply.class))));
	}
	
}
