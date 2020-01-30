var size = null;
var SPEED = 1;
MusicalLayer = cc.LayerColor.extend({
    helloLabel: null,
    ctor: function () {
        this._super(cc.color(100, 0, 0, 100));
        size = cc.winSize;

        this.helloLabel = new cc.LabelTTF("Hello World", "Arial", 18);
        // position the label on the center of the screen
        this.helloLabel.x = size.width / 2;
        this.helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);
        buttonPool.init();
        this.schedule(this.myscheduler,1,cc.REPEAT_FOREVER, 0, "move");
     //   this.scheduleOnce(this.myscheduler,1, "move");
    },
    myscheduler: function () {
        this.next();
    },
    next: function () {
        var colNum = parseInt(Math.random()*4);
        var button = buttonPool.get();
        button.x = colNum*75 + 50;
        button.y = size.height;
        button.addTouchEventListener(this.touchEvent, this);
        this.addChild(button);
        this.buttonMove(button);

    },
    buttonMove: function (button) {
        var action = cc.moveTo(SPEED, cc.p(button.getPositionX(), -30));
        var func = new cc.CallFunc(this.moveCallback,this, button);
        button.runAction(cc.sequence(action, func));
    },
    moveCallback: function (button) {
        this.removeChild(button);
        buttonPool.recycle(button);
    },
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                var flower = new cc.ParticleFlower();
                flower.texture = cc.textureCache.addImage("res/stars.png");
                flower.setShapeType(cc.ParticleSystem.STAR_SHAPE);
                flower.duration = 0.1;
                flower.scale = 0.7;
                flower.x = sender.x;
                flower.y = 20;
                this.addChild(flower);
                break;

            case ccui.Widget.TOUCH_MOVED:
                this.helloLabel.setString("Touch Move");
                break;

            case ccui.Widget.TOUCH_ENDED:
                this.helloLabel.setString("Touch Up");
                break;

            case ccui.Widget.TOUCH_CANCELED:
                this.helloLabel.setString("Touch Cancelled");
                break;

            default:
                break;
        }
    }
});
var buttonPool = {
    available: [],
    unavailable: [],
    isLock: false,
    init: function () {
        for(var i=0; i<5; i++) {
            var button = this._button = new ccui.Button();
            button.setTouchEnabled(true);
            button.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
            button.rotationX = 5;
            button.rotationY = 0;
            button.tag = "tag"+i;
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

