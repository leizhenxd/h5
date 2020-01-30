/**
 * Created by George on 2016/12/23.
 */
var LevelScene = cc.Scene.extend({
    _score:0,
    ctor:function(){
        this._super();
        //bg
        var layer= new cc.Layer();
        this.addChild(layer);
        var size = cc.director.getWinSize();
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        //btn
        var easyBtn = new cc.MenuItemSprite((new cc.Sprite(res.easy)),(new cc.Sprite(res.easy)),(new cc.Sprite(res.easy)),this.selectLevel,this)
        easyBtn.name = "easy";
        var normalBtn = new cc.MenuItemSprite((new cc.Sprite(res.normal)),(new cc.Sprite(res.normal)),(new cc.Sprite(res.normal)),this.selectLevel,this)
        normalBtn.name = "normal";
        var hardBtn = new cc.MenuItemSprite((new cc.Sprite(res.hard)),(new cc.Sprite(res.hard)),(new cc.Sprite(res.hard)),this.selectLevel,this)
        hardBtn.name = "hard";
        var menu1 = new cc.Menu(easyBtn);
        menu1.x = size.width/2;
        menu1.y = size.height/2+230;
        var menu2 = new cc.Menu(normalBtn);
        menu2.x = size.width/2;
        menu2.y = size.height/2;
        var menu3 = new cc.Menu(hardBtn);
        menu3.x = size.width/2;
        menu3.y = size.height/2-230;
        this.addChild(menu1);
        this.addChild(menu2);
        this.addChild(menu3);
        //select title
        var logo = new cc.Sprite(res.select);
        logo.x = size.width/2;
        logo.y = size.height/2+460;
        this.addChild(logo);
        var text = new cc.Sprite(res.leveltext);
        text.x = size.width/2;
        text.y = size.height/4-130;
        this.addChild(text);
    },
    selectLevel:function(level){
        //console.log(level);
        var speed = 0;
        var interval  = 0.5;
        switch(level.name)
        {
            case "easy":
                speed = 10;
                interval = 0.5;
                break;
            case "normal":
                speed = 14;
                interval = 0.3;
                break;
            case "hard":
                speed = 18;
                interval = 0.2;
                break;
            default:
                speed = 10;
                interval = 0.5;
                break;
        }
        cc.director.runScene(new HelloWorldScene(speed,interval));
    }

});