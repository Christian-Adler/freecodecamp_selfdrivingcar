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

function getIntersection(A, B, C, D) {
    // see segment intersection freeCodeCamp.org youTube channel
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom !== 0) {
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

function getRandomColor() {
    const hue = 290 + Math.random() * 260; // not blue
    return `hsl(${hue},100%,60%)`;
}