/**
 * Created by george on 16/12/28.
 */
var ScoreScene = cc.Scene.extend({
    _score:0,
    ctor:function(score){
        this._super();
        this._score = score;

        var layer= new cc.Layer();
        this.addChild(layer);
        var size = cc.director.getWinSize();
        this.sprite = new cc.Sprite(res.scorePanel);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        var score1 = new cc.Sprite();
        score1.x = size.width/2-60;
        score1.y = size.height/2+130;
        score1.setScale(2,2);
        this.addChild(score1,5);

        var score2 = new cc.Sprite();
        score2.x = size.width/2;
        score2.y = size.height/2+130;
        score2.setScale(2,2);
        this.addChild(score2,5);

        var score3 = new cc.Sprite(ScoreNums[0]);
        score3.x = size.width/2+60;
        score3.y = size.height/2+130;
        score3.setScale(2,2);
        this.addChild(score3,5);

        if(score.toString().length===2)
        {
            score1.x-=30;
            score2.x-=30;
            score3.x-=30;
        }
        if(score.toString().length===1)
        {
            score1.x-=60;
            score2.x-=60;
            score3.x-=60;
        }

        score1.setTexture(score/100<1?null:ScoreNums[parseInt(score/100)]);
        score2.setTexture(score/100<1?(score/10<1?null:ScoreNums[parseInt(score/10)]):(ScoreNums[parseInt((score-100)/10)]));
        score3.setTexture(ScoreNums[parseInt(score%10)]);

        var reStart = new cc.MenuItemSprite((new cc.Sprite(res.reStart)),(new cc.Sprite(res.reStart)),(new cc.Sprite(res.reStart)),this.reStart,this)
        var present = new cc.MenuItemSprite((new cc.Sprite(res.present)),(new cc.Sprite(res.present)),(new cc.Sprite(res.present)),this.present,this)

        var menu1 = new cc.Menu(reStart);
        menu1.x = size.width/4;
        menu1.y = size.height/2-130;
        var menu2 = new cc.Menu(present);
        menu2.x = size.width/4*3;
        menu2.y = size.height/2-130;

        this.addChild(menu1,5);
        this.addChild(menu2,5);

        document.title = "我在花吃大作战中得到了"+this._score.toString()+",\n谁来挑战我？！";
        
        wxShare({
    		shareUrl : window.location.href,
    		shareTitle : "一起花吃大作战",
    		shareDesc : "我在「花吃大作战」中获得了"+this._score+"分的高分，\n你能超越我吗？",
    		shareImg : "http://h5.leizhenxd.com/h5/thermos/flowers/res/shareimg.jpg",
    		pageType: "thermos_flowers",
    		callback : function(){
    			visit("thermos_flowers","thermos_flowers_share");
    		}
    	});
    },
    reStart:function()
    {
    	visit("thermos_flowers","thermos_flowers_regame");
        cc.director.runScene(new StartScene());
    },
    present:function()
    {
        cc.director.runScene(new InfoScene(this._score))
    },
});