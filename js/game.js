'use strict';

window.onload = function () {
    var objects = APP.objects,
        ctx,
        gameTime,
        lastTime,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        update,
        draw,
        main,
        onFocus = false,
        isPaused,
        reset,
        map = new objects.Map(),
        player = new objects.Player(map),
        EnemySpritePositions = {
            'red': {
                'up': [192, 224],
                'down': [192, 0],
                'left': [224, 32],
                'right': [0, 32]
            },
            'yellow': {
                'up': [160, 224],
                'down': [160, 0],
                'left': [224, 64],
                'right': [0, 64]
            },
            'blue': {
                'up': [128, 224],
                'down': [128, 0],
                'left': [224, 96],
                'right': [0, 96]
            }
        },
        spawns = {
            'yellow': 50,
            'red': 60,
            'blue': 40
        },
        redEnemy = new objects.EnemyTank([0, 0], map, spawns['red'], EnemySpritePositions['red']),
        yellowEnemy = new objects.EnemyTank([0, 0], map, spawns['yellow'], EnemySpritePositions['yellow']),
        blueEnemy = new objects.EnemyTank([0, 0], map, spawns['blue'], EnemySpritePositions['blue']),
        base = new objects.Base(map),
        fieldWidth = 672,
        fieldHeight = 480,
        gameState = {
            mainMenu: true,
            process: false,
            loose: false,
            win: false
        },
        backgroundMenu = new Image(),
        newGame = new Image(),
        win = new Image(),
        newGamePosition = [50, 200],
        gameOverTime = 0,
        newGameSize = [166, 25];
    backgroundMenu.src = 'content/images/backgroundmenu.png';
    newGame.src = 'content/images/newgame.png';
    win.src = 'content/images/win.png';
    canvas.height = 480;
    canvas.width = 896;
    canvas.style.backgroundColor = '#FFF';
    document.body.appendChild(canvas);

    update = function (dt) {
        if (gameState['mainMenu']) {
            reset();
        }
        if (gameState['process']) {
            gameState['mainMenu'] = false;
            gameState['loose'] = false;
            gameState['win'] = false;
            gameTime += dt;
            player.update.call(player, dt, fieldWidth, fieldHeight, { redEnemy: redEnemy, blueEnemy: blueEnemy, yellowEnemy: yellowEnemy });
            redEnemy.update.call(redEnemy, dt, player, base.canvasPos);
            yellowEnemy.update.call(yellowEnemy, dt, player, base.canvasPos);
            blueEnemy.update.call(blueEnemy, dt, player, base.canvasPos);
            base.update();
            if (base.isDestroy || player.lifes === 0) {
                gameOverTime += dt;
                if (gameOverTime >= 1) {
                    gameState['process'] = false;
                    gameState['loose'] = true;
                    gameOverTime = 0;
                }
            }
            if (player.score >= 30)
            {
                gameState['process'] = false;
                gameState['win'] = true;
            }
        }
    };

    reset = function () {
        map = new objects.Map();
        player = new objects.Player(map);
        redEnemy = new objects.EnemyTank([0, 0], map, spawns['red'], EnemySpritePositions['red']);
        yellowEnemy = new objects.EnemyTank([0, 0], map, spawns['yellow'], EnemySpritePositions['yellow']);
        blueEnemy = new objects.EnemyTank([0, 0], map, spawns['blue'], EnemySpritePositions['blue']);
        base = new objects.Base(map);
    }

    draw = function () {
        if (gameState['mainMenu']) {
            ctx.drawImage(backgroundMenu, 0, 0);
            ctx.drawImage(newGame, newGamePosition[0], newGamePosition[1]);
        }
        if (gameState['process']) {
            map.draw(ctx);
            base.draw(ctx);
            player.draw(ctx);
            redEnemy.draw(ctx);
            yellowEnemy.draw(ctx);
            blueEnemy.draw(ctx);
        }
        if (gameState['loose']) {
            ctx.drawImage(backgroundMenu, 0, 0);
            ctx.font = 'bold 100 sans-serif';
            ctx.fillStyle = '#000';
            ctx.fillText('You lose. Click everywhere.', 300, 200);
        }
        if (gameState['win']) {
            ctx.drawImage(backgroundMenu, 0, 0);
            ctx.font = 'bold 100 sans-serif';
            ctx.fillStyle = '#000';
            ctx.fillText('You WIN! Click everywhere!', 300, 200);
        }
    };

    canvas.onclick = function (event) {
        if (event.x > newGamePosition[0] && event.x < newGamePosition[0] + newGameSize[0] && event.y > newGamePosition[1] && event.y < newGamePosition[1] + newGameSize[1]) {
            gameState['process'] = true;
            gameState['mainMenu'] = false;
        }
        if (event.x <= canvas.width && event.x >= 0 && event.y <= canvas.height && event.y >= 0) {
            gameState['loose'] = false;
            gameState['win'] = false;
            gameState['mainMenu'] = true;
        }
    }

    main = function () {
        requestAnimationFrame(function () {
            var now = Date.now(),
                dt = (now - lastTime) / 1000;
            if (!isNaN(dt)) {
                update(dt, event);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                draw();
            }
            lastTime = now;
            requestAnimationFrame(main);
        });
    };
    main();
};