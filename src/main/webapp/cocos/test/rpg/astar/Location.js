function Location(p) {
    this.x = p.x || 0;
    this.y = p.y || 0;
    this.movedSteps = 0; //g值
    this.previous = null;
}