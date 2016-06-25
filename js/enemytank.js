APP.objects.EnemyTank = function (pos, map, cellNumber, spritePositions) {
    this.size = [32, 32];
    this.pos = pos;
    this.frames = [0, 1, 2, 3, 4, 5, 6, 7];
    this.index = 0;
    this.url = 'content/images/TanksRight.png';
    this.map = map;
    this.cellNumber = cellNumber;
    this.canvasPos = this.map.getCellPosition.call(this.map, cellNumber);
    this.frameSize = [28, 28];
    this.rotate = [1, 0];
    this.sprite = new APP.objects.Sprite(this.url, this.pos, this.size, this.canvasPos, this.frames, this.frameSize, this.rotate);
    this.bullet = new APP.objects.Bullet([0, 0], 'content/images/enemybullet.png');
    this.collisions = new APP.objects.Collisions(this.map);
    this.urls = {
        down: 'content/images/TanksDown.png',
        up: 'content/images/TanksUp.png',
        left: 'content/images/TanksLeft.png',
        right: 'content/images/TanksRight.png'
    };
    this.isDead = false,
    this.current = 0;
    this.next = 1;
    this.path = [];
    this.side = 0;
    this.spritePositions = spritePositions;
    this.isSpawn = true;
    this.timeout = 0;
    this.limit = 3;
};

APP.objects.EnemyTank.prototype.update = function (dt, hero, basePosition) {
    var that = this,
        graph = new Graph(that.map.level),
        start = graph.grid[parseInt(that.canvasPos[1] / that.size[1])][parseInt(that.canvasPos[0] / that.size[0])],
        end = graph.grid[14][4];
    if (!that.isDead) {
        if (that.isSpawn) {
            that.path = astar.search(graph, start, end);
            that.path.unshift(start);
            that.isSpawn = false;
        }
        if (that.path[that.next]) {
            that.move(dt);
        }
        that.collisions.shoutInBlock.call(that);
        that.bullet.update(dt, that.canvasPos, that.sprite.rotate);
        if (!hero.isDead) {
            that.strike(hero.canvasPos, basePosition);
            that.strikeInHero(hero);
        }
    }
    else if (that.isDead) {
        that.timeout += dt;
        that.reset();
        if (that.timeout >= that.limit) {
            that.isSpawn = true;
            that.isDead = false;
            that.timeout = 0;
        }
    }
}

APP.objects.EnemyTank.prototype.move = function (dt) {
    var dx,
        dy,
        that = this,
        speed = 60 * dt;
    dx = that.path[that.next].x - that.path[that.current].x;
    dy = that.path[that.next].y - that.path[that.current].y;
    if (dy === 1) {
        that.sprite.url = that.urls['right'];
        that.canvasPos[0] += parseInt(speed, 10);
        that.sprite.rotate = [1, 0];
        that.sprite.pos = that.spritePositions['right'];
        that.sprite.index++;
        that.sprite.update();
        that.side += parseInt(speed, 10);
    }
    else if (dy === -1) {
        that.sprite.url = that.urls['left'];
        that.canvasPos[0] -= parseInt(speed, 10);
        that.sprite.rotate = [-1, 0];
        that.sprite.pos = that.spritePositions['left'];
        that.sprite.index++;
        that.sprite.update();
        that.side += parseInt(speed, 10);
    }
    else if (dx === 1) {
        that.sprite.url = that.urls['down'];
        that.canvasPos[1] += parseInt(speed, 10);
        that.sprite.rotate = [0, 1];
        that.sprite.pos = that.spritePositions['down'];
        that.sprite.index++;
        that.sprite.update();
        that.side += parseInt(speed, 10);
    }
    else if (dx === -1) {
        that.sprite.url = that.urls['up'];
        that.canvasPos[1] -= parseInt(speed, 10);
        that.sprite.rotate = [0, -1];
        that.sprite.pos = that.spritePositions['up'];
        that.sprite.index++;
        that.sprite.update();
        that.side += parseInt(speed, 10);
    }
    if (that.side >= 32) {
        that.next++;
        that.current++;
        that.side = 0;
    }
}

APP.objects.EnemyTank.prototype.draw = function (ctx) {
    if (!this.isDead) {
        this.bullet.draw(ctx);
        this.sprite.draw(ctx);
    }
};

APP.objects.EnemyTank.prototype.strike = function (heroPosition, basePosition) {
    var that = this,
        distanceToPlayer = Math.pow(that.canvasPos[1] - heroPosition[1], 2) + Math.pow(that.canvasPos[0] - heroPosition[0], 2),
        distanceToBase = Math.pow(that.canvasPos[1] - basePosition[1], 2) + Math.pow(that.canvasPos[0] - basePosition[0], 2);
    if ((distanceToPlayer <= 20000 || distanceToBase <= 20000) && !that.bullet.isStrike) {
        this.bullet.isStrike = true;
        that.bullet.rotate = that.sprite.rotate;
    }
};

APP.objects.EnemyTank.prototype.strikeInHero = function (hero) {
    var that = this,
        heroX = hero.canvasPos[1],
        heroY = hero.canvasPos[0],
        heroSize = hero.size[0];
    bulletX = that.bullet.coords[1],
    bulletY = that.bullet.coords[0];
    if (bulletX > heroX && bulletX < heroX + heroSize && bulletY > heroY && bulletY < heroY + heroSize) {
        that.bullet.isStrike = false;
        hero.isDead = true;
    }
};

APP.objects.EnemyTank.prototype.reset = function () {
    var that = this;
    that.canvasPos = that.map.getCellPosition.call(that.map, that.cellNumber);
    that.sprite.canvasPos = that.canvasPos;
    that.side = 0;
    that.current = 0;
    that.next = 1;
    that.path = [];
    that.bullet.isStrike = false;
}