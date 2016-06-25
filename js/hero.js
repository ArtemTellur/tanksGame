'use strict';
APP.objects.Player = function (map) {
    this.pos = [0, 0];
    this.size = [32, 32];
    this.frames = [0, 1, 2, 3, 4, 5, 6, 7];
    this.index = 0;
    this.url = 'content/images/TanksRight.png';
    this.map = map;
    this.cellNumber = 20;
    this.canvasPos = this.map.getCellPosition.call(this.map, this.cellNumber);
    this.frameSize = [28, 28];
    this.rotate = [1, 0];
    this.sprite = new APP.objects.Sprite(this.url, this.pos, this.size, this.canvasPos, this.frames, this.frameSize, this.rotate);
    this.bullet = new APP.objects.Bullet([0, 0], 'content/images/bullet.png');
    this.urls = {
        down: 'content/images/TanksDown.png',
        up: 'content/images/TanksUp.png',
        left: 'content/images/TanksLeft.png',
        right: 'content/images/TanksRight.png'
    };
    this.collisions = new APP.objects.Collisions(this.map);
    this.isDead = false;
    this.isBeginFire = false;
    this.timeout = 0;
    this.limit = 3;
    this.score = 0;
    this.lifes = 3;
    this.panel = new Image();
    this.panel.src = 'content/images/menu.png';
};

APP.objects.Player.prototype.update = function (dt, mapWidth, mapHeight, enemies) {
    var position = this.canvasPos,
        rotate = this.sprite.rotate,
        that = this;
    if (!that.isDead) {
        that.move.call(this, dt, mapWidth, mapHeight, position, rotate);
        that.collisions.shoutInBlock.call(that);
        that.bullet.update(dt, position, rotate);
        that.strikeInEnemy(enemies);
    }
    else {
        that.reset();
        that.timeout += dt;
        if (that.timeout >= that.limit) {
            that.lifes--;
            that.timeout = 0;
            that.isSpawn = true;
            that.isDead = false;
        }
    }
};

APP.objects.Player.prototype.draw = function (ctx) {
    var that = this;
    if (!that.isDead) {
        that.bullet.draw(ctx);
        that.sprite.draw(ctx);
    }
    ctx.drawImage(that.panel, 672, 0, 224, 480);
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#FFF'
    ctx.fillText('Score: ' + that.score, 700, 200);
    ctx.fillText('Lifes: ' + this.lifes, 700, 250);
    if (that.bullet.isStrike) {
        ctx.fillText('RELOAD', 700, 100)
    }

};

APP.objects.Player.prototype.move = function (dt, mapWidth, mapHeight, position, rotate) {
    var that = this,
        position = that.canvasPos,
        width = that.size[0],
        height = that.size[1],
        speed = 100;
    onkeypress = function (event) {
        var code = event.keyCode;
        if (code === 115 || code === 1099) {
            if (position[1] < mapHeight - height && that.collisions.checkDownCollision.call(that)) {
                position[1] += parseInt(speed * dt, 10);
                that.sprite.url = that.urls['down'];
                that.sprite.rotate = [0, 1];
                that.sprite.pos = [224, 0];
                that.sprite.index++;
                that.sprite.update();
            }
        }
        else if (code === 119 || code === 1094) {
            if (position[1] > 0 && that.collisions.checkUpCollision.call(that)) {
                position[1] -= parseInt(speed * dt, 10);
                that.sprite.index++;
                that.sprite.url = that.urls['up'];
                that.sprite.rotate = [0, -1];
                that.sprite.pos = [224, 224];
                that.sprite.update();
            }
        }
        else if (code === 97 || code === 1092) {
            if (position[0] > 0 && that.collisions.checkLeftCollision.call(that)) {
                position[0] -= parseInt(speed * dt, 10);
                that.sprite.index++;
                that.sprite.url = that.urls['left'];
                that.sprite.rotate = [-1, 0];
                that.sprite.pos = [224, 0];
                that.sprite.update();
            }
        }
        else if (code === 100 || code === 1074) {
            if (position[0] < mapWidth - width && that.collisions.checkRightCollision.call(that)) {
                position[0] += parseInt(speed * dt, 10);
                that.sprite.index++;
                that.sprite.url = that.urls['right'];
                that.sprite.rotate = [1, 0];
                that.sprite.pos = [0, 0];
                that.sprite.update();
            }
        }
        if (code === 32 && !that.bullet.isStrike) {
            that.bullet.isStrike = true;
            that.bullet.rotate = that.sprite.rotate;
        }
    }
};

APP.objects.Player.prototype.strikeInEnemy = function (enemies) {
    var that = this,
        enemy,
        enemyX,
        enemyY,
        enemySize,
        bulletX = that.bullet.coords[1],
        bulletY = that.bullet.coords[0];
    for (enemy in enemies) {
        enemyX = enemies[enemy].canvasPos[1],
        enemyY = enemies[enemy].canvasPos[0],
        enemySize = enemies[enemy].size[0];
        if (bulletX > enemyX && bulletX < enemyX + enemySize && bulletY > enemyY && bulletY < enemyY + enemySize) {
            enemies[enemy].isDead = true;
            that.bullet.isStrike = false;
            that.score++;
            console.log(that.score);
        }
    }
};

APP.objects.Player.prototype.reset = function () {
    var that = this;
    that.canvasPos = that.map.getCellPosition.call(that.map, that.cellNumber);
    that.sprite.canvasPos = that.canvasPos;
    that.side = 0;
    that.current = 0;
    that.next = 1;
    that.path = [];
    that.bullet.isStrike = false;
    that.rotate = [1, 0];
    that.sprite.pos = [0, 0];
    that.sprite.index = 0;
    that.sprite.url = that.urls['right'];
};