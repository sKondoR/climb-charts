import * as THREE from 'three';

export function createMountain(scene, heightCoef) {
    // --- Create the mountain terrain (displaced plane) ---
    // Geometry with enough segments for detail
    const width = 24;
    const depth = 24;
    const segments = 64; // 64x64 grid gives smooth hills
    const geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Lay flat (Y up)

    // Access position attribute
    const positionAttribute = geometry.attributes.position;
    const vertex = new THREE.Vector3();

    // Define mountain shape function: central peak with roughness
    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.x = positionAttribute.getX(i);
        vertex.z = positionAttribute.getY(i); // Because we rotated, original Y is now Z? Wait careful:
        // After rotateX(-PI/2), the original Y (0) becomes -Z? Let's reason:
        // Original PlaneGeometry has vertices (x, y, z) with y=0, z = depth coordinate.
        // After rotation around X by -90 degrees, the original Y (0) goes to -Z, and original Z goes to Y.
        // But simpler: we want to use the flat coordinates in the plane's local space.
        // We'll just work in the rotated space: local X and Z are the horizontal axes, Y is up.
        // After rotation, the positions are such that:
        // - x remains x
        // - y is now -original_z (but original_z ranged from -depth/2 to depth/2)
        // - z is now original_y (which was 0)
        // So to get the horizontal coordinates, we need (x, -y) ? This is messy.
        // Better: don't rotate the geometry; instead modify vertices in place and then rotate.
        // Let's do simpler: create geometry without pre-rotation, modify heights in Y direction, then rotate.
        // I'll recreate geometry without rotation, modify Y, then rotate the whole mesh.
    }

    // Simpler: Re-do from scratch without pre-rotate, we'll rotate the mesh after modification.
    // Let's clear and create new geometry correctly.
    
    // I'll start over for clarity inside this block, but since we're in a script, I'll redefine.
    // Remove the previous geometry and start fresh.
    
    // -- Fresh start for terrain --
    const terrainGeo = new THREE.PlaneGeometry(22, 22, 70, 70);
    const posAttr = terrainGeo.attributes.position;
    const center = new THREE.Vector2(0, 0);
    
    // Height function: central peak with some noise and a secondary peak
    for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getY(i); // PlaneGeometry has y=0, and z is in Y attribute? Actually PlaneGeometry has (x, y, 0) with y being the other dimension. Let's check: standard PlaneGeometry gives vertices (x, y, 0) where x in [-w/2, w/2], y in [-h/2, h/2]. So to get 2D coordinates, we use x and y.
        // We'll treat x and y (which is actually the second coordinate) as the ground plane. Then we set the real Z as height? But we want Y up. So we need to map: (x, y) -> height in Y, and set Z = original y? No, better: we'll construct a custom geometry where we set (x, height, z) directly.
        // This is getting too twisted. I'll instead create a grid manually via BufferGeometry to have full control.
        // But for simplicity and clarity, let's use a ConeGeometry for the mountain and add trees around? That might not look like a natural mountain.
        // I'll stick to the manual grid approach to ensure correct axis orientation.
    }

    // Let's build a custom grid geometry from scratch to avoid confusion.
    const gridSize = 43;
    const spacing = 0.4;
    const w = (gridSize - 1) * spacing;
    const h = (gridSize - 1) * spacing;
    const vertices = [];
    const normals = [];
    const indices = [];

    // Generate vertices
    for (let i = 0; i < gridSize; i++) {
        const x = (i - (gridSize-1)/2) * spacing;
        for (let j = 0; j < gridSize; j++) {
            const z = (j - (gridSize-1)/2) * spacing;
            // Calculate distance from center
            const dist = Math.sqrt(x*x + z*z);
            // Base mountain shape: exponential peak with some sine-wave rocks
            let y = heightCoef * Math.exp(-dist * dist / 20); // main peak
            // Add some ruggedness / smaller hills
            y += 0.4 * Math.sin(x * 1.5) * Math.cos(z * 1.3);
            y += 0.3 * Math.sin(x * 3.0) * 0.5;
            // Flatten near edges slightly
            if (dist > 8) y *= Math.max(0, 1 - (dist-8)/6);
            // Ensure minimum near zero
            y = Math.max(0, y);
            
            vertices.push(x, y, z);
            
            // Placeholder normals (will recompute later)
            normals.push(0, 1, 0);
        }
    }

    // Generate indices for two triangles per grid cell
    for (let i = 0; i < gridSize - 1; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
            const a = i * gridSize + j;
            const b = i * gridSize + j + 1;
            const c = (i + 1) * gridSize + j;
            const d = (i + 1) * gridSize + j + 1;

            // Two triangles: a-b-c and b-d-c
            indices.push(a, b, c);
            indices.push(b, d, c);
        }
    }

    const mountainGeo = new THREE.BufferGeometry();
    mountainGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    mountainGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    mountainGeo.setIndex(indices);
    
    // Compute normals for proper lighting
    mountainGeo.computeVertexNormals();

    // Material with a natural rock/grass color, and a bit of variation based on height would be nice,
    // but we'll keep it simple with a phong material and a single color.
    const mountainMat = new THREE.MeshPhongMaterial({
        color: 0x888c8d,
        emissive: 0x000000,
        shininess: 10,
        flatShading: false,
        side: THREE.DoubleSide // to see underside if camera goes low, but not necessary
    });

    const mountain = new THREE.Mesh(mountainGeo, mountainMat);
    mountain.castShadow = true;
    mountain.receiveShadow = true;
    mountain.position.y = 0;
    scene.add(mountain);
}