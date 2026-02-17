import * as THREE from 'three';

function getHeightAt(x, z) {
    const dist = Math.sqrt(x*x + z*z);
    let y = 10 * Math.exp(-dist * dist / 20);
    y += 0.4 * Math.sin(x * 1.5) * Math.cos(z * 1.3);
    y += 0.3 * Math.sin(x * 3.0) * 0.5;
    if (dist > 8) y *= Math.max(0, 1 - (dist-8)/6);
    return Math.max(0.1, y);
}

export function findContourPoints(heightTarget = 5, numPoints = 30) {
    const points = [];
    const stepAngle = (Math.PI * 2) / numPoints;
    
    for (let i = 0; i < numPoints; i++) {
        const angle = i * stepAngle;
        
        // Start with a reasonable radius where the mountain height might be around 5
        let radius = 2.0; // Starting guess
        let step = 1.0;
        let minStep = 0.001;
        let maxIterations = 100;
        let iterations = 0;
        
        // Use binary search or gradient descent to find the right radius for this angle
        while (iterations < maxIterations && step > minStep) {
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const currentHeight = getHeightAt(x, z);
            
            if (Math.abs(currentHeight - heightTarget) < 0.01) {
                // Found a point close enough to the target height
                points.push(new THREE.Vector3(x, heightTarget, z));
                break;
            } else if (currentHeight > heightTarget) {
                // Too high, need to go further from center (increase radius)
                radius += step;
            } else {
                // Too low, need to go closer to center (decrease radius)
                radius -= step;
            }
            
            // Reduce step size for more precision as we get closer
            if (Math.abs(currentHeight - heightTarget) < 0.2) {
                step *= 0.8; // Reduce step when we're getting close
            }
            
            iterations++;
        }
        
        // If we couldn't converge, skip this point
        if (points.length <= i) {
            // Try to estimate a reasonable point even if we didn't converge precisely
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const currentHeight = getHeightAt(x, z);
            if (Math.abs(currentHeight - heightTarget) < 0.5) { // Accept if reasonably close
                points.push(new THREE.Vector3(x, heightTarget, z));
            }
        }
    }
    return points;
}
