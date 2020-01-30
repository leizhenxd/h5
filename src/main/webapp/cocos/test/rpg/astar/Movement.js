function Character () {
    this.lo = null;    // Locatin
    this.pathFinder = null;
    this.route = new Object();
    this.img = null;
    this.blink = null;
    this.count = null;
    this.x = 0; //以像素为单位
    this.y = 0;

    /**
     * 
     * @param map   {Array[][]} 
     * @param dest  {Location} 目标位置
     */
    var _this = this;
    this.apf = new AstarPathFinder();
    this.move = function( map, dest) {
        var paths = _this.apf.findPath(_this.lo, dest, map);
        var index = paths.size() - 1;
        var loc = null;
        for(;index>=0;index--){
            loc = paths.get(index);
            cc.log("location:"+loc);
            _this.x(loc.x);
            _this.y(loc.y);
        }
    }
}