APP.objects.Bullet = function (coords, url) {
    this.coords = coords;
    this.url = url;
    this.width = 4;
    this.height = 4;
    this.image = new Image();
    this.image.src = url;
    this.range = 200;
    this.isStrike = false,
    this.fly = 0,
    this.rotate;
}

APP.objects.Bullet.prototype.update = function (dt, playerPosition, rotate) {
    var that = this,
        point = [];
    point[0] = playerPosition[0];
    point[1] = playerPosition[1];
    if (!that.isStrike) {
        that.coords[0] = point[0] + 12;
        that.coords[1] = point[1] + 12;
        that.fly = 0;
    }
    else {
        that.move(dt, point);
    }
}

APP.objects.Bullet.prototype.move = function (dt, playerPos) {
    var up = [0, -1],
        down = [0, 1],
        left = [-1, 0],
        right = [1, 0],
        that = this,
        isFly = false,
        speed = 100,
        isRange = that.checkRange();
    if (that.rotate[0] === up[0] && that.rotate[1] === up[1]) {
        that.coords[1] -= speed * dt;
        that.fly += speed * dt;
    }
    else if (that.rotate[0] === down[0] && that.rotate[1] === down[1]) {
        that.coords[1] += speed * dt;
        that.fly += speed * dt;
    }
    else if (that.rotate[0] === left[0] && that.rotate[1] === left[1]) {
        that.coords[0] -= speed * dt;
        that.fly += speed * dt;
    }
    else if (that.rotate[0] === right[0] && that.rotate[1] === right[1]) {
        that.fly += speed * dt;
        that.coords[0] += speed * dt;
    }
    if (that.fly >= that.range || !isRange) {
        that.isStrike = false;
        that.fly = 0;
        that.coords[0] = playerPos[0] + 12;
        that.coords[1] = playerPos[1] + 12;
    }
}

APP.objects.Bullet.prototype.checkRange = function () {
    var fieldHeight = 480,
        fieldWidth = 672,
        that = this;
    return that.coords[1] > 0 && that.coords[1] < fieldHeight && that.coords[0] > 0 && that.coords[0] < fieldWidth ? true : false;
}

APP.objects.Bullet.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, this.coords[0], this.coords[1])
}