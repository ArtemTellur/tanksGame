APP.objects.Sprite = function (url, pos, size, canvasPos, frames, frameSize, rotate) {
    this.pos = pos;
    this.size = size;
    this.frames = frames;
    this.index = 0;
    this.url = url;
    this.canvasPos = canvasPos;
    this.frameSize = frameSize;
    this.rotate = rotate;
}

APP.objects.Sprite.prototype.update = function () {
    if (this.index === this.frames.length - 1) {
        this.index = 0;
    }
};

APP.objects.Sprite.prototype.draw = function (ctx) {
    var currentFrame = this.frames[this.index],
        x = this.pos[0] + currentFrame * this.size[0] * this.rotate[0],
        y = this.pos[1] + currentFrame * this.size[1] * this.rotate[1],
        width = this.size[0],
        height = this.size[1],
        canvasX = this.canvasPos[0],
        canvasY = this.canvasPos[1],
        image = new Image(),
        frameSize = this.frameSize;
    image.src = this.url;
    ctx.drawImage(image, x, y, width, height, canvasX, canvasY, frameSize[0], frameSize[1]);
};