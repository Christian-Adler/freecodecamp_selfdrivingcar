class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#castRays();

        this.readings = [];
        for (const ray of this.rays) {
            this.readings.push(
                this.#getReading(ray, roadBorders, traffic)
            );
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(this.raySpread / 2, -this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    #getReading(ray, roadBorders, traffic) {
        const touches = [];
        for (const roadBorder of roadBorders) {
            const touch = getIntersection(ray[0], ray[1], roadBorder[0], roadBorder[1]);
            if (touch)
                touches.push(touch);
        }

        for (const otherCar of traffic) {
            for (let i = 0; i < otherCar.polygon.length; i++) {
                const polygonPoint1 = otherCar.polygon[i];
                const polygonPoint2 = otherCar.polygon[(i + 1) % otherCar.polygon.length];

                const touch = getIntersection(ray[0], ray[1], polygonPoint1, polygonPoint2);
                if (touch)
                    touches.push(touch);
            }
        }

        if (touches.length === 0)
            return null;

        const offsets = touches.map(e => e.offset);
        const minOffset = Math.min(...offsets);

        return touches.find(e => e.offset === minOffset);
    }

    draw(ctx) {
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let end = ray[1];
            if (this.readings[i]) {
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo(ray[0].x, ray[0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.moveTo(ray[1].x, ray[1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }

}