function rand(min, max) {
    min = parseInt(min, 10);
    max = parseInt(max, 10);
    if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColor() {
    let color = "rgba(";
    for (let i = 0; i < 3; i++) {
        color = color + "" + rand(0, 255) + ",";
    }
    color = color + "1)";
    return color;
}

function bulletEnemyColliding(bullet, enemy) {
    const enemySize = enemy.size;
    const bulletRadius = bullet.radius;
    const {x: enemyPositionX, y: enemyPositionY} = enemy.position;
    const {x: bulletPositionX, y: bulletPositionY} = bullet.position;

    const distX = Math.abs(bulletPositionX - enemyPositionX - enemySize / 2);
    const distY = Math.abs(bulletPositionY - enemyPositionY - enemySize / 2);

    if (distX > (enemySize / 2 + bulletRadius)) {
        return false;
    }
    if (distY > (enemySize / 2 + bulletRadius)) {
        return false;
    }

    if (distX <= (enemySize / 2)) {
        return true;
    }
    if (distY <= (enemySize / 2)) {
        return true;
    }

    const dx = distX - enemySize / 2;
    const dy = distY - enemySize / 2;
    return (dx * dx + dy * dy <= (bulletRadius * bulletRadius));
}
