var size = null;
var timer = 30;//计时器
var ready = 3;//准备时间
var score = null;//得分
var clock1=null,clock2=null,clock3=null;//时钟数字
var score1 = null,score2 = null,score3 = null;//分数数字
var speed = null;//下落速度
var flowerInterval = null;//控制花下落的频率
var flowers = new Array(res.flower1,res.flower2,res.flower3,res.flower4,res.flower5,res.flower6,res.flower7,res.flower8,res.flower9,res.flower10,res.flower11);
var clockNums = new Array(res.num0,res.num1,res.num2,res.num3,res.num4,res.num5,res.num6,res.num7,res.num8,res.num9,res.nums);
var ScoreNums = new Array(res.sNum0,res.sNum1,res.sNum2,res.sNum3,res.sNum4,res.sNum5,res.sNum6,res.sNum7,res.sNum8,res.sNum9,res.sNums);
var lifeKill = null;
var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    _touchX: 0,
    basket: null,
    _lives: [],
    _bomb: [],
    grey:null,
    ctor: function () {

        this._super();
        size = cc.winSize;
        timer = 30;//计时器
        ready = 3;//准备时间
        this._bomb.splice(0,this._bomb.length);
        this._touchX = size.width/2;
        //clock
        clock1 = new cc.Sprite(clockNums[6]);
        clock1.x = size.width/2-33;
        clock1.y = size.height/2+450;
        this.addChild(clock1,150);

        clock2 = new cc.Sprite(clockNums[0]);
        clock2.x = size.width/2+33;
        clock2.y = size.height/2+450;
        this.addChild(clock2,150);

        clock3 = new cc.Sprite(clockNums[10]);
        clock3.x = size.width/2+99;
        clock3.y = size.height/2+450;
        this.addChild(clock3,150);

        lifeKill = new cc.Sprite(res.lifeKill);
        lifeKill.x = size.width/2;
        lifeKill.y = size.height/2-200;
        lifeKill.opacity = 0;
        this.addChild(lifeKill,150);

        this.grey = new cc.Sprite(res.grey);
        this.grey.x = size.width/2;
        this.grey.y = size.height/2+150;
        this.addChild(this.grey,5);
        this.greyText = new cc.Sprite(res.greyText);
        this.greyText.x = size.width/2;
        this.greyText.y = size.height/2+150;
        this.addChild(this.greyText,5);
        
        //score
        score=0;

        score1 = new cc.Sprite();
        score1.x = 220;
        score1.y = 50;
        this.addChild(score1,150);

        score2 = new cc.Sprite();
        score2.x = 250;
        score2.y = 50;
        this.addChild(score2,150);

        score3 = new cc.Sprite(ScoreNums[0]);
        score3.x = 280;
        score3.y = 50;
        this.addChild(score3,150);

        var scoreText = new cc.Sprite(res.score);
        scoreText.x = 120;
        scoreText.y = 50;
        this.addChild(scoreText,150);



        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        this.basket = new cc.Sprite(res.basket_png);
        this.basket.attr({
            x: size.width / 2,
            y: size.height / 2 - 300
        });
        this.addChild(this.basket, 5);

         //init life
        for (var i = 0; i < 3; i++) {
            var life = new cc.Sprite(res.life);
            life.tag = "life" + i;
            life.attr({
                x: size.width - (i + 1) * 75,
                y: 100,//size.height - 40,
            });

            var liftAction1 = cc.scaleTo(0.1, 1.1);
            var liftAction2 = cc.scaleTo(0.1, 1);
            var liftAction3 = cc.scaleTo(0.1, 1.2);
            var liftAction4 = cc.scaleTo(0.7, 1);
            var seq = cc.sequence(liftAction1, liftAction2, liftAction3, liftAction4);
            life.runAction(cc.repeatForever(seq));
            this._lives.push(life);
            this.addChild(life, 5);
        }

         //init bomb
        for (var i = 0; i < 10; i++) {
            var bomb = new cc.Sprite(res.bomb);
            bomb.tag = "bomb" + i;
            bomb.attr({
                x: 0,
                y: -100,
            });
            this._bomb.push(bomb);
            this.addChild(bomb, 2);

        }

        if ("touches" in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: this._onTouchMoved.bind(this)
            }, this);
        else
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: this._onMouseMove.bind(this)
            }, this);
        cc.eventManager.addListener({event: cc.EventListener.KEYBOARD, onKeyReleased: this._back}, this);

        this.scheduleUpdate();
        flowersPool.init();
        this.schedule(this.creatFlowers, flowerInterval, cc.REPEAT_FOREVER, 0, "move");
        this.schedule(this.creatBombs, 0.2, cc.REPEAT_FOREVER, 0, "bomb");
        this.schedule(this.readSecond, 1, cc.REPEAT_FOREVER, 0, "time");

        return true;
    },

    readSecond: function () {
        if(ready>=-1){
            switch (ready){
                case 3:
                    this.greyText.setTexture(res.greyText3);
                    break;
                case 2:
                    this.greyText.setTexture(res.greyText2);
                    break;
                case 1:
                    this.greyText.setTexture(res.greyText1);
                    break;
                case 0:
                    this.greyText.setTexture(res.greyTextGo);
                    break;
                case -1:
                    this.removeChild(this.grey)
                    this.removeChild(this.greyText)
                    break;
            }
            ready-=1;
        }
        else {
            timer -= 1;
        }
    },

    creatFlowers: function () {
        if(ready>=-1)
        {
            return;
        }
        if (timer > -1&&this._lives.length>0) {
            var flower = flowersPool.get();
            if (!flower) return;
            flower.x = Math.random() * (size.width - 70) + 70;
            flower.y = size.height;
            //this.addChild(flower,flower.tag);
            this.addChild(flower,1);
        }
    },

    creatBombs:function(){
        if(ready>=-1)
        {
            return;
        }
        this.basket.setTexture(res.basket_png);
        var isBomb = Math.random() * 7;
        if (isBomb >6) {
            for (var i = 0; i < this._bomb.length; i++) {
                if (this._bomb[i].y == -100) {
                    this._bomb[i].y=size.height;
                    this._bomb[i].x = Math.random() * (size.width - 60) + 60;
                    break;
                }
            }
        }
    },
    moveCallback: function (button) {
        //this.removeChild(button);
        this.removeChildByTag(button.tag);
        flowersPool.recycle(button);
    },

    onHit: function () {
        for (var i = 0; i < flowersPool.unavailable.length; i++) {
            var flower = flowersPool.unavailable[i];

            flower.y -= flower.speed;

            if (this.basket.x - 60 < flower.x && this.basket.x + 90 > flower.x) {
                if (this.basket.y + 50 < flower.y && flower.y < this.basket.y + 100) {//如果速度大于宽度，吃不进去
                    Sound.playEat();
                    flower.y -= 200;
                    this.moveCallback(flower);
                    score+=1;
                    score1.setTexture(score/100<1?null:ScoreNums[parseInt(score/100)]);
                    score2.setTexture(score/100<1?(score/10<1?null:ScoreNums[parseInt(score/10)]):(ScoreNums[parseInt((score-100)/10)]));
                    score3.setTexture(ScoreNums[parseInt(score%10)]);
                }
            }
            else if (flower.y < 0) {
                this.moveCallback(flower);
            }
        }
        for (var i = 0; i < this._bomb.length; i++) {
                if (this._bomb[i].y == -100) {
                    continue;
                }
            else
            {
                var bomb = this._bomb[i];
                bomb.y -= speed+3;
                if (this.basket.x - 60 < bomb.x && this.basket.x + 60 > bomb.x) {
                    if (this.basket.y + 50 < bomb.y && bomb.y < this.basket.y + 100) {
                        bomb.y = -100;

                        var life = this._lives.pop();
                        this.removeChildByTag(life.tag);
                        //remove all flowers & bomb
                        while (flowersPool.unavailable.length>0) {
                            var flower = flowersPool.unavailable[0];
                            flower.y =-100
                                this.moveCallback(flower);
                        }
                        for(var j = i+1; j < this._bomb.length; j++)
                        {
                            this._bomb[j].y = -100;
                        }

                        this.basket.setTexture(res.basket_fire);
                        lifeKill.x = this._touchX+100;

                        lifeKill.runAction(cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.5)));
                        break;
                        //end remove

                    }
                }
                else if (bomb.y < 0) {
                    bomb.y =-100;
                }
            }
        }

    },

    update: function (elapsed) {
        if (timer > -1&&this._lives.length>0) {
            clock1.setTexture(timer/10==0?null:clockNums[parseInt(timer/10)]);
            clock2.setTexture(clockNums[parseInt(timer%10)]);

            this.basketMove();
            this.onHit();
        }
        else
        {
            this._lives.splice(0,this._lives.length)
            cc.director.runScene(new ScoreScene(score));
        }
    },

    basketMove: function () {
        var winSize = cc.director.getWinSize();
        if (Math.abs(-(this.basket.x - this._touchX) * 0.2) < 30)
            this.basket.setRotation((this.basket.x - this._touchX) * 0.2);

        if (this.basket.x < this.basket.width * 0.5) {
            this.basket.x = this.basket.width * 0.5;
            this.basket.setRotation(0);
        }
        if (this.basket.x > winSize.width - this.basket.width * 0.5) {
            this.basket.x = winSize.width - this.basket.width * 0.5;
            this.basket.setRotation(0);
        }


        this.basket.x = this._touchX;
    },

    _onTouchMoved: function (touches, event) {
        this._touchX = touches[0].getLocation().x;
    },

    _onMouseMove: function (event) {
        this._touchX = event.getLocationX();
    },
});
var flowersPool = {
    available: [],
    unavailable: [],
    isLock: false,
    init: function () {
        for (var i = 0; i < 30; i++) {
            var button = new cc.Sprite();//this._button = new ccui.Button();
            //button.setTouchEnabled(true);
            button.tag = "tag" + i;
            this.available.push(button);
        }
    },
    getLock: function () {
        while (!this.isLock) {
            this.isLock = true;
            return this.isLock;
        }
    },
    releaseLock: function () {
        this.isLock = false;
    },
    get: function () {
        while (this.getLock()) {
            var result = this.available.pop();
            result.setTexture(flowers[Math.floor(Math.random()*11)]);
            result.speed = speed;
            this.unavailable.push(result);
            this.releaseLock();
            return result;
        }
        this.releaseLock();
        return;
    },
    recycle: function (button) {
        while (this.getLock()) {
            var index = this.unavailable.indexOf(button);
            if (index > -1) {
                var result = this.unavailable.splice(index, 1);
                this.available.unshift(button);
                this.releaseLock();
                return result;
            }
            this.releaseLock();
            return;
        }

    }
}

var HelloWorldScene = cc.Scene.extend({
    // onEnter: function (level) {
    //     this._super();
    //     speed = level;
    //     var layer = new HelloWorldLayer();
    //     this.addChild(layer);
    // },
    ctor:function(level,interval){
        this._super();
        speed = level;
        flowerInterval = interval;
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
var Sound  = {
    isPlay:false,
    _soundEffect:0,
    playEat:function(){
        if(!Sound.isPlay)
        {
            if(Sound._soundEffect)
                cc.audioEngine.stopEffect(Sound._soundEffect)
            Sound._soundEffect = cc.audioEngine.playEffect("res/hit.wav",false);
        }
    }
}
