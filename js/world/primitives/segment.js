class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    static load(info) {
        return new Segment(Point.load(info.p1), Point.load(info.p2));
    }

    draw(ctx, {width = 2, color = 'black', dash = []} = {}) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    length() {
        return distance(this.p1, this.p2);
    }

    directionVector() {
        return normalize(subtract(this.p2, this.p1));
    }

    equals(segment) {
        return this.includesPoint(segment.p1) && this.includesPoint(segment.p2);
    }

    includes(point) {
        return this.includesPoint(point);
    }

    includesPoint(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
            return distance(point, proj.point);
        }
        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);
        return Math.min(distToP1, distToP2);
    }

    projectPoint(point) {
        const a = subtract(point, this.p1);
        const b = subtract(this.p2, this.p1);
        const normB = normalize(b);
        const scaler = dot(a, normB);
        return {
            point: add(this.p1, scale(normB, scaler)),
            offset: scaler / magnitude(b),
        };
    }

    isValid() {
        return !this.p1.equals(this.p2);
    }
}