class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(graphInfo) {
        const points = graphInfo.points.map(i => new Point(i.x, i.y));
        const segments = graphInfo.segments.map(i => new Segment(
            points.find(p => p.equals(i.p1)),
            points.find(p => p.equals(i.p2))
        ));

        return new Graph(points, segments);
    }

    hash() {
        return JSON.stringify(this);
    }

    draw(ctx) {
        for (const segment of this.segments) {
            segment.draw(ctx);
        }
        for (const point of this.points) {
            point.draw(ctx);
        }
    }

    addPoint(point) {
        this.points.push(point);
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    containsPoint(point) {
        return this.points.find(p => p.equals(point));
    }

    removePoint(point) {
        const toRemoveSegments = this.getSegmentsWithPoint(point);
        for (const toRemoveSegment of toRemoveSegments) {
            this.removeSegment(toRemoveSegment);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }

    getSegmentsWithPoint(point) {
        return this.segments.filter(s => s.includesPoint(point));
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    tryAddSegment(segment) {
        if (segment.isValid() && !this.containsSegment(segment)) {
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    containsSegment(segment) {
        return this.segments.find(s => s.equals(segment));
    }

    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1);
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

}