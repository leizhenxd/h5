/**
 * Created by george on 16/12/28.
 */
var InfoScene = cc.Scene.extend({
    _txtName:null,
    _txtPhone:null,
    _txtEmail:null,
    _score: null,
    ctor:function(score){
        this._super();
        this._score = score;
        var layer= new cc.Layer();
        this.addChild(layer);
        var size = cc.director.getWinSize();
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        var check = new cc.MenuItemSprite((new cc.Sprite(res.check)),(new cc.Sprite(res.check)),(new cc.Sprite(res.check)),this.check,this)
        var commit = new cc.MenuItemSprite((new cc.Sprite(res.commit)),(new cc.Sprite(res.commit)),(new cc.Sprite(res.commit)),this.commit,this)

        var menu1 = new cc.Menu(check);
        menu1.x = size.width/4;
        menu1.y = size.height/2-330;
        var menu2 = new cc.Menu(commit);
        menu2.x = size.width/4*3;
        menu2.y = size.height/2-330;

        this.addChild(menu1,5);
        this.addChild(menu2,5);

        this.display("inline");

        var logo = new cc.Sprite(res.text);
        logo.x = size.width/2;
        logo.y = size.height/2+450;
        this.addChild(logo,5);

        this._sharePanel = new cc.Sprite(res.shopPanel);
        this._sharePanel.x = size.width/2;
        this._sharePanel.y = size.height/2;
        this._sharePanel.visible = false;
        this.addChild(this._sharePanel,10);

        this._closeBtn=new cc.MenuItemSprite((new cc.Sprite(res.close)),(new cc.Sprite(res.close)),(new cc.Sprite(res.close)),this.close,this)
        var menu3 = new cc.Menu(this._closeBtn);
        menu3.x = 46;
        menu3.y = size.height-46;
        this._closeBtn.visible = false;
        this.addChild(menu3,11);

        this._shopShow = new cc.MenuItemSprite((new cc.Sprite(res.shopShow)),(new cc.Sprite(res.shopShow)),(new cc.Sprite(res.shopShow)),this.shopShow,this)
        var menu4 = new cc.Menu(this._shopShow);
        menu4.x = size.width/2;
        menu4.y = size.height/2-330;
        this._shopShow.visible = false;
        this.addChild(menu4,11);

    },
    check:function(){
        this._sharePanel.visible = true;
        this._closeBtn.visible = true;
        this._shopShow.visible = true;
        this.display("none");
    },
    close:function()
    {
        this._sharePanel.visible = false;
        this._closeBtn.visible = false;
        this._shopShow.visible = false;
        this.display("inline");
    },
    commit:function() {
        var name =document.getElementById("nametxt").value;
        var phone =document.getElementById("phonetxt").value;
        var email =document.getElementById("emailtxt").value;
        this.display("none");
        this.ajax("name="+name+"&phone="+phone+"&email="+email+"&type=2&score="+this._score);
        cc.director.runScene(new OverScene(this._score));
    },
    ajax:function(params)
    {
        var xhr = cc.loader.getXMLHttpRequest();
        // var statusPostLabel = new cc.LabelTTF("Status:", "Thonburi", 18);
        // this.addChild(statusPostLabel, 1);
        //
        // statusPostLabel.x = winSize.width / 2;
        //
        // statusPostLabel.y = winSize.height - 140;
        // statusPostLabel.setString("Status: Send Post Request to httpbin.org with plain text");

        xhr.open("POST", "http://h5.leizhenxd.com/thermos/adduser.htm");
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
        //set Content-type "text/plain;charset=UTF-8" to post plain text  
        //xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
        //         var httpStatus = xhr.statusText;
        //         var response = xhr.responseText.substring(0, 100) + "...";
        //         var responseLabel = new cc.LabelTTF("POST Response (100 chars):  \n" + response, "Thonburi", 16);
        //         this.addChild(responseLabel, 1);
        //         responseLabel.anchorX = 0;
        //         responseLabel.anchorY = 1;
        //         responseLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //
        //         responseLabel.x = winSize.width / 10 * 3;
        //         responseLabel.y = winSize.height / 2;
        //         statusPostLabel.setString("Status: Got POST response! " + httpStatus);
        //     }
        // };
        xhr.send(params);
    },
    shopShow:function(){
    	visit("thermos_flowers","thermos_flowers_link1");
        window.location.href="https://sale.jd.com/wq/act/rowX6LVET83K4.html";
    },
    display:function(text)
    {
        document.getElementById("input_control").style.display=text;
    }

});
