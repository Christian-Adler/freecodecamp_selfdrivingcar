class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.accelaration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.controls = new Controls();
    }

    update() {
        this.#move();
    }

    #move() {
        const controls = this.controls;
        if (controls.forward)
            this.speed += this.accelaration;
        if (controls.reverse)
            this.speed -= this.accelaration;

        // limit to max speed
        if (this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
        else if (this.speed < -this.maxSpeed / 2)
            this.speed = -this.maxSpeed / 2;

        // friction
        if (this.speed > 0)
            this.speed -= this.friction;
        if (this.speed < 0)
            this.speed += this.friction;
        // full stop
        if (Math.abs(this.speed) < this.friction) this.speed = 0;

        // steer
        if (this.speed !== 0) {
            // if reverse flip controls
            const flip = this.speed > 0 ? 1 : -1;
            if (controls.left) {
                this.angle += 0.03 * flip;
            }
            if (controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.fill();

        ctx.restore();
    }
}