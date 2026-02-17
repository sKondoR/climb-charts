import * as THREE from 'three';

export function createContourLine(contourPoints, scene) {
    if (contourPoints.length > 2) {
        // Close the loop by connecting back to the first point
        const closedPoints = [...contourPoints, contourPoints[0]];
        
        // Convert to Vector3 points
        const points = closedPoints.map(p => new THREE.Vector3(p.x, p.y, p.z));
        
        // Create a smooth curve (spline) with more segments and better tension
        const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1);
        
        // Create a tube geometry with circular cross-section - increased smoothness
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            128,   // tubular segments (doubled for smoother path)
            0.05,  // radius of the tube
            16,    // radial segments (doubled for smoother circle)
            false  // closed (we already close the path)
        );
        
        // Create material for the tube
        const tubeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00, // Orange color
            side: THREE.DoubleSide
        });
        
        // Create the mesh and add to scene
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
        scene.add(tubeMesh);
    }
}