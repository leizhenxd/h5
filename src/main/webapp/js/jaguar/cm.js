$(function(){
	$(".support").click(function(){
		var support = $(".support");
		if(!getCookie("hasSupport")){
			
			setCookie("hasSupport", true, 20);
			support.attr("disabled", "disabled");
			support.css("position", "relative");
			support.append("<span class='tip' style='position:absolute;left:0;top:0;color:blue;'>+1</span>")
			$(".tip").animate({
				top: "-20px",
				opacity: 0
			}, "normal", "linear", function(){
				
			});
		}
	});
	
	!(function(){
		if(getCookie("hasSupport")){
			$(".support").attr("disabled", "disabled");
		}
	})();
});

function setCookie(c_name,value,expiredays) {
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function getCookie(c_name) {
	if (document.cookie.length>0) {
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1) { 
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		} 
	}
	return "";
}