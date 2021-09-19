const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
let loopId = null;
let gameOverPath = new Path2D();

function drawBackground() {
    ctx.fillStyle = GAME_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawInfo() {
    ctx.fillStyle = GAME_INFO_COLOR;
    ctx.fillRect(0, 0, canvas.width, 100);

    ctx.fillStyle = GAME_INFO_FONT_COLOR;
    ctx.font = '15px momospace';

    const bulletsText = `Bullets: ${game.player.bulletsCount}`,
        bulletsTextWidth = ctx.measureText(bulletsText).width,
        enemiesText = `Enemies left: ${game.enemiesLeft}`,
        enemiesTextWidth = ctx.measureText(enemiesText).width,
        levelText = `Level: ${game.level}/5`,
        levelTextWidth = ctx.measureText(levelText).width,
        stageText = `Stage: ${game.stage}/4`,
        stageTextWidth = ctx.measureText(stageText).width,
        bossLivesText = `Boss live: ${game.enemies[0]?.lives}`,
        bossLivesTextWidth = ctx.measureText(bossLivesText).width;


    ctx.fillText(bulletsText, (canvas.width / 4) - (bulletsTextWidth / 2), 20);
    if (game.isBossLevel) {
        ctx.fillText(bossLivesText, (canvas.width / 4 * 3) - (bossLivesTextWidth / 2), 20);
    } else {
        ctx.fillText(enemiesText, (canvas.width / 4 * 3) - (enemiesTextWidth / 2), 20);
    }
    ctx.fillText(levelText, (canvas.width / 2) - (levelTextWidth / 2), 40);
    ctx.fillText(stageText, (canvas.width / 2) - (stageTextWidth / 2), 60);

    if (game.isBossLevel) {
        ctx.fillStyle = BOSS_LIVES_LINE_COLOR[game.enemies[0]?.lives] || '';

        ctx.fillRect(canvas.width / 10, 70, (canvas.width / 10 * 8) / 10 * game.enemies[0]?.lives, 10);
    }
}

function drawPlayer() {
    const {x, y} = game.player.position;
    ctx.drawImage(game.player.getImage(), x, y);
}

function drawEnemies() {
    game.enemies
        .filter(e => !e.isDead())
        .forEach(enemy => {
            const {x, y} = enemy.position;
            ctx.fillStyle = enemy.color;
            ctx.strokeStyle = ENEMY_BORDER_COLOR;
            const enemyPath = new Path2D();
            enemyPath.rect(x, y, enemy.size, enemy.size);
            ctx.fill(enemyPath);
            ctx.stroke(enemyPath);
        })
}

function drawBullets() {
    if (!game.player.bulletsInMove.length) {
        return;
    }
    ctx.fillStyle = GAME_BULLET_COLOR;
    game.player.bulletsInMove
        .filter(b => !b.isDeleted)
        .forEach(bullet => {
            const {x, y} = bullet.position;
            const circle = new Path2D();
            circle.moveTo(x, y);
            circle.arc(x, y, bullet.radius, 0, Math.PI * 2);
            ctx.fill(circle);
        })
}

function checkEndGame() {
    const bulletsCount = game.player.bulletsCount;
    const bulletsInMoveCount = game.player.bulletsInMove.filter(b => !b.isDeleted).length;
    const enemiesCount = game.enemies.filter(e => !e.isDead()).length
    if ((!bulletsCount && !bulletsInMoveCount && enemiesCount) || game.isFinished) {
        game.isGameOver = true;
    }
}

function drawEndGame() {
    if (ctx.isPointInPath(
        gameOverPath,
        mousePosition.x,
        mousePosition.y
    )) {
        mouseOverEndGameButton = true;
        ctx.fillStyle = '#0099ff';
    } else {
        mouseOverEndGameButton = false;
        ctx.fillStyle = '#195686';
    }
    ctx.strokeStyle = '#00567e';
    gameOverPath = new Path2D();
    gameOverPath.rect((canvas.width / 2) - canvas.width / 4, (canvas.height / 2) - 50, canvas.width / 2, 100);
    ctx.fill(gameOverPath);
    ctx.stroke(gameOverPath);

    ctx.fillStyle = GAME_INFO_FONT_COLOR;
    ctx.font = '25px momospace';

    let endGameText = '';
    if (game.isFinished) {
        endGameText = 'You won!';
    } else if (game.isGameOver) {
        endGameText = 'Game over';
    }

    const endGameTextMetrics = ctx.measureText(endGameText),
        endGameTextWidth = endGameTextMetrics.width,
        endGameTextHeight = endGameTextMetrics.actualBoundingBoxAscent + endGameTextMetrics.actualBoundingBoxDescent,
        startGameText = `Start game`,
        startGameTextMetrics = ctx.measureText(startGameText),
        startGameTextWidth = startGameTextMetrics.width,
        startGameTextHeight = startGameTextMetrics.actualBoundingBoxAscent + startGameTextMetrics.actualBoundingBoxDescent;

    ctx.fillText(endGameText, (canvas.width / 2) - (endGameTextWidth / 2), (canvas.height / 2) - (endGameTextHeight / 2));
    ctx.fillText(startGameText, (canvas.width / 2) - (startGameTextWidth / 2), (canvas.height / 2) + (startGameTextHeight));
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!game.isGameOver) {
        if (KEYS.DOWN) {
            game.player.moveDown();
        } else if (KEYS.UP) {
            game.player.moveUp();
        }
        if (KEYS.SPACE) {
            game.player.shoot();
        }
        game.moveBullets();
        game.moveEnemy();
        game.detectCollisions();

        checkEndGame();
    }
    drawBackground();
    drawInfo();
    drawPlayer();
    drawBullets();
    drawEnemies();


    if (game.isGameOver) {
        drawEndGame();
    }
    loopId = requestAnimationFrame(loop)
}

class Game {
    constructor() {
        this.newGame();
    }

    newGame() {
        this.isGameOver = false;
        this.player = new Player();
        if (this.playerName) {
            this.player.setName(this.playerName);
        }
        this.enemies = [];
        this.level = 1;
        this.stage = 1;
        this.enemiesLeft = this.isBossLevel ? 1 : this.level * 2;
        this.player.bulletsCount = 40// = this.enemiesLeft + 7 - this.level;
        this.createEnemies();
    }

    setPlayerName(name) {
        this.playerName = name;
        this.player.setName(name);
    }

    get isBossLevel() {
        return this.level === 5;
    }

    get isFinished() {
        return this.stage > 4;
    }

    nextLevel() {
        this.level++;
        if (this.level > 5) {
            this.level = 1;
            this.stage++;
        }

        this.enemiesLeft = this.isBossLevel ? 1 : this.level * 2;
        this.player.bulletsCount = this.enemiesLeft + 7 - this.level
        this.player.bulletsInMove = [];
        this.createEnemies();
    }

    createEnemies() {
        for (let i = 0; i < this.enemiesLeft; i++) {
            this.enemies.push(new Enemy(this.stage, this.level));
        }
    }

    hitEnemy(enemy) {
        enemy.hitEnemy();
        if (enemy.isDead()) {
            this.enemiesLeft--;
        }
        if (!this.enemiesLeft) {
            this.nextLevel()
        }
    }

    moveBullets() {
        this.player.bulletsInMove
            .filter(b => !b.isDeleted)
            .forEach(bullet => bullet.moveRight());
    }

    moveEnemy() {
        this.enemies
            .filter(e => !e.isDead())
            .forEach(enemy => enemy.moveUpDown())
    }

    detectCollisions() {
        this.enemies
            .filter(e => !e.isDead())
            .forEach(enemy => {
                this.player.bulletsInMove
                    .filter(b => !b.isDeleted)
                    .forEach(bullet => {
                        if (bulletEnemyColliding(bullet, enemy)) {
                            this.hitEnemy(enemy)
                            bullet.isDeleted = true;
                        }
                    })
            })
    }
}

game = new Game();
