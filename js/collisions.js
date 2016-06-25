APP.objects.Collisions = function (map) {
    this.map = map;
    this.level = this.map.level;
}

APP.objects.Collisions.prototype.checkUpCollision = function () {
    var that = this,
        i,
        j,
        blockSize = that.collisions.map.blockSize,
        position = that.canvasPos;
    for (i = 0; i < that.collisions.level.length; i++) {
        for (j = 0; j < that.collisions.level[i].length; j++) {
            if (((parseInt(position[1] / blockSize, 10) === i && parseInt((position[0] + that.frameSize[0]) / blockSize, 10) === j)
                || (parseInt(position[1] / blockSize, 10) === i && parseInt(position[0] / blockSize, 10) === j))
                && (that.collisions.level[i][j] === 1 || that.collisions.level[i][j] == 2 || that.collisions.level[i][j] == 30)) {
                return false;
            }
        }
    }
    return true;
};

APP.objects.Collisions.prototype.checkDownCollision = function () {
    var that = this,
        i,
        j,
        blockSize = that.collisions.map.blockSize,
        position = that.canvasPos;
    for (i = 0; i < that.collisions.level.length; i++) {
        for (j = 0; j < that.collisions.level[i].length; j++) {
            if (((parseInt((position[1] + that.frameSize[1]) / blockSize, 10) === i && parseInt((position[0] + that.frameSize[0]) / blockSize, 10) === j)
                || (parseInt((position[1] + that.frameSize[1]) / blockSize, 10) === i && parseInt(position[0] / blockSize, 10) === j))
                && (that.collisions.level[i][j] === 1 || that.collisions.level[i][j] == 2 || that.collisions.level[i][j] == 30)) {
                return false;
            }
        }
    }
    return true;
};

APP.objects.Collisions.prototype.checkLeftCollision = function () {
    var that = this,
        i,
        j,
        blockSize = that.collisions.map.blockSize,
        position = that.canvasPos;
    for (i = 0; i < that.collisions.level.length; i++) {
        for (j = 0; j < that.collisions.level[i].length; j++) {
            if (((parseInt(position[1] / blockSize, 10) === i && parseInt(position[0] / blockSize, 10) === j)
                || (parseInt((position[1] + that.frameSize[1]) / blockSize, 10) === i && parseInt(position[0] / blockSize, 10) === j))
                && (that.collisions.level[i][j] === 1 || that.collisions.level[i][j] == 2 || that.collisions.level[i][j] == 30)) {
                return false;
            }
        }
    }
    return true;
};

APP.objects.Collisions.prototype.checkRightCollision = function () {
    var that = this,
        i,
        j,
        blockSize = that.collisions.map.blockSize,
        position = that.canvasPos;
    for (i = 0; i < that.collisions.level.length; i++) {
        for (j = 0; j < that.collisions.level[i].length; j++) {
            if (((parseInt(position[1] / blockSize, 10) === i && parseInt((position[0] + that.frameSize[0]) / blockSize, 10) === j)
                || (parseInt((position[1] + that.frameSize[1]) / blockSize, 10) === i && parseInt((position[0] + that.frameSize[0]) / blockSize, 10) === j))
                && (that.collisions.level[i][j] === 1 || that.collisions.level[i][j] == 2 || that.collisions.level[i][j] == 30)) {
                return false;
            }
        }
    }
    return true;
};

APP.objects.Collisions.prototype.shoutInBlock = function () {
    var that = this,
        i,
        j,
        blockSize = that.collisions.map.blockSize,
        position = that.bullet.coords;
    for (i = 0; i < that.collisions.level.length; i++) {
        for (j = 0; j < that.collisions.level[i].length; j++) {
            if (parseInt((position[1] + 2) / blockSize, 10) === i && parseInt((position[0] + 2) / blockSize, 10) === j && (that.collisions.level[i][j] === 1 || that.collisions.level[i][j] === 2 || that.collisions.level[i][j] === 30)) {
                that.collisions.level[i][j] = 0;
                that.bullet.isStrike = false;
            }
        }
    }
}