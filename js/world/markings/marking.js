class Marking {
    constructor(center, directionVector, width, height) {
        this.type = this.constructor.name.toLowerCase();
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.support = new Segment(
            translate(center, angle(directionVector), height / 2),
            translate(center, angle(directionVector), -height / 2)
        );
        this.polygon = new Envelope(this.support, width, 0).poly;
    }

    static load(info) {
        const center = Point.load(info.center);
        const dir = Point.load(info.directionVector);
        switch (info.type) {
            case 'crossing':
                return new Crossing(center, dir, info.width, info.height);
            case 'light':
                return new Light(center, dir, info.width, info.height);
            case 'parking':
                return new Parking(center, dir, info.width, info.height);
            case 'start':
                return new Start(center, dir, info.width, info.height);
            case 'stop':
                return new Stop(center, dir, info.width, info.height);
            case 'target':
                return new Target(center, dir, info.width, info.height);
            case 'yield':
                return new Yield(center, dir, info.width, info.height);
        }
    }

    draw(ctx) {
        // this.polygon.draw(ctx);
        this.polygon.draw(ctx);
    }
}