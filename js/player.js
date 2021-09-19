class Player {
    constructor() {
        this.name = null;
        this.bulletsCount = 0;
        this.bulletsInMove = [];
        this.size = {width: 50, height: 45};
        this.minY = 110;
        this.position = {x: 20, y: this.minY};
        this.moveSpeed = 3;
        this.playerImage = new Image();
    }

    get maxY() {
        return canvas.height - 45;
    }

    setName(name) {
        this.name = name;
        this.playerImage.src = name;
    }

    getImage() {
        return this.playerImage;
    }

    canShoot() {
        const lastShootTime = Math.max.apply(Math, [...this.bulletsInMove.map(b => b.shootTime), 0]);
        return this.bulletsCount > 0 && Date.now() - lastShootTime > 300;
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
        }
        if (y > this.maxY) {
            y = this.maxY;
        }
        this.position = {x, y};
    }

    shoot() {
        if (!this.canShoot()) {
            return;
        }
        this.bulletsCount--;
        const {x, y} = this.position;
        this.bulletsInMove.push(new Bullet(x + this.size.width, y + (this.size.height / 2)));
    }
}
