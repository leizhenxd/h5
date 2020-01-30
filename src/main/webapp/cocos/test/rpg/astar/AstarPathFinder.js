function AstarPathFinder() {

    //开启列表
    this.openList = new Array();
    //关闭列表
    this.closeList = new Array();

    var _this = this;

    this.removeFromArray = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == value.x && array[i].y == value.y)
                array.splice(i, 1);
        }
    };
    this.containInArray = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == value.x && array[i].y == value.y)
                return true;
        }
        return false;
    };
    /**
     *
     * @param start {Location}
     * @param dest {Location}
     * @param map {Object - Map}
     */
    
    this.findPath  = function (start, dest,map){
        var path = new Array();
        _this.openList.push(start);
        var current = null; // Location
        while(_this.openList.length != 0){
            current = _this.getLowestFscoreLocation(_this.openList);
            //System.out.println(current.toString());
            _this.closeList.push(current);
            _this.removeFromArray(_this.openList,current);
            if(_this.containInArray(this.closeList,dest)){
                break;
            }
            var adjacentLocations = _this.getWalkableAdjacentLocations(current, map);
            for(var i=0;i<adjacentLocations.length; i++){
                var lo = adjacentLocations[i];
                if(_this.containInArray(_this.closeList,lo)){
                    continue;
                }
                if(!_this.containInArray(_this.openList, lo)){
                    lo.movedSteps = current.movedSteps+1;
                    lo.evalRemainSteps = _this.evalRemainSteps(current,dest);
                    lo.totalEvalSteps = _this.evalRemainSteps(current,dest)+lo.movedSteps;
                    _this.openList.push(lo);
                }else{
                    if(current.movedSteps+1 < lo.movedSteps){
                        lo.movedSteps = current.movedSteps+1;
                        lo.previous = current;
                    }
                }
            }
        }
        var destination = null;
        if(_this.containInArray(_this.closeList, dest)){
            destination = current;

            path.push(destination);
            while(destination.previous != null){
                destination = destination.previous;
                path.push(destination);
            }
        }

        return path;
    }

    /**
     *
     * @param current {Location}
     * @param map {Int[][]}
     * @returns {Array[Location]}
     */
    this.getWalkableAdjacentLocations = function(current, map){
        var x = current.x;
        var y = current.y;
        var walkableLos = new Array(); // Array[Location]
        var lo = null;
        if((x+1) < map[0].length && map[y][x+1] < 4){
            lo = new Location(cc.p(x+1,y));
            lo.previous = current;
            walkableLos.push(lo);
        }
        if(x-1>=0 && map[y][x-1] < 4){
            lo = new Location(cc.p(x-1,y));
            lo.previous = current;
            walkableLos.push(lo);
        }
        if(y+1 < map.length && map[y+1][x] < 4){
            lo = new Location(cc.p(x,y+1));
            lo.previous = current;
            walkableLos.push(lo);
        }
        if(y-1>=0 && map[y-1][x] < 4){
            lo = new Location(cc.p(x,y-1));
            lo.previous = current;
            walkableLos.push(lo);
        }
        return walkableLos;
    }

    /**
     * 找到F值最低的位置
     * @param openList
     * @return
     */
    this.getLowestFscoreLocation = function (openList){
        if(openList == null || openList.length == 0){
            return null;
        }
        var minSteps = openList[0].totalEvalSteps;
        var tmpSteps = 0;
        var lowestFlocation = openList[0];
        for(var i=0; i<openList.length; i++){
            var lo = openList[i];
            tmpSteps = lo.totalEvalSteps;
            if(tmpSteps < minSteps){
                minSteps = tmpSteps;
                lowestFlocation = lo;
            }
        }
        return lowestFlocation;
    }

    /**
     * 评估H值
     * @param current
     * @param dest
     * @return
     */
    this.evalRemainSteps = function (current,dest){ // H function
        var distanceX = dest.x - current.x;
        var distanceY = dest.y - current.y;
        if(distanceX < 0){
            distanceX = distanceX * -1;
        }
        if(distanceY < 0){
            distanceY = distanceY * -1;
        }
        return distanceX + distanceY;
    }
}