
var SnakeLayer;
var cubePoint=cc.p(0,0);
var LEFT = 65, RIGHT = 68, UP = 87, DOWN = 83;
// 按键方向
var direction = null;
// 蛇前进方向
var snakeDirection = null;
// ask the window size
var size = null;

var cubes = new Array();
var randomCube = null;
var pMap =[];
var cubeTotal = 0;
// 记分牌
var pointLabel = null;
// 触摸板尺寸
var keyLayerSize = new Object();

var SnakeCube = cc.DrawNode.extend({
    originPosition: null,
    destPosition: null,
    fillColor: null,
    lineWidth: null,
    lineColor: null,
    ctor: function(){
       this._super();
    },
    drawRect: function(origin, destination, fillColor, lineWidth, lineColor) {
        this.originPosition = origin;
        this.destPosition = destination;
        this.fillColor = fillColor;
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this._super(origin, destination, fillColor, lineWidth, lineColor);
    },
    repaint: function() {
        this.drawRect(this.originPosition,this.destPosition,this.fillColor, this.lineWidth,this.lineColor);
    }
});

var DirectKey = cc.DrawNode.extend({

    ctor: function (keyValue) {
        this._super();
        this.keyValue = keyValue;
    },
    verts: null, fillColor: null, lineWidth: null, lineColor: null,
    drawPoly: function (verts, fillColor, lineWidth, color) {
        this.verts = verts;
        this.fillColor = fillColor;
        this.lineWidth = lineWidth;
        this.lineColor = color;
        this._super(verts, fillColor, lineWidth, color);
    },
    repaint: function () {
        this.drawPoly(this.verts, this.fillColor, this.lineWidth, this.lineColor);
    },
    setKeyOpacity: function (opacity) {
        cc.log(this.fillColor.a);
        this.fillColor.a = opacity;
        this.clear();
        this.repaint();
    },
    keyValue: null
});
var directDrawUp = new DirectKey(UP);
var directDrawDown = new DirectKey(DOWN);
var directDrawLeft = new DirectKey(LEFT);
var directDrawRight = new DirectKey(RIGHT);
SnakeLayer = cc.LayerColor.extend({
    interval: 500,

    init: function(){
        var hNum = size.width/20,vNum = size.height/20;
        for(var i=0; i<hNum; i++) {
            var vd = [];
            for(var j=0; j<vNum; j++) {
                vd[j] = 0;
            }
            pMap[i] = vd;
        }

        cubeTotal = hNum * vNum;

        this.resume();
    },
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super(new cc.Color(200,237,204,100));
        size = cc.winSize;
        this.init();
        /////////////////////////////
        pointLabel = new cc.LabelTTF("0", "Arial", 20);
        var scoreLabel = new cc.LabelTTF("Score: ", "Arial",25);
        // position the label on the center of the screen
        pointLabel.x = 120;
        pointLabel.y = size.height  - 27;
        scoreLabel.x = 50;
        scoreLabel.y = size.height  - 25;
        // add the label as a child to this layer
        this.addChild(pointLabel, 5);
        this.addChild(scoreLabel, 5);


        ////////////////////////////////////
        this.draw = new SnakeCube();
        this.draw.drawRect(cubePoint, cc.p(20,20), cc.color(0, 0, 0, 255), 2, cc.color(128, 128, 0, 255));
        pMap[0][0] = 1;
        cubes.push(this.draw);
        this.randomCube();

        // 画按键
        var keyLayer = new cc.LayerColor(cc.color(0,111,0,0), size.width, size.height/3);
        keyLayer.setPosition(cc.p(0,0));
        keyLayerSize.width = size.width;
        keyLayerSize.height = size.height/3;
        this.addChild(keyLayer, 2);
        var verticesDown = [cc.p(0, 0), cc.p(keyLayerSize.width, 0), cc.p(keyLayerSize.width/2, keyLayerSize.height/2) ];
        var verticesUp = [cc.p(0, keyLayerSize.height), cc.p(keyLayerSize.width, keyLayerSize.height), cc.p(keyLayerSize.width/2, keyLayerSize.height/2) ];
        var verticesLeft = [cc.p(0, 0), cc.p(0, keyLayerSize.height), cc.p(keyLayerSize.width/2, keyLayerSize.height/2) ];
        var verticesRight = [cc.p(keyLayerSize.width, 0), cc.p(keyLayerSize.width, keyLayerSize.height), cc.p(keyLayerSize.width/2, keyLayerSize.height/2) ];
        directDrawUp.drawPoly(verticesUp, cc.color(255, 255, 0, 5), 1, cc.color(255, 255, 0, 20));
        directDrawDown.drawPoly(verticesDown, cc.color(255, 255, 0, 5), 1, cc.color(255, 255, 0, 20));
        directDrawLeft.drawPoly(verticesLeft, cc.color(255, 255, 0, 5), 1, cc.color(255, 255, 0, 20));
        directDrawRight.drawPoly(verticesRight, cc.color(255, 255, 0, 5), 1, cc.color(255, 255, 0, 20));
        cc.eventManager.addListener(touchListener, directDrawUp);
        cc.eventManager.addListener(touchListener, directDrawDown);
        cc.eventManager.addListener(touchListener, directDrawLeft);
        cc.eventManager.addListener(touchListener, directDrawRight);
        keyLayer.addChild(directDrawUp,3);
        keyLayer.addChild(directDrawDown,3);
        keyLayer.addChild(directDrawLeft,3);
        keyLayer.addChild(directDrawRight,3);

        this.mySchedule(this.move, cc.REPEAT_FOREVER, 0, "move");

        cc.eventManager.addListener(keyListener, keyLayer);

        this.addChild(this.draw,1);

        return true;
    },
    // 判断是吃碰到自己的身体
    isDead : function() {
        var head = cubes[0];
        for(var i=1; i< cubes.length; i++) {
            var bodyCube = cubes[i];
            var headBox = head.getBoundingBox();
            var bodyBox = bodyCube.getBoundingBox();
            if(cc.rectIntersectsRect(headBox, bodyBox)) {
                cc.log(head.getPosition(), bodyCube.getPosition(), direction);
                return true;
            }
        }
        return false;
    },
    // 判断蛇头是否碰到随机小方块
    isHit : function() {
        var head = cubes[0];
        if(randomCube != null) {
            var headBox = head.getBoundingBox();
            var randomBox = randomCube.getBoundingBox();
            if(cc.rectIntersectsRect(headBox, randomBox)) {
                return true;
            }
        }
        return false;
;   },
    move : function () {
        var prePosition = null;
        var oldPosition = cubes[0].getPosition();
        var tailPrePosition = cubes[cubes.length-1].getPosition();

        if(!(direction == LEFT && snakeDirection == RIGHT) && !(direction == UP && snakeDirection == DOWN) && !(direction == RIGHT && snakeDirection == LEFT) && !(direction == DOWN && snakeDirection == UP)) {
            snakeDirection = direction;
        }
        var hit = false;
        for(var i=0; i<cubes.length; i++) {
            if(i == 0) {
                prePosition = cubes[i].getPosition();
                if(LEFT == snakeDirection && cubes[i].getPositionX() >= 20) {
                    cubes[i].setPosition(cc.p(cubes[i].getPositionX()-20, cubes[i].getPositionY()));
                }
                else if(RIGHT == snakeDirection && cubes[i].getPositionX() < size.width-20) {
                    cubes[i].setPosition(cc.p(cubes[i].getPositionX()+20, cubes[i].getPositionY()));
                }
                else if(UP == snakeDirection && cubes[i].getPositionY() < size.height-20) {
                    cubes[i].setPosition(cc.p(cubes[i].getPositionX(), cubes[i].getPositionY()+20));
                }
                else if(DOWN == snakeDirection && cubes[i].getPositionY() >= 20) {
                    cubes[i].setPosition(cc.p(cubes[i].getPositionX(), cubes[i].getPositionY()-20));
                }
            }
            else {
                var tmpPosition = cubes[i].getPosition();
                cubes[i].setPosition(prePosition);
                prePosition = tmpPosition;
            }
            if(i==0 && this.isHit()) {
                cc.log("hit");
                hit = true;
                
                pointLabel.setString(parseInt(((cubes.length/5)+1)*0.2 + 1) + parseInt(pointLabel.getString()));
                var action = cc.scaleBy(0.2, 1.2, 1.2);
                pointLabel.runAction(cc.sequence(action, action.reverse()));
            }
            if(i==0 && this.isDead()) {
                cubes[0].setPosition(oldPosition);
                cc.log("you eat your self...");
                alert("game over...");
                this.unscheduleAllCallbacks();
                return ;
            }
        }
        if(hit) {
            randomCube.setPosition(tailPrePosition);
            cubes.push(randomCube);
            this.randomCube();
            this.updateInterval();
        }
        else{
            pMap[tailPrePosition.x/20][tailPrePosition.y/20] = 0;
        }
        pMap[cubes[0].getPosition().x/20][cubes[0].getPosition().y/20] = 1;
    },
    randomCube : function() {
        var remainTotal = cubeTotal - cubes.length;
        var randomNum = parseInt(Math.random()*remainTotal);
        var currentNum = 0;
        for(var i=0; i<pMap.length; i++) {
            for(var j=0; j<pMap[i].length; j++) {
                if(pMap[i][j] == 0) {
                    if(++currentNum == randomNum) {
                        var draw = new SnakeCube();
                        draw.drawRect(cc.p(0, 0), cc.p(20,20), cc.color(10*(cubes.length)%255,20*(cubes.length)%255,30*(cubes.length)%255,255), 2, cc.color(128, 128, 0, 255));
                        draw.setPosition(cc.p(20*i, 20*j));
                        pMap[i][j] = 1;
                        cc.log("random cube", i, j);
                        randomCube = draw;
                        this.addChild(draw, 1);
                        return;
                    }
                }
            }
        }
        cc.log("no cube generate..",randomNum);
    },
    updateInterval: function () {
        this.interval = (0.5 -(0.01*cubes.length))*1000;
    },
    mySchedule: function (callback, repeat, delay, key) {
        var then = Date.now();
        this.schedule(function(){
            var now = Date.now();
            var delta = now - then;
            if(delta > this.interval){
                then = now - (delta % this.interval);
                callback.call(this);
            }
        }.bind(this), 0, repeat, delay, key);
    }

});
var keyListener = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    swallowTouches: true,
    onKeyPressed : function (code, event) {     //实现 onTouchBegan 事件处理回调函数
        if(code == LEFT || code == RIGHT || code == UP || code == DOWN){
            // 不允许直接反方向操作
            if((direction == LEFT && code == RIGHT) || (direction == UP && code == DOWN) || (direction == RIGHT && code == LEFT) || (direction == DOWN && code == UP))
                return false;
            direction = code;
        }
        return true;
    },
    onKeyReleased : function(code, event) {

    }
});
var clickOpacity = 15;
var touchListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan : function (touch, event) {     //实现 onTouchBegan 事件处理回调函数
        var code = null;
        var location = touch.getLocation();
        var x=location.x,y=location.y;
        // 点在左上
        if(location.y > keyLayerSize.height) return false;
        if((location.y/location.x) > (keyLayerSize.height/keyLayerSize.width)){
            // 上部三点坐标
            var x1=0,y1=keyLayerSize.height,x2=keyLayerSize.width,y2=keyLayerSize.height,x3=keyLayerSize.width/2,y3=keyLayerSize.height/2;

            var n1 = ((x-x1)*(y2-y1) - (y-y1)*(x2-x1))*((x3-x1)*(y2-y1) - (y3-y1)*(x2-x1));
            var n2 = ((x-x1)*(y3-y1) - (y-y1)*(x3-x1))*((x2-x1)*(y3-y1) - (y2-y1)*(x3-x1));
            var n3 = ((x-x2)*(y3-y2) - (y-y2)*(x3-x2))*((x1-x2)*(y3-y2) - (y1-y2)*(x3-x2));
            if(n1>0 && n2>0 && n3>0) {
                direction = UP;
                code = UP;
                directDrawUp.setKeyOpacity(clickOpacity);
            }
            else {
                direction = code = LEFT;
                directDrawLeft.setKeyOpacity(clickOpacity);
            }
        }
        else{
            // 下部三点坐标
            var x1=0,y1=0,x2=keyLayerSize.width,y2=0,x3=keyLayerSize.width/2,y3=keyLayerSize.height/2;

            var n1 = ((x-x1)*(y2-y1) - (y-y1)*(x2-x1))*((x3-x1)*(y2-y1) - (y3-y1)*(x2-x1));
            var n2 = ((x-x1)*(y3-y1) - (y-y1)*(x3-x1))*((x2-x1)*(y3-y1) - (y2-y1)*(x3-x1));
            var n3 = ((x-x2)*(y3-y2) - (y-y2)*(x3-x2))*((x1-x2)*(y3-y2) - (y1-y2)*(x3-x2));
            if(n1>0 && n2>0 && n3>0) {
                direction = code = DOWN;
                directDrawDown.setKeyOpacity(clickOpacity);
            }
            else {
                direction = code = RIGHT;
                directDrawRight.setKeyOpacity(clickOpacity);
            }
        }
        if(code == LEFT || code == RIGHT || code == UP || code == DOWN){
            // 不允许直接反方向操作
            if((direction == LEFT && code == RIGHT) || (direction == UP && code == DOWN) || (direction == RIGHT && code == LEFT) || (direction == DOWN && code == UP))
                return false;
            direction = code;
        }
        return true;
    },
    onTouchEnded : function(touch, event) {
        if(direction == UP) {
            directDrawUp.setKeyOpacity(5);
        }
        else if(direction == DOWN) {
            directDrawDown.setKeyOpacity(5);
        }
        else if(direction == LEFT) {
            directDrawLeft.setKeyOpacity(5);
        }
        else if(direction == RIGHT) {
            directDrawRight.setKeyOpacity(5);
        }
    }
});

var SnakeScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SnakeLayer();
        this.addChild(layer);
    }
});

