$(function() {
	$(".camera,#upload").bind("click",function(){
		$("#photo").trigger("click");
	});
	$("#photo").change(function(){
		var windowURL = window.URL || window.webkitURL;
		selectImgUrl = windowURL.createObjectURL(this.files[0]);
		$(".pg6").removeClass("noupload").addClass("upload");
	});
	initWXConfig();
});
var selectImgUrl = "";
var isWeixin = false;
var localImgUrl = null;
function initWXConfig() {
	
	$.ajax({
		url : '../../getSignature.htm?v=' + Math.random(),
		type : 'POST',
		data: {"url" : "h5/thermos/leopard.html"+window.location.search, "type" : "thermos"},
		success : function(data) {
			wx.config({
				debug : false,
				appId : 'wx7db444f1023a797d',
				timestamp : 1414587457,
				nonceStr : 'vicecity',
				signature : data,
				jsApiList : [ 'uploadImage', 'chooseImage', 'previewImage','onMenuShareAppMessage', 'onMenuShareTimeline' ]
			});

			wx.ready(function() {
				// wx.closeWindow();
				// 5.3 上传图片
				isWeixin = true;
				$(".camera,#upload").unbind("click").bind("click", function(){
					wx.chooseImage({
						success : function(res) {
							if (res.localIds.length == 0) {
								alert('请先使用 chooseImage 接口选择图片');
								return;
							}
							selectImgUrl = res.localIds[0];
							wx.uploadImage({
								localId : res.localIds[0],
								success : function(res2) {
									$.ajax({
										url : "../../upload.htm?serverId=" + res2.serverId,
										type : "post",
										success : function(data) {
											console.log(data);
											localImgUrl = "../../temp/"+data;
											$(".pg6").removeClass("noupload").addClass("upload");
										},
										error: function(error){
											alert(error);
										}
									});
								},
								fail : function(res) {
									alert("error:"+JSON.stringify(res));
								}
							});
						}
					});
				});
				
				wx.onMenuShareAppMessage({
				    title: '尘封的雪山王者，你能否逆转它的命运？', // 分享标题
				    desc: '尘封的雪山王者，你能否逆转它的命运？', // 分享描述
				    link: 'http://h5.leizhenxd.com/thermos/index.htm', // 分享链接
				    imgUrl: 'http://qiniu.leizhenxd.com/thermos/logo.jpg', // 分享图标
				    type: '', // 分享类型,music、video或link，不填默认为link
				    success: function () { 
				        $.ajax({
				    		url : '../../share.htm?v=' + Math.random(),
				    		type : 'POST',
				    		data: {"type" : "thermos"},
				    		success : function(data) {
				    			
				    		}
				        });
				    },
				    cancel: function () { 
				        
				    }
				});
				wx.onMenuShareTimeline({
				    title: '尘封的雪山王者，你能否逆转它的命运？', // 分享标题
				    link: 'http://h5.leizhenxd.com/thermos/index.htm', // 分享链接
				    imgUrl: 'http://qiniu.leizhenxd.com/thermos/logo.jpg', // 分享图标
				    success: function () { 
				    	$.ajax({
				    		url : '../../share.htm?v=' + Math.random(),
				    		type : 'POST',
				    		data: {"type" : "thermos"},
				    		success : function(data) {
				    			
				    		}
				        });
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				    }
				});
				
			});
		}
	});
}
