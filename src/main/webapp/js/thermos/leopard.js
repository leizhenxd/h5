var canvas = document.getElementById("cas"), ctx = canvas.getContext("2d");
var x1, y1, a = document.body.clientWidth / 6, timeout, totimes = 100, distance = 30;
var saveDot = [];


$(function(){
	var canvasBox = document.getElementById("bb");

	canvasBox.onload = function() {
	}
	canvas.width = canvasBox.width;
	canvas.height = canvasBox.height;
	canvasBox.style.display = 'none';
	var img = new Image();
	img.src = "../../images/thermos/2c_bg.jpg";
	img.onload = function() {
		$(".pg1 .ani").each(function(index,element){
			if(index == 4){
				$(this).delay(1000).animate({opacity: 1}, "slow", "linear", function(){
					$(".pg1 .ani:lt(5)").delay(1000).animate({opacity: 0},"normal","linear",function(){
						$(this).hide();
					});
				});
			}
			else{
				if(index == 6 || index == 5) {
					$(this).delay(3000).animate({opacity: 1}, "slow", "linear", function(){
						if(index == 6){
							$(".pg1").removeClass("swiper-no-swiping");
							$(".pg1 .preTag-container").show();
						}
					});
				}
				else {
					$(this).delay(1000).animate({opacity: 1}, "slow", "linear", null);
				}
			}
		});
		
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	//	canvasBox.style.visibility = 'visible';
	};
	
	swiperV = new Swiper('.swiper-container-v', {
        effect: 'slide',
        initialSlide: 0,
		direction:'vertical',
		updateOnImagesReady : true,
		allowSwipeToPrev : false,
		onImagesReady : function(swiper) {
			// 				alert('所有内置图像加载完成后执行，同时“updateOnImagesReady”需设置为“true');
		},
		onTouchStart: function(swiper) {
			$(".preTag").animate({opacity:'toggle'}, '3000');
		},
		onTouchEnd: function(swiper) {
			$(".preTag").animate({opacity:'toggle'}, '3000');
		},
		onSlideChangeEnd : function(swiper) {
			if (swiper.activeIndex == 1) {
				$(".game .anistory:eq(0)").delay(1000).fadeOut(1000);
				$(".game .anistory:eq(1)").delay(1000).fadeIn(1000,function(){});
				$(".game .anistoryword:eq(0)").delay(1000).fadeOut(1000);
				$(".game .anistoryword:eq(1)").delay(1000).fadeIn(1000, function(){
					$(".game .anistory:eq(1)").delay(1000).fadeOut(1000,function(){});
					$(".game .anistoryword:eq(1)").delay(1000).fadeOut(1000,function(){
						$(".game .ani1:eq(0)").show().delay(1000).animate({opacity: 1}, "normal", "linear", function(){
							$(this).delay(1000).hide(500);
							$(this).next().show().delay(2000).animate({opacity: 1}, "normal", "linear", function(){
								$(this).delay(2000).hide(500, function(){
									$("#guide").show();
									if(!over) {
										tapClip();
									}
								});
							});
						});
						swiper.lockSwipeToPrev();
					});
					$("#bb").css("visibility","visible").fadeIn(1000);
					
				});
				$("#cas").css("opacity",1);
			}
			else if(swiper.activeIndex ==2 || swiper.activeIndex == 3 || swiper.activeIndex == 4) {
				swiper.unlockSwipeToPrev();
				$(".swiper-slide-active .ani").each(function(index){
					$(this).delay((index+1)*1000).animate({opacity: 1},2000,"linear",null);
					if(index ==1) {
						$(this).find(".preTag").show();
					}
				});
			}
			else if(swiper.activeIndex == 5) {
				swiper.lockSwipeToPrev();
				if(selectImgUrl != '') {
					$(".pg6").removeClass("noupload").addClass("upload");
				}
				else {
					$(".pg6").removeClass("upload").addClass("noupload");
				}
			}
		}
		
    });
    swiperH = new Swiper('.swiper-container-h',{
    	effect: 'slide',
		direction:'horizontal',
		prevButton:'.swiper-button-prev',
		nextButton:'.swiper-button-next'
	});
	
	$("#generate").click(function(){
    	if(selectImgUrl == '') {
    		alert("请选选择一个照片");
    		return ;
    	}
    	$(".loading").show();
		if(isWeixin) {
			while(localImgUrl == null) {
				
			}
			selectImgUrl = localImgUrl;
		}
    	swiperV.slideNext(0);
    	var haibaoCanvas = document.getElementById('haibao');
    	var ctx = haibaoCanvas.getContext('2d');
    	var photo = new Image();
    	console.log("selectImgUrl:"+selectImgUrl);
    	photo.src = selectImgUrl;
    	photo.onload = function() {
    		var mask = new Image();
    		mask.src = "../../images/thermos/mask/frame"+(swiperH.activeIndex+1)+"_mask.png";
    		mask.onload = function() {
				haibaoCanvas.width = 750; 
    			haibaoCanvas.height = haibaoCanvas.width*1.778;
    			console.log("width:"+photo.width+"-"+photo.height);
    			var width = haibaoCanvas.width*0.8;
    			var height = photo.width*1.16<=photo.height?width*1.16:(photo.height/(photo.width/width));
    			console.log(width+"-"+height);
        		ctx.drawImage(photo,0,0,photo.width,photo.width*1.16<=photo.height?photo.width*1.16:photo.height, haibaoCanvas.width*0.1, haibaoCanvas.height*0.1, width, height);
        		console.log(photo);
    			
    			ctx.drawImage(mask, 0, 0, haibaoCanvas.width, haibaoCanvas.height);
        		console.log("draw mask end");
        		var content = $(".hpg"+(swiperH.activeIndex+1)+" .content").val() || "至善良的你！";
        		
        		ctx.fillStyle = "#000000"
				ctx.font="30px 宋体";
        		
        		ctx.fillText($(".hpg"+(swiperH.activeIndex+1)+" .tobody").val()||"Thermos", haibaoCanvas.width*0.64, haibaoCanvas.height*0.645);
        		ctx.fillText(content.substring(0,10), haibaoCanvas.width*0.55, haibaoCanvas.height*0.68);
        		ctx.fillText(content.substring(10,20), haibaoCanvas.width*0.54, haibaoCanvas.height*0.71);
        		ctx.fillText($(".hpg"+(swiperH.activeIndex+1)+" .frombody").val()||"Thermos", haibaoCanvas.width*0.70, haibaoCanvas.height*0.745);
        		var data = haibaoCanvas.toDataURL("image/jpeg",0.8);
    			$.post('../../thermos/upload.htm',
        			{img:data, r:Math.random()},
        			function(fileName){
        				console.log(fileName);
//        				$("#haibaoimg").attr("src","http://static.leizhenxd.com/thermos/"+fileName);
        				var result = document.getElementById("haibaoimg");
        				result.src = "http://static.leizhenxd.com/thermos/"+fileName;
        				result.onload = function(){
        					result.height = window.innerHeight;
        					$(".loading").hide();
        				}
        			}
        		);
    		}
		};
    	
	});
	
	$("#resubmit").click(function(){
		swiperV.unlockSwipeToPrev();
		swiperV.slidePrev();
		selectImgUrl = "";
		swiperV.lockSwipeToPrev();
	});
	$(".store,.jdlink").click(function(){
		var linktype = 1;
		if($(this).hasClass("jdlink")) linktype = 1;
		else linktype = 2;
		$.ajax({
    		url : '../../goshop.htm?v=' + Math.random(),
    		type : 'POST',
    		data: {"type" : "thermos","linktype": linktype},
    		success : function(data) {
    			
    		}
        });
		window.open("http://sale.jd.com/wq/act/qf5iFszBuTAXtCE.html");
	});
	
	$(".pg6 .preTag").click(function(){
		swiperV.slideTo(7, 200, false);
	});
});

