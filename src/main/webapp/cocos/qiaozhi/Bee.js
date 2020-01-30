/**
 * Created by George on 2016/5/8.
 */
var snakeBody = new Array();
var cell = cc.p(3, 3);
var food = new cc.DrawNode();
var foodWidth = 0;
var foodHeight = 0;
var directionEnum = {
    left: 1,
    right: 2,
    leftUp: 3,
    leftDown: 4,
    rightUp: 5,
    rightDown: 6
};

var snakeDirection = directionEnum.rightUp;

var myRadius = 10;//圆半径
var distance = Math.sin(Math.PI / 3) * myRadius;//水平距离0.5
var distanceHeight = Math.tan(Math.PI / 3) * distance;//垂直距离
BeeLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();
        var draw = new cc.DrawNode();                 //创建drawnode对象
        this.addChild(draw, 10);

        snakeBody.push(cell);
        snakeBody.push(cc.p(4, 3));
        snakeBody.push(cc.p(5, 3));
        snakeBody.push(cc.p(6, 3));
        snakeBody.push(cc.p(7, 3));
        snakeBody.push(cc.p(8, 3));
        this.randomFood();
        this.addChild(food);
        for (var i = 0; i < 39; i++) { //行数
            for (var j = 0; j < 40; j++) {//列数
                if (i % 2 === 1 && j === 0)
                    continue;
                var row = i % 2 === 0 ? distance : 0;
                draw.drawCircle(cc.p(distance * j * 2 + row + 120, distanceHeight * i + 30), myRadius, Math.PI / 6, 6, false, 1, cc.color(i * 6, 255, j * 6, 255));
            }
        }
        cc.eventManager.addListener(keyListener, this);

        this.schedule(this.drawSnake,0.5,cc.REPEAT_FOREVER,0,"drawSnake");
        this.schedule(this.eat,0.5,cc.REPEAT_FOREVER,0,"eat");

        return true;

    },

    forward: function (isEat) {
        var newX, newY;
        var lmove = snakeBody[0].y%2===0?0:1;
        var rmove = snakeBody[0].y%2===0?1:0;
        switch (snakeDirection)
        {
            case directionEnum.left:
                newX = snakeBody[0].x-1;
                newY = snakeBody[0].y;
                break;
            case directionEnum.right:
                newX = snakeBody[0].x+1;
                newY = snakeBody[0].y;
                break;
            case directionEnum.leftUp:
                newX = snakeBody[0].x-lmove;
                newY = snakeBody[0].y+1;
                break;
            case directionEnum.leftDown:
                newX = snakeBody[0].x-lmove;
                newY = snakeBody[0].y-1;
                break;
            case directionEnum.rightUp:
                newX = snakeBody[0].x+rmove;
                newY = snakeBody[0].y+1;
                break;
            case directionEnum.rightDown:
                newX = snakeBody[0].x+rmove;
                newY = snakeBody[0].y-1;
                break;
        }

        snakeBody.unshift(cc.p(newX,newY));
        cc.log(newX,newY,lmove,rmove);
        if(!isEat)
            snakeBody.pop();
    },

    randomFood: function () {

        var row = foodHeight % 2 === 0 ? distance : 0;
        food.drawCircle(cc.p(distance * foodWidth * 2 + row + 120, distanceHeight * foodHeight + 30), myRadius / 2, Math.PI / 6, 6, false, myRadius / 2, cc.color(0, 0, 0, 255));

        foodWidth = parseInt(Math.random() * (39 - 0 + 1) + 0, 10);
        foodHeight = parseInt(Math.random() * (38 - 0 + 1) + 0, 10);

        var row = foodHeight % 2 === 0 ? distance : 0;
        food.drawCircle(cc.p(distance * foodWidth * 2 + row + 120, distanceHeight * foodHeight + 30), myRadius / 2, Math.PI / 6, 6, false, myRadius / 2, cc.color(0, 24, 249, 255));

    },


    eat:function()
    {
        if(foodWidth===snakeBody[0].x&&foodHeight==snakeBody[0].y)
        {
            this.forward(true);
            this.randomFood();
        }
    },

    drawCell: function (draw, width, height) {
        var row = height % 2 === 0 ? distance : 0;
        draw.drawCircle(cc.p(distance * width * 2 + row + 120, distanceHeight * height + 30), myRadius / 2, Math.PI / 6, 6, false, myRadius / 2, cc.color(249, 24, 0, 255));
    },

    drawSnake:function()
    {
        var draw = new cc.DrawNode();
        var width = snakeBody[snakeBody.length-1].x;
        var height = snakeBody[snakeBody.length-1].y;
        var row = height % 2 === 0 ? distance : 0;
        draw.drawCircle(cc.p(distance * width * 2 + row + 120, distanceHeight * height + 30), myRadius / 2, Math.PI / 6, 6, false, myRadius / 2, cc.color(0, 0, 0, 255));

        this.forward(false);

        for(var i=0;i<snakeBody.length;i++) {
            this.drawCell(draw, snakeBody[i].x, snakeBody[i].y);
        }

        this.addChild(draw, 1);
    },
});

var keyListener = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    swallowTouches: true,
    onKeyPressed : function (code, event) {
        switch(code){
            case 87:
                snakeDirection = directionEnum.leftUp;
                break;
            case 69:
                snakeDirection = directionEnum.rightUp;
                break;
            case 65:
                snakeDirection = directionEnum.left;
                break;
            case 68:
                snakeDirection = directionEnum.right;
                break;
            case 90:
                snakeDirection = directionEnum.leftDown;
                break;
            case 88:
                snakeDirection = directionEnum.rightDown;
                break;
        }
        return true;
    },
    onKeyReleased : function(code, event) {

    }
});
var BeeScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new BeeLayer();
        this.addChild(layer);
    }
});