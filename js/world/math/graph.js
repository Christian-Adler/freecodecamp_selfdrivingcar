class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(graphInfo) {
        const points = graphInfo.points.map(i => new Point(i.x, i.y));
        const segments = graphInfo.segments.map(i => new Segment(
            points.find(p => p.equals(i.p1)),
            points.find(p => p.equals(i.p2)),
            i.oneWay
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

    getSegmentsLeavingFromPoint(point) {
        return this.segments.filter(s => {
            if (s.oneWay)
                return s.p1.equals(point);
            return s.includesPoint(point);
        });
    }

    getShortestPath(start, end) {
        if (!start || !end) return [];

        for (const point of this.points) {
            point.dist = Number.MAX_SAFE_INTEGER;
            point.visited = false;
        }

        let currentPoint = start;
        currentPoint.dist = 0;
        while (!end.visited) {
            const segs = this.getSegmentsLeavingFromPoint(currentPoint);
            for (const seg of segs) {
                const otherPoint = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
                if (currentPoint.dist + seg.length() < otherPoint.dist) {
                    otherPoint.dist = currentPoint.dist + seg.length();
                    otherPoint.prev = currentPoint;
                }
            }
            currentPoint.visited = true;

            const unvisited = this.points.filter(p => !p.visited);
            const dists = unvisited.map(p => p.dist);
            currentPoint = unvisited.find(p => p.dist === Math.min(...dists));
        }


        const path = [];
        currentPoint = end;
        while (currentPoint) {
            path.unshift(currentPoint);
            currentPoint = currentPoint.prev;
        }

        // remove added attributes
        for (const point of this.points) {
            delete point.dist;
            delete point.visited;
            delete point.prev;
        }

        return path;
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