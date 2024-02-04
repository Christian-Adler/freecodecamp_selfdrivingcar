class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 0; i < points.length; i++) {
            this.segments.push(new Segment(points[i], points[(i + 1) % points.length]));
        }
    }

    static load(info) {
        return new Polygon(info.points.map(i => Point.load(i)));
    }

    static break(poly1, poly2) {
        const segments1 = poly1.segments;
        const segments2 = poly2.segments;
        // const intersections = [];
        for (let i = 0; i < segments1.length; i++) {
            const segment1 = segments1[i];
            for (let j = 0; j < segments2.length; j++) {
                const segment2 = segments2[j];

                const int = getIntersection(
                    segment1.p1, segment1.p2, segment2.p1, segment2.p2
                );

                if (int && int.offset !== 1 && int.offset !== 0) {
                    const point = new Point(int.x, int.y);
                    // intersections.push(point);
                    let aux = segment1.p2;
                    segment1.p2 = point;
                    segments1.splice(i + 1, 0, new Segment(point, aux));

                    aux = segment2.p2;
                    segment2.p2 = point;
                    segments2.splice(j + 1, 0, new Segment(point, aux));
                }
            }
        }
        // return intersections;
    }

    static multiBreak(polygons) {
        for (let i = 0; i < polygons.length - 1; i++) {
            const polygon1 = polygons[i];
            for (let j = i + 1; j < polygons.length; j++) {
                const polygon2 = polygons[j];
                Polygon.break(polygon1, polygon2);
            }
        }
    }

    static union(polygons) {
        Polygon.multiBreak(polygons);
        const keptSegments = [];
        for (let i = 0; i < polygons.length; i++) {
            const polygonI = polygons[i];
            for (const segment of polygonI.segments) {
                let keep = true;
                for (let j = 0; j < polygons.length; j++) {
                    const polygonJ = polygons[j];
                    if (i !== j) {
                        if (polygonJ.containsSegment(segment)) {
                            keep = false;
                            break;
                        }
                    }
                }
                if (keep) keptSegments.push(segment);
            }
        }
        return keptSegments;
    }

    /**
     * Name a little bit misleading - only checks if the middle point is contained
     * @param segment
     */
    containsSegment(segment) {
        const midPoint = average(segment.p1, segment.p2);
        return this.containsPoint(midPoint);
    }

    distanceToPoint(point) {
        return Math.min(...this.segments.map(s => s.distanceToPoint(point)));
    }

    distanceToPoly(polygon) {
        return Math.min(...this.points.map(p => polygon.distanceToPoint(p)));
    }

    intersectsPoly(polygon) {
        for (const segment1 of this.segments) {
            for (const segment2 of polygon.segments) {
                if (getIntersection(segment1.p1, segment1.p2, segment2.p1, segment2.p2))
                    return true;
            }
        }
        return false;
    }

    containsPoint(point) {
        const outerPoint = new Point(-10000, -10000);
        let intersectionCount = 0;
        for (const segment of this.segments) {
            const int = getIntersection(outerPoint, point, segment.p1, segment.p2);
            if (int)
                intersectionCount++;
        }
        return intersectionCount % 2 === 1;
    }

    drawSegments(ctx) {
        for (const segment of this.segments) {
            segment.draw(ctx, {color: getRandomColor(), width: 5});
        }
    }

    draw(ctx, {stroke = 'blue', lineWidth = 2, fill = 'rgba(0,0,255,0.3)'} = {}) {
        const points = this.points;
        if (points.length === 0) return;

        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

}