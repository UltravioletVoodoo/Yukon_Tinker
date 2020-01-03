function start() {

    const canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    const LEFT  = 37;
    const RIGHT = 39;
    const UP    = 38;
    const DOWN  = 40;

    let enemies = [];
    let enemiesSpawned = 0

    player = {
        alive: true,
        vel: {
            x: 0,
            y: 0
        },
        pos: {
            x: 225,
            y: 225
        },
        width: 50,
        height: 50
    };

    let playerIcon = new Image;
    let enemyIcon = new Image;
    playerIcon.src = "./playerIcon.png";
    enemyIcon.src = "./enemyIcon.png";

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

        
    time = 0;
    timer = window.setInterval(updateClock, '100');
    gameLoop();
        
        
    function keyDownHandler(e) {
        if (e.keyCode === LEFT)     player.vel.x = -10;
        if (e.keyCode === RIGHT)    player.vel.x = 10;
        if (e.keyCode === UP)       player.vel.y = -10;
        if (e.keyCode === DOWN)     player.vel.y = 10;
    }

    function keyUpHandler(e) {
        if (e.keyCode === LEFT)     player.vel.x = 0;
        if (e.keyCode === RIGHT)    player.vel.x = 0;
        if (e.keyCode === UP)       player.vel.y = 0;
        if (e.keyCode === DOWN)     player.vel.y = 0;
    }

    function updatePositions() {
        updatePlayerPos();
        updateEnemyPos();
    }

    function updatePlayerPos() {
        player.pos.x = forceBoundaries(player.pos.x + player.vel.x);
        player.pos.y = forceBoundaries(player.pos.y + player.vel.y);
    }

    function updateEnemyPos() {
        for (let enemy of enemies) {
            enemy.pos.x += enemy.vel.x;
            enemy.pos.y += enemy.vel.y;
        }
    }

    function forceBoundaries(x) {
        if (x < 0) x = 0;
        if (x > 450) x = 450;
        return x;
    }

    function updateClock() {
        time += 1;
        document.getElementById("time").innerHTML = time / 10;
    }

    function draw() {
        clearCanv();
        drawPlayer();
        drawEnemies();
    }

    function clearCanv() {
        ctx.clearRect(0, 0, 500, 500);
    }

    function drawPlayer() {
        ctx.drawImage(playerIcon, player.pos.x, player.pos.y, player.width, player.height);
    }

    function drawEnemies() {
        for (let enemy of enemies) {
            ctx.drawImage(enemyIcon, enemy.pos.x, enemy.pos.y, enemy.width, enemy.height);
        }
    }

    function drawDead() {
        ctx.fillStyle = 'red';
        for (let enemy of enemies) {
            ctx.fillRect(enemy.pos.x, enemy.pos.y, enemy.width, enemy.height);
        }
        ctx.fillRect(player.pos.x, player.pos.y, player.width, player.height);
    }

    function manageEnemySpawns() {
        if (time/10 > 3 && enemiesSpawned == 0) {
            spawnEnemy();
        }
        if (isTimeToSpawn() && enemiesSpawned != 0) {
            spawnEnemy();
        }
        
    }

    function isTimeToSpawn() {
        return (time / 10)*(time / 500) > enemiesSpawned;
    }

    function spawnEnemy() {
        enemiesSpawned += 1;
        enemies.push(generateEnemy());
    }

    function choice(collection) {
        const index = Math.floor(Math.random() * collection.length);
        return collection[index];
    }

    function generateEnemy() {
        let enemy = {
            vel: {
                x: 0,
                y: 0
            },
            pos: {
                x: -50,
                y: -50
            },
            width: 50,
            height: 50
        }
        
        let type = choice([1,2,3,4]);
        if (type == 1) {
            enemy.vel.x = choice([1, 1.5, 2]);
            enemy.pos.y = choice([0,50,100,150,200,250,300,350,400,450]);
        }
        if (type == 2) {
            enemy.vel.x = choice([-1, -1.5, -2]);
            enemy.pos.x = 550;
            enemy.pos.y = choice([0,50,100,150,200,250,300,350,400,450]);
        }
        if (type == 3) {
            enemy.vel.y = choice([1, 1.5, 2]);
            enemy.pos.x = choice([0,50,100,150,200,250,300,350,400,450]);
        }
        if (type == 4) {
            enemy.vel.y = choice([-1, -1.5, -2]);
            enemy.pos.y = 550;
            enemy.pos.x = choice([0,50,100,150,200,250,300,350,400,450]);
        }
        
        return enemy;
    }

    function manageEnemyCollision() {
        for (let enemy of enemies) {
            if (overlaps(player, enemy)) {
                player.alive = false;
            }
        }
    }

    function overlaps(a, b) {
        let aBottomRight = {x: a.pos.x + a.width, y: a.pos.y + a.height};
        let bBottomRight = {x: b.pos.x + b.width, y: b.pos.y + b.height};
        
        if (aLeftOfb(aBottomRight, b.pos) || aLeftOfb(bBottomRight, a.pos)) {
            // They are free and clear on the x axis
            return false;
        }
        if (aOverb(aBottomRight, b.pos) || aOverb(bBottomRight, a.pos)) {
            // They are free and clear on the y axis
            return false;
        }
        return true;
    }

    function aLeftOfb(aBottomRight, bTopLeft) {
        return aBottomRight.x < bTopLeft.x;
    }

    function aOverb(aBottomRight, bTopLeft) {
        return aBottomRight.y < bTopLeft.y;
    }

    function end() {
        console.log("Game Over");
        drawDead();
        window.clearInterval(timer);
        manageScores();
    }

    function manageScores() {
        let score   = document.getElementById("time").innerHTML;
        let score1  = document.getElementById("score1").innerHTML;
        let score2  = document.getElementById("score2").innerHTML;
        let score3  = document.getElementById("score3").innerHTML;
        let score4  = document.getElementById("score4").innerHTML;
        let score5  = document.getElementById("score5").innerHTML;
        if (score > score1) {
            document.getElementById("score5").innerHTML = score4;
            document.getElementById("score4").innerHTML = score3;
            document.getElementById("score3").innerHTML = score2;
            document.getElementById("score2").innerHTML = score1;
            document.getElementById("score1").innerHTML = score;
            return;
        }
        if (score > score2) {
            document.getElementById("score5").innerHTML = score4;
            document.getElementById("score4").innerHTML = score3;
            document.getElementById("score3").innerHTML = score2;
            document.getElementById("score2").innerHTML = score;
            return;
        }
        if (score > score3) {
            document.getElementById("score5").innerHTML = score4;
            document.getElementById("score4").innerHTML = score3;
            document.getElementById("score3").innerHTML = score;
            return;
        }
        if (score > score4) {
            document.getElementById("score5").innerHTML = score4;
            document.getElementById("score4").innerHTML = score;
            return;
        }
        if (score > score5) {
            document.getElementById("score5").innerHTML = score;
            return;
        }
    }

    function gameLoop() {
        
        updatePositions();
        manageEnemySpawns();
        manageEnemyCollision();
        draw();
        
        if (player.alive) window.requestAnimationFrame(gameLoop);
        else end();
    }
}