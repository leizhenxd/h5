var size = null;
var SPEED = 1;
MusicalLayer = cc.LayerColor.extend({
    helloLabel: null,
    interval: 300,
    ctor: function () {
        this._super(cc.color(10, 0, 0, 255));
        size = cc.winSize;

        this.helloLabel = new cc.LabelTTF("Hello World", "Arial", 18);
        // position the label on the center of the screen
        this.helloLabel.x = size.width / 2;
        this.helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);
        buttonPool.init();
        this.myscheduler(this.next, cc.REPEAT_FOREVER, 3, "next");
     //   this.scheduleOnce(this.myscheduler,1, "move");
        // 添加键盘
        var keyBoard = new KeyBoard(this);
        keyBoard.width = size.width;
        keyBoard.height = 40;
        this.addChild(keyBoard, 1);

        for(var i=1; i<5; i++) {
            var layerGradient = new cc.LayerGradient(cc.color(255,0,0,255), cc.color(10,0,0,100), cc.p(0,1), null);
            layerGradient.setContentSize(size.width/4, size.height/2);
            layerGradient.tag = "gradient"+i;
            layerGradient.y = 0;
            layerGradient.x = (i-1)*(size.width/4);
            layerGradient.visible = false;
            this.addChild(layerGradient);
        }
    },
    myscheduler: function (callback, repeat, delay, key) {
        var then = Date.now();
        this.schedule(function(){
            var now = Date.now();
            var delta = now - then;
            if(delta > this.interval){
                then = now - (delta % this.interval);
                callback.call(this);
            }
        }.bind(this), 0, repeat, delay, key);
    },
    next: function () {
        var colNum = parseInt(Math.random()*4);
        var button = buttonPool.get();
        button.x = button.width*(2*colNum+1)/2;
        button.y = size.height;
        this.addChild(button);
        this.buttonMove(button);

    },
    buttonMove: function (button) {
        var action = cc.moveTo(SPEED, cc.p(button.getPositionX(), -70));
        var func = new cc.CallFunc(this.moveCallback,this, button);
        button.runAction(cc.sequence(action, func));
    },
    moveCallback: function (button) {
        this.removeChild(button);
        buttonPool.recycle(button);
    }
});

// 键盘
var KeyBoard = cc.LayerColor.extend({
    parentLayer: null,
    ctor : function (parent) {
        this._super(cc.color(155,111,111,255));
        this.parentLayer = parent;
        var button1 = new ccui.Button();
        button1.setTouchEnabled(true);
        button1.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
        button1.width = size.width/4;
        button1.setPosition(cc.p(button1.width/2,20));

        var button2 = new ccui.Button();
        button2.setTouchEnabled(true);
        button2.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
        button2.width = size.width/4;
        button2.setPosition(cc.p(button1.width*3/2,20));

        var button3 = new ccui.Button();
        button3.setTouchEnabled(true);
        button3.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
        button3.width = size.width/4;
        button3.setPosition(cc.p(button1.width*5/2,20));

        var button4 = new ccui.Button();
        button4.setTouchEnabled(true);
        button4.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
        button4.width = size.width/4;
        button4.setPosition(cc.p(button1.width*7/2,20));
        this.addChild(button1, 1)
        this.addChild(button2, 1)
        this.addChild(button3, 1)
        this.addChild(button4, 1)

        button1.addTouchEventListener(this.touchEvent, this);
        button2.addTouchEventListener(this.touchEvent, this);
        button3.addTouchEventListener(this.touchEvent, this);
        button4.addTouchEventListener(this.touchEvent, this);
    },
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.touch(sender);
                break;

            case ccui.Widget.TOUCH_MOVED:
                break;

            case ccui.Widget.TOUCH_ENDED:
                var index = parseInt(sender.x/(size.width/4)) + 1;
                var gradient = this.parentLayer.getChildByTag("gradient"+index);
                gradient.visible = false;
                break;

            case ccui.Widget.TOUCH_CANCELED:
                var index = parseInt(sender.x/(size.width/4)) + 1;
                var gradient = this.parentLayer.getChildByTag("gradient"+index);
                gradient.visible = false;
                break;

            default:
                break;
        }
    },
    touch: function (sender) {
        var senderX = sender.x, senderY = sender.y;

        for(var i=0; i<buttonPool.unavailable.length; i++) {
            if(buttonPool.unavailable[i].x == senderX && (buttonPool.unavailable[i].y-20)<senderY && (buttonPool.unavailable[i].y+20)>senderY) {
                console.log("adfasdf");
                var flower = new cc.ParticleFlower();
                flower.texture = cc.textureCache.addImage("res/stars.png");
                flower.setShapeType(cc.ParticleSystem.STAR_SHAPE);
                flower.duration = 0.1;
                flower.scale = 0.7;
                flower.x = sender.x;
                flower.y = 20;
                this.addChild(flower, 2);
                buttonPool.unavailable[i].removeFromParent(true);
                buttonPool.recycle(buttonPool.unavailable[i]);
                break;
            }
        }
        var index = parseInt(senderX/(size.width/4)) + 1;
        var gradient = this.parentLayer.getChildByTag("gradient"+index);
        gradient.visible = true;
    },
});

var buttonPool = {
    available: [],   // 闲置可用的按钮
    unavailable: [], // 出现的按钮
    isLock: false,
    init: function () {
        for(var i=0; i<15; i++) {
            var button = new ccui.Button();
            button.setTouchEnabled(true);
            button.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
            button.rotationX = 5;
            button.rotationY = 0;
            button.tag = "tag"+i
            button.setPressedActionEnabled(false);
            this.available.push(button);
        }
    },
    getLock: function () {
        while(!this.isLock) {
            this.isLock = true;
            return this.isLock;
        }
    },
    releaseLock: function() {
        this.isLock = false;
    },
    get: function () {
        while (this.getLock()){
            var result = this.available.pop();
            this.unavailable.push(result);
            this.releaseLock();
            return result;
        }
        this.releaseLock();
        return ;
    },
    recycle: function (button) {
        while(this.getLock()) {
            var index = this.unavailable.indexOf(button);
            if(index > -1) {
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

var touchListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan : function (touch, event) {     //实现 onTouchBegan 事件处理回调函数
        cc.log("222");
        return true;
    },
    onTouchEnded : function(touch, event) {

    }
});
var MusicalScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MusicalLayer();
        this.addChild(layer);
    }
});

