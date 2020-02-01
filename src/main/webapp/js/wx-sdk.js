var wxconfig = {
	xmlhttp: null,
	shareUrl : "",
	shareTitle : "",
	shareDesc: "",
	shareImg : "",
	onShareSuccess: null
};


function initWXConfig(pageType) {
	wxconfig.xmlhttp=null;
	if (window.XMLHttpRequest) {// code for all new browsers
		wxconfig.xmlhttp=new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {// code for IE5 and IE6
		wxconfig.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	wxconfig.xmlhttp.open("post", '/getWxWebSignature.htm?v=' + Math.random(), true);
	wxconfig.xmlhttp.onreadystatechange = callback;
	wxconfig.xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	wxconfig.xmlhttp.send('url=' +encodeURIComponent(window.location.href)+"&type="+pageType);
}

function wxShare(params) {
	wxconfig.shareUrl = params.shareUrl;
	wxconfig.shareTitle = params.shareTitle;
	wxconfig.shareDesc = params.shareDesc;
	wxconfig.shareImg = params.shareImg;
	wxconfig.onShareSuccess = params.callback;
	initWXConfig(params.pageType)
}
/**
 * params.urls
 * @param params
 * @returns
 */
function wxPreviewImg(params) {
	wx.previewImage({
	    current: params.urls[0], // 当前显示图片的http链接
	    urls: params.urls // 需要预览的图片http链接列表
	});
}
/**
 * params.pageType
 * params.success
 * @param params
 * @returns
 */
function wxUploadImg(params) {
	wx.ready(function(){
		console.log("ready");
		wx.chooseImage({
			sizeType: ['original'], // , 'compressed'
			sourceType: ['album'], 
			success: function(res) {
				if (res.localIds.length == 0) {
					alert('请选择图片');
					return;
				}
				console.log(params.uploadUrl +"?serverId=sdf&pageType=" + params.pageType);
				wx.uploadImage({
					localId : res.localIds[0],
					success : function(res2) {
						var loading = weui.loading('正在处理.');
						$.ajax({
//							url : "../../upload.htm?serverId=" + res2.serverId,
							url : params.uploadUrl +"?serverId=" + res2.serverId +"&pageType=" + params.pageType,
							data: params.data,
							type : "post",
							success : function(data) {
								params.success(data);
							},
							error: function(error){
								alert(error);
							},
							complete: function(){
								loading.hide();
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
	
}

function callback() {
	console.log(wxconfig);
	if (wxconfig.xmlhttp.readyState==4 && wxconfig.xmlhttp.status==200) {
		var response = JSON.parse(wxconfig.xmlhttp.responseText);
		console.log(response);
		wx.config({
			debug : false,
			appId : response.appid,
			timestamp : response.timestamp,
			nonceStr : response.nonceStr,
			signature : response.signature,
			jsApiList : [ 'uploadImage', 'chooseImage', 'previewImage','onMenuShareAppMessage', 'onMenuShareTimeline' ]
		});
		wx.ready(function() {
			wx.onMenuShareAppMessage({
			    title: wxconfig.shareTitle, // 分享标题
			    desc: wxconfig.shareDesc, // 分享描述
			    link: wxconfig.shareUrl, // 分享链接
			    imgUrl: wxconfig.shareImg, // 分享图标
			    type: '', // 分享类型,music、video或link，不填默认为link
			    success: function () {
			    	wxconfig.onShareSuccess();
			    },
			    cancel: function () { 
			    	alert("false");
			    }
			});
			wx.onMenuShareTimeline({
			    title: wxconfig.shareTitle, // 分享标题
			    link: wxconfig.shareUrl, // 分享链接
			    imgUrl: wxconfig.shareImg, // 分享图标
			    success: function () { 
			    	wxconfig.onShareSuccess();
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});
			
		});
	}
}
