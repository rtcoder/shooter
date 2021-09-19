class Enemy {
    constructor(stage, level) {
        this.isBoss = level === 5;
        this.minY = 120;
        this.minX = 70;
        this.size = this.isBoss ? 40 : 20 - stage;
        this.position = {
            x: this.isBoss ? this.maxX : rand(this.minX, this.maxX),
            y: this.isBoss ? this.minY : rand(this.minY, this.maxY)
        };
        this.color = getRandomColor();
        this.lives = this.isBoss ? 10 : 1;
        this.moveSpeed = 1;
        this.moveDirection = 1
    }

    get maxX() {
        return canvas.width - this.size;
    }

    get maxY() {
        return canvas.height - this.size;
    }

    moveUpDown() {
        if (!this.isBoss) {
            return;
        }
        if (this.moveDirection === 1) {
            this.moveUp();
        } else {
            this.moveDown();
        }
    }

    moveDown() {
        const {x, y} = this.position;
        const newY = y + this.moveSpeed;
        this.setPosition(x, newY)
    }

    moveUp() {
        const {x, y} = this.position;
        const newY = y - this.moveSpeed;
        this.setPosition(x, newY)
    }

    setPosition(x, y) {
        if (y < this.minY) {
            y = this.minY;
            this.moveDirection = this.moveDirection * -1;
        }
        if (y > this.maxY) {
            y = this.maxY;
            this.moveDirection = this.moveDirection * -1;
        }
        if (x > this.maxX) {
            x = this.maxX;
        }
        this.position = {x, y};
    }

    hitEnemy() {
        this.lives--;
    }

    isDead() {
        return this.lives <= 0;
    }
}
