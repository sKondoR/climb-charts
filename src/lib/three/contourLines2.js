import * as THREE from 'three';

export function createContourLine(contourPoints, scene) {
    if (contourPoints.length > 2) {
        // Create a closed line through the contour points (polyline approach)
        const linePoints = [...contourPoints];
        linePoints.push(contourPoints[0]); // Close the loop by connecting back to the first point
        
        // Create geometry for the spline
        const splineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        
        // Create material for the spline
        const splineMaterial = new THREE.LineBasicMaterial({
            color: 0xffaa00, // Orange color to stand out
            linewidth: 3
        });
        
        // Create the line object
        const splineLine = new THREE.Line(splineGeometry, splineMaterial);
        scene.add(splineLine);
    }
}