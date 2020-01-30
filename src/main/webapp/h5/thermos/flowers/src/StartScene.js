/**
 * Created by George on 2016/12/23.
 */
//var flower1=null;
var StartLayer = cc.Layer.extend({
    flower1:null,
    flower2:null,
    flower3:null,
    ctor:function(){
        this._super();

        var layer= new cc.Layer();
        this.addChild(layer);
        var size = cc.director.getWinSize();
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        
        var btnNormal = new cc.Sprite(res.select_1);
        var btnSelected = new cc.Sprite(res.select_1);
        var btnDisable = new cc.Sprite(res.select_1);
        var startButton = new cc.MenuItemSprite(btnNormal,btnSelected,btnDisable,this.startGame,this)
        var menu = new cc.Menu(startButton);
        menu.x = size.width/2;
        menu.y = 250;
        this.addChild(menu);

        var logo = new cc.Sprite(res.logo);
        logo.x = size.width/2;
        logo.y = size.height/2+62;
        this.addChild(logo);

        // var logo1 = new cc.Sprite(res.logo1);
        // logo1.x = size.width/2;
        // logo1.y = size.height/2+150;
        // this.addChild(logo1);

        var logoText = new cc.Sprite(res.logoText);
        logoText.x = size.width/2;
        logoText.y = 3*size.height/4+100;
        this.addChild(logoText);
        logoText.opacity = 0;
        logoText.runAction(cc.fadeIn(1));

        var liftAction1 = cc.scaleTo(0.1, 1.1);
        var liftAction2 = cc.scaleTo(0.1, 1);
        var liftAction3 = cc.scaleTo(0.1, 1.2);
        var liftAction4 = cc.scaleTo(0.7, 1);
        var seq = cc.sequence(liftAction1, liftAction2, liftAction3, liftAction4);
        //this.flower1.runAction(cc.repeatForever(seq));

        this.flower1= new cc.Sprite(res.fadeIn1);
        this.flower1.x = size.width/2+90;
        this.flower1.y = 3*size.height/4-40;
        this.flower1.scale= 0.1;
        this.addChild(this.flower1,1);
        //this.flower1.opacity = 0;
        //this.flower1.runAction(cc.RotateBy.create(5, 360).repeatForever());//cc.sequence(cc.fadeIn(1))
        this.flower1.runAction(cc.sequence(cc.scaleTo(1,1),seq));


        this.flower2= new cc.Sprite(res.fadeIn2);
        this.flower2.x = size.width/2+80;
        this.flower2.y = size.height/2-30;
        this.flower2.scale= 0.01;
        this.addChild(this.flower2,1);
        //this.flower2.opacity = 0;
        this.flower2.runAction(cc.sequence(cc.DelayTime.create(1),cc.scaleTo(1,1),seq));
        //this.flower2.runAction(cc.sequence(cc.DelayTime.create(1),cc.RotateBy.create(5, 360).repeatForever()));


        this.flower3= new cc.Sprite(res.fadeIn3);
        this.flower3.x = size.width/2+25;
        this.flower3.y = size.height/2-120;
        this.flower3.scale= 0.01;

        this.addChild(this.flower3,1);

        //this.flower3.opacity = 0;
        this.flower3.runAction(cc.sequence(cc.DelayTime.create(0.5),cc.scaleTo(1,1),seq));




        var label = new cc.LabelTTF("Licensed by Artkey","Arial",20);
        label.x = size.width/2;
        label.y = 80;
        label.color = cc.color(0,0,0);
        this.addChild(label);


    },
    startGame:function(){
        cc.director.runScene(new LevelScene());
    },
});

var StartScene = cc.Scene.extend({
    ctor:function(level){
        this._super();
        speed = level;
        var layer = new StartLayer();
        this.addChild(layer);
    }
});