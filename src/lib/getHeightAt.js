// We need to sample the height at random (x, z) using the same formula used for vertices
// to place trees on the surface.
export function getHeightAt(x, z, heightCoef) {
    const dist = Math.sqrt(x*x + z*z);
    let y = heightCoef * Math.exp(-dist * dist / 20);
    y += 0.4 * Math.sin(x * 1.5) * Math.cos(z * 1.3);
    y += 0.3 * Math.sin(x * 3.0) * 0.5;
    if (dist > 8) y *= Math.max(0, 1 - (dist-8)/6);
    return Math.max(0.1, y);
}