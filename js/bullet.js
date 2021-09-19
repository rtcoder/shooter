class Bullet {
    constructor(x, y) {
        this.position = {x, y};
        this.radius = 2;
        this.shootTime = Date.now();
        this.isDeleted = false;
    }

    get maxX() {
        return canvas.width;
    }

    moveRight() {
        if (this.isDeleted) {
            return;
        }
        const {x, y} = this.position;
        const newX = x + 10;
        this.setPosition(newX, y);
    }

    setPosition(x, y) {
        if (x > this.maxX) {
            this.isDeleted = true;
        }
        this.position = {x, y};
    }
}