function getClipArea(e, hastouch) {
	var x = hastouch ? e.targetTouches[0].pageX : e.clientX;
	var y = hastouch ? e.targetTouches[0].pageY : e.clientY;
	var ndom = canvas;

	// while(ndom.tagName!=="BODY"){
	// x -= ndom.offsetLeft;
	// y -= ndom.offsetTop;
	// ndom = ndom.parentNode;
	// }
	return {
		x : x,
		y : y
	}
}
var hastouch = "ontouchstart" in window ? true : false, tapstart = hastouch ? "touchstart"
		: "mousedown", tapmove = hastouch ? "touchmove" : "mousemove", tapend = hastouch ? "touchend"
		: "mouseup";
// 通过修改globalCompositeOperation来达到擦除的效果
function tapClip() {

	var area;
	var x2, y2;

	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.lineWidth = a / 3;
	ctx.globalCompositeOperation = "destination-out";

	window.addEventListener(tapstart, tapstartHandler);
}

function tapstartHandler(e) {
	$("#guide").hide();
	clearTimeout(timeout);
	e.preventDefault();
	area = getClipArea(e, hastouch);
	x1 = area.x;
	y1 = area.y;
	
	drawLine(x1, y1);
	this.addEventListener(tapmove, tapmoveHandler);
	this.addEventListener(tapend,function() {
		this.removeEventListener(tapmove, tapmoveHandler);
		timeout = setTimeout(function() {
			var imgData = ctx.getImageData(0, 0,canvas.width, canvas.height);
			var dd = 0;
			for (var x = 0; x < imgData.width; x += distance) {
				for (var y = 0; y < imgData.height; y += distance) {
					var i = (y * imgData.width + x) * 4;
					if (imgData.data[i + 3] > 0) {
						dd++;
					}
				}
			}
			if (dd/ (imgData.width * imgData.height / (distance * distance)) < 0.6) {
				canvas.className = "noOp";
				$(canvas).delay(2000).hide();
				over = true;
				this.removeEventListener(tapstart, tapstartHandler);
				this.removeEventListener(tapmove, tapmoveHandler);
				
				$(".game .ani").each(function(index, element){
					$(this).delay(index*1000).animate({opacity: 1}, "2000", "linear", function(){
						if(index == 2) {
							$(".game").removeClass("swiper-no-swiping");
							$(".game .preTag-container").show();
						}
					});
				});
			}
		}, totimes)
	});

	function tapmoveHandler(e) {
		clearTimeout(timeout);
		e.preventDefault();
		area = getClipArea(e, hastouch);

		x2 = area.x;
		y2 = area.y;
		drawLine(x1, y1, x2, y2);

		x1 = x2;
		y1 = y2;
	}
}

function drawLine(x1, y1, x2, y2) {

	ctx.save();
	ctx.beginPath();
	if (arguments.length == 2) {
		for (var i = 1; i <= 3; i++) {
			for (var j = 1; j <= 3; j++) {
				if (!random())
					break;
				var subx = x1 - a + a * i / 3;
				var suby = y1 - a + a * j / 3;
				ctx.arc(subx, suby, a / 3, 0, 2 * Math.PI);
				ctx.fill();
			}
		}

	} else {
		for (var i = 1; i <= 3; i++) {
			for (var j = 1; j <= 3; j++) {
				if (!random())
					break;
				var subx1 = x1 - a + a * i / 3;
				var suby1 = y1 - a + a * j / 3;
				var subx2 = x2 - a + a * i / 3;
				var suby2 = y2 - a + a * j / 3;
				ctx.moveTo(subx1, suby1);
				ctx.lineTo(subx2, suby2);
			}
		}

		ctx.stroke();
	}
	ctx.restore();
}
function random() {
	var r = parseInt(Math.random() * 5 + 1);
	return r<5;
}

