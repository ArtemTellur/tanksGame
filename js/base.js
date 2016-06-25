APP.objects.Base = function (map) {
    this.image = new Image();
    this.image.src = 'content/images/base.png';
    this.map = map;
    this.cellNumber = 30;
    this.canvasPos = this.map.getCellPosition.call(this.map, this.cellNumber);
    this.isDestroy = false;
}

APP.objects.Base.prototype.update = function () {
    var that = this;
    that.canvasPos = that.map.getCellPosition.call(that.map, that.cellNumber) || false;
    if (!that.canvasPos)
    {
        that.isDestroy = true;
    }
}

APP.objects.Base.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, this.canvasPos[0], this.canvasPos[1]);
}

APP.objects.Base.prototype.reset = function () {
    this.isDestroy = false;
    this.canvasPos = this.map.getCellPosition.call(this.map, this.cellNumber);
}