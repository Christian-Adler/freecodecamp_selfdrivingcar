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

        this.controls = new Controls();
    }

    update() {
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


        this.y -= this.speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.fill();
    }
}