function distance(point1, point2) {
    return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}

function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point;
        }
    }
    return nearest;
}

function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const seg of segments) {
        const dist = seg.distanceToPoint(loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = seg;
        }
    }
    return nearest;
}

function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p) {
    return scale(p, 1 / magnitude(p));
}

function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

function perpendicular(p) {
    return new Point(-p.y, p.x);
}

function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset,
    );
}

function angle(p) {
    return Math.atan2(p.y, p.x);
}

/**
 * Linear interpolation
 * @param A
 * @param B
 * @param t
 * @returns {*}
 */
function lerp(A, B, t) {
    return A + (B - A) * t;
}

function lerp2D(pointA, pointB, t) {
    return new Point(lerp(pointA.x, pointB.x, t), lerp(pointA.y, pointB.y, t));
}

function invLerp(A, B, v) {
    return (v - A) / (B - A);
}

function getIntersection(A, B, C, D) {
    // see segment intersection freeCodeCamp.org youTube channel
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    const eps = 0.001;
    if (Math.abs(bottom) > eps) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1)
            return {x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), offset: t};
    }
    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        const poly1_point1 = poly1[i];
        const poly1_point2 = poly1[(i + 1) % poly1.length];
        for (let j = 0; j < poly2.length; j++) {
            const poly2_point1 = poly2[j];
            const poly2_point2 = poly2[(j + 1) % poly2.length];

            const touch = getIntersection(poly1_point1, poly1_point2, poly2_point1, poly2_point2);
            if (touch)
                return true;
        }
    }
    return false;
}

function degToRad(deg) {
    return Math.cos(deg * Math.PI / 180);
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260; // not blue
    return `hsl(${hue},100%,60%)`;
}

function getFake3dPoint(point, viewPoint, height) {
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
}

function elById(id) {
    return window.document.getElementById(id);
}

function round2(val) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
}