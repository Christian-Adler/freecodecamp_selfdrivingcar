class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.polygon = [];

        this.speed = 0;
        this.accelaration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;

        this.damaged = false;

        if (controlType !== 'DUMMY')
            this.sensor = new Sensor(this);
        this.controls = new Controls(controlType);
    }

    update(roadBorders) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders);
        }
        if (this.sensor)
            this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders) {
        if (this.polygon.length > 0) {
            for (const roadBorder of roadBorders) {
                if (polysIntersect(this.polygon, roadBorder))
                    return true;
            }
        }
        return false;
    }

    /** create the shape of the car*/
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
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
        if (this.polygon.length > 0) {
            ctx.fillStyle = this.damaged ? 'red' : 'black';
            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
            for (let i = 1; i < this.polygon.length; i++) {
                const polygonEdge = this.polygon[i];
                ctx.lineTo(polygonEdge.x, polygonEdge.y);
            }
            ctx.fill();
        }

        if (this.sensor)
            this.sensor.draw(ctx);
    }
}