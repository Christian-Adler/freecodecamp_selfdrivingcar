class Tree {
    constructor(center, size, height = 200 /*heightCoef=0.3*/) {
        this.center = center;
        this.size = size; // size of the base
        // this.heightCoef = heightCoef;
        this.height = height
        this.base = this.#generateBase(center, size); // tree base to interact with cars later...
    }

    #generateBase(point, size) {
        const points = [];
        const rad = size / 2;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
            points.push(translate(point, angle, rad));
        }
        return new Polygon(points);
    }

    #generateLevel(point, size) {
        const points = [];
        const rad = size / 2;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
            const kindOfRandom = Math.cos(((angle + this.center.x) * size) % 17) ** 2;
            const noisyRadius = rad * lerp(0.5, 1, kindOfRandom);
            points.push(translate(point, angle, noisyRadius));
        }
        return new Polygon(points);
    }

    draw(ctx, viewPoint) {
        // const diff = subtract(this.center, viewPoint);
        // // this.center.draw(ctx, {size: this.size, color: 'green'});
        // const top = add(this.center, scale(diff, this.heightCoef));

        const top = getFake3dPoint(this.center, viewPoint, this.height);

        const levelCount = 7;
        for (let level = 0; level < levelCount; level++) {
            const t = level / (levelCount - 1);
            const point = lerp2D(this.center, top, t);
            const color = 'rgb(30,' + lerp(50, 200, t) + ',70)';
            const size = lerp(this.size, this.size / 4, t);
            // point.draw(ctx, {size, color});

            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, {fill: color, stroke: 'rgba(0,0,0,0)'});
        }

        // this.base.draw(ctx);

        // new Segment(this.center, top).draw(ctx); // axis of the tree ;)
    }

}