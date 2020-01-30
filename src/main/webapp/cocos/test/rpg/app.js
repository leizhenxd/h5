
var HelloWorldLayer;
var player;
var layer;
var direction = null;
var LEFT = 65, RIGHT = 68, UP = 87;
var map;
var cubeWidth = 32, cubeHeight = 32;
var size;
var mapArray = new Array();
HelloWorldLayer = cc.LayerColor.extend({
    sprite: null,
    player: null,
    init: function () {
        player = new cc.DrawNode();
        player.drawDot(cc.p(0,0), 16, cc.color(255,0,0,255));
        player.x = cubeWidth/2;player.y = size.height - cubeHeight/2;
        layer.addChild(player, 2);
    },
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super(new cc.Color(255,255,255,100));
        layer = this;
        size = cc.winSize;

        layer.init();

        var mapLayer = new cc.LayerColor();
        map = cc.TMXTiledMap.create("rpg/res/town.tmx");
        map.width = size.width;
        mapLayer.addChild(map);
        this.addChild(mapLayer,1);

        var mapListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                var p = touch.getLocation();
                cc.log(parseInt(p.x/32), parseInt((size.height-p.y)/32));
                var blockID = map.getLayer("town").getTileGIDAt(parseInt(p.x/32), parseInt((size.height-p.y)/32));
                mapArray.splice(0,mapArray.length);
                for(var i=0; i<15; i++) {
                    var arrayItem = new Array();
                    for(var j=0; j<10; j++) {
                        arrayItem.push(map.getLayer("town").getTiles()[10*i+j]);
                    }
                    mapArray.unshift(arrayItem);
                }
                cc.log(mapArray);
               layer.move(cc.p(parseInt(p.x/32), parseInt(p.y/32)))
            },
            onTouchMoved : function (touch) {
                console.log("moving...");
                var p = touch.getLocation();
                if(p.x > player.x) {
                    direction = RIGHT;
                }
                if(p.x < player.x) {
                    direction = left;
                }
            },
            onTouchEnded : function(){

            }
        });
        cc.eventManager.addListener(mapListener, map);


        return true;
    },
    move: function (dest) {
        cc.log("from:",cc.p(parseInt(player.x/32),parseInt(player.y/32)));
        var moveArray = new AstarPathFinder().findPath(new Location(cc.p(parseInt(player.x/32),parseInt(player.y/32))), dest, mapArray);
        if(moveArray.length <2) return ;
        cc.log("aim:",dest);
        cc.log(moveArray);
        var actionArray = new Array();
        for(var i=moveArray.length-2; i>=0; i--) {
            cc.log("move to",i, moveArray[i].y*32-cubeHeight/2);
            var action = cc.moveTo(0.1, cc.p(moveArray[i].x*32+cubeWidth/2,moveArray[i].y*32+cubeHeight/2));
            actionArray.push(action);
        };
        player.runAction(cc.sequence(actionArray));
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});