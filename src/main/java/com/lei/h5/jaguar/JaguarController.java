package com.lei.h5.jaguar;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value="jaguar")
public class JaguarController {

	@RequestMapping("totalhit")
	@ResponseBody
	public long getTotalHit() {
		return MemoryCache.totalHit;
	}
}
