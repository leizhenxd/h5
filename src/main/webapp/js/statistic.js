var statisticConfig = {
	xmlhttp: null	
}
function initXMLHttpRequest() {
	var xmlhttp=null;
	if (window.XMLHttpRequest) {// code for all new browsers
		return new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {// code for IE5 and IE6
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
}

function visit(project,pageType, callback) {
	var xmlhttp = initXMLHttpRequest();
	xmlhttp.open("post", '/statistic/visit.htm?', true);
	xmlhttp.onreadystatechange = callback;
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send("type="+pageType+"&project="+project);
}
function statisticUser(pageType, callback) {
	var xmlhttp = initXMLHttpRequest();
	xmlhttp.open("post", '/statistic/statisticUser.htm?', true);
	xmlhttp.onreadystatechange = callback;
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send("type="+pageType);
}
function statisticLog(project, callback) {
	var xmlhttp = initXMLHttpRequest();
	xmlhttp.open("post", '/statistic/statisticLog.htm', true);
	xmlhttp.onreadystatechange = callback;
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send("project="+project);
}