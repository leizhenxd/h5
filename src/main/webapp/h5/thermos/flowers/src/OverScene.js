/**
 * Created by George on 2016/11/29.
 */
var OverScene = cc.Scene.extend({
    _sharePanel:null,
    _closeBtn:null,
    _score: null,
    ctor:function(score){
        this._super();
        this._score = score;

        //document.title = "我在花吃大作战中得到了"+this._score.toString()+",\n谁来挑战我？！";
        var layer= new cc.Layer();
        this.addChild(layer);
        var size = cc.director.getWinSize();
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        var shop = new cc.MenuItemSprite((new cc.Sprite(res.shopBtn)),(new cc.Sprite(res.shopBtn)),(new cc.Sprite(res.shopBtn)),this.shop,this)
        var share = new cc.MenuItemSprite((new cc.Sprite(res.shareBtn)),(new cc.Sprite(res.shareBtn)),(new cc.Sprite(res.shareBtn)),this.share,this)

        var menu1 = new cc.Menu(shop);
        menu1.x = size.width/4;
        menu1.y = size.height/2-330;
        var menu2 = new cc.Menu(share);
        menu2.x = size.width/4*3;
        menu2.y = size.height/2-330;

        this.addChild(menu1,5);
        this.addChild(menu2,5);

        var logo = new cc.Sprite(res.commitSuccess);
        logo.x = size.width/2;
        logo.y = size.height/2+80;
        this.addChild(logo,5);
		
		var rightCorner = new cc.Sprite(res.rgihtcorner);
        rightCorner.x = size.width-150;
        rightCorner.y = size.height-126;
        this.addChild(rightCorner,11);

        this._sharePanel = new cc.Sprite(res.sharePanel);
        this._sharePanel.x = size.width/2;
        this._sharePanel.y = size.height/2;
        this._sharePanel.visible = false;
        this.addChild(this._sharePanel,10);

        this._closeBtn=new cc.MenuItemSprite((new cc.Sprite(res.close)),(new cc.Sprite(res.close)),(new cc.Sprite(res.close)),this.close,this)
        var menu3 = new cc.Menu(this._closeBtn);
        menu3.x = 65;
        menu3.y = size.height-65;
        this._closeBtn.visible = false;
        this.addChild(menu3,11);
		
		document.getElementById("changan").style.display = "";
    },
    share:function()
    {
        this._sharePanel.visible = true;
        this._closeBtn.visible = true;
		//document.getElementById("changan").style.display = "none";
    },
    close:function()
    {
        this._sharePanel.visible = false;
        this._closeBtn.visible = false;
		//document.getElementById("changan").style.display = "";
    },
    shop:function()
    {
    	//visit("thermos_flowers","thermos_flowers_link2");
        //window.location.href="https://sale.jd.com/wq/act/rowX6LVET83K4.html";
		//document.getElementById("changan").style.display = "none";
    }
});