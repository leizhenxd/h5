package test;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

public class CommonHandlerExceptionResolver implements HandlerExceptionResolver {
	public static ModelAndView modelAndView = new ModelAndView("jsonView");
	
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
		String errMsg = ex.getMessage();
		if(ex.getMessage() == null){
			errMsg = ex.toString();
		}
        modelAndView.addObject("errMsg", errMsg);
		modelAndView.addObject("isResponse",false);
        if (ex instanceof RuntimeException) {
            modelAndView.addObject("exceptionType", "UserReadOnlyException");
        }
        ex.printStackTrace();
        return modelAndView;
	}
	
	private boolean isAjaxRequest(HttpServletRequest request) {
        String ajaxHeader = request.getHeader("X-Requested-With");
        if ("XMLHttpRequest".equals(ajaxHeader)) {
            return true;
        }
        return false;
    }

}
