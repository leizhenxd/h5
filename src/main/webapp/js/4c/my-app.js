// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon:true
});

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
});

generateQuestions();

var language;

function generateQuestions() {
	var num1 = getRandomNum();
	var num2 = getRandomNum(num1);
	var num3 = getRandomNum(num1, num2);
	
	var loc = window.location.href;
	if(loc.indexOf("/ch/") != -1)
		language = "ch";
	else
		language = "en";
	
	$$.ajax({
		data: {q1: num1, q2: num2, q3: num3},
		method: "GET",
		url: '/h5/4c/getQuestions.do',
		dataType: 'json',
		success: function(data){
			$$.each(data, function(index, value){
				console.log($$("#q"+index+""));
				var div = $("#q"+index+"");
				
				div.find(".q_img").attr("src","../../images/4c/"+language+"_q"+(value.index+1)+".jpg");
				if(value.num == 4) {
					div.find(".answer").before('<img alt="" src="../../images/4c/kuang.png" class="checkbox '+language+'_checkbox_a">'+
							'<img alt="" src="../../images/4c/kuang.png" class="checkbox '+language+'_checkbox_b">'+
							'<img alt="" src="../../images/4c/kuang.png" class="checkbox '+language+'_checkbox_c">'+
							'<img alt="" src="../../images/4c/kuang.png" class="checkbox '+language+'_checkbox_d">'+
							'<input type="hidden" q_index="'+(value.index)+'" name="answer"/>');
				}
				if(value.num == 3) {
					div.find(".answer").before('<img alt="" src="../../images/4c/kuang.png" class="checkbox '+language+'_checkbox3_a">'+
							'<img alt="" src="../../images/4c/kuang.png" class="checkbox '+language+'_checkbox3_b">'+
							'<img alt="" src="../../images/4c/kuang.png" class="checkbox '+language+'_checkbox3_c">'+
							'<input type="hidden" q_index="'+(value.index)+'" name="answer"/>');
				}
				if(value.index == 0 && value.num == 3)
					alert("fuck" + num1+num2+num3);
			});
			bindCheckboxClick();
		}
	});
}

function bindCheckboxClick(){
	$(".checkbox").click(function(){
		var _this = $(this);
		var select = $(this).parent().find("input[name='answer']");
		var rightImg = _this.parent().find(".answer").show();
		if(_this.hasClass(language+"_checkbox_a")) {
			select.val(1)
			rightImg.removeClass(language+"_answer_b").removeClass(language+"_answer_c").removeClass(language+"_answer_d").addClass(language+"_answer_a");
		}
		if(_this.hasClass(language+"_checkbox_b")) {
			select.val(2)
			rightImg.removeClass(language+"_answer_a").removeClass(language+"_answer_c").removeClass(language+"_answer_d").addClass(language+"_answer_b");
		}
		if(_this.hasClass(language+"_checkbox_c")) {
			select.val(3)
			rightImg.removeClass(language+"_answer_b").removeClass(language+"_answer_a").removeClass(language+"_answer_d").addClass(language+"_answer_c");
		}
		if(_this.hasClass(language+"_checkbox_d")) {
			select.val(4)
			rightImg.removeClass(language+"_answer_b").removeClass(language+"_answer_c").removeClass(language+"_answer_a").addClass(language+"_answer_d");
		}
		
		if(_this.hasClass(language+"_checkbox3_a")) {
			select.val(1)
			rightImg.removeClass(language+"_answer3_b").removeClass(language+"_answer3_c").addClass(language+"_answer3_a");
		}
		if(_this.hasClass(language+"_checkbox3_b")) {
			select.val(2)
			rightImg.removeClass(language+"_answer3_a").removeClass(language+"_answer3_c").addClass(language+"_answer3_b");
		}
		if(_this.hasClass(language+"_checkbox3_c")) {
			select.val(3)
			rightImg.removeClass(language+"_answer3_b").removeClass(language+"_answer3_a").addClass(language+"_answer3_c");
		}
	});
	
	$(".submit").click(function(){
		var data = new Object();
		data.q1 = $("input[name='answer']").eq(0).attr("q_index")+"-"+$("input[name='answer']").eq(0).val();
		data.q2 = $("input[name='answer']").eq(1).attr("q_index")+"-"+$("input[name='answer']").eq(1).val();
		data.q3 = $("input[name='answer']").eq(2).attr("q_index")+"-"+$("input[name='answer']").eq(2).val();
		var answerFinish = true;
		$(".answer").each(function(index){
			if($(this).css("display") == 'none' && answerFinish) {
				myApp.alert("第"+ (index+1) + "题还没有答","");
				answerFinish = false;
				return false;
			}
		});
		if(!answerFinish){
			return ;
		}
		$$.ajax({
			data: data,
			method: "GET",
			url: '/h5/4c/getAnswers.do',
			dataType: 'text',
			success: function(data){
				if(data < 3) {
					$("."+language+"_rightcount").text(data).show();
					$("."+language+"_rightcount").parent().removeClass().addClass(language + "_finish");
				}
				else {
					$("."+language+"_rightcount").text("").hide();
					$("."+language+"_rightcount").parent().removeClass().addClass(language + "_all_right");
				}
				mainView.router.load({
					pageName: "finish"
				});
			}
		});
	});
}

function getRandomNum(e1, e2) {
	var rd = parseInt(Math.random()*10%5, 10);
	if(rd == e1 || rd == e2)
		return getRandomNum(e1, e2);
	else
		return rd;
}
$(function(){
	$(".en_finish,.ch_finish").css("height", $(window).width()*1.66);
});