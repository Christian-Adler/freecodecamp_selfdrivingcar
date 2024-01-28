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