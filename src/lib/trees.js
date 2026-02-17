import * as THREE from 'three';

export function createTrees(heightCoef, getHeightAt, scene) {
    // --- Helper function to create a simple tree ---
    function createTree(posX, posY, posZ, scale = 1) {
        const group = new THREE.Group();
        
        // Trunk (brown cylinder)
        const trunkGeo = new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 1.2 * scale, 6);
        const trunkMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.6 * scale; // half height
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        group.add(trunk);

        // Foliage (green cones) - multiple layers for fuller look
        const foliageMat = new THREE.MeshPhongMaterial({ color: 0x2e7d32 });
        
        // Bottom foliage
        const foliage1 = new THREE.ConeGeometry(0.7 * scale, 0.9 * scale, 8);
        const mesh1 = new THREE.Mesh(foliage1, foliageMat);
        mesh1.position.y = 1.2 * scale + 0.45 * scale;
        mesh1.castShadow = true;
        mesh1.receiveShadow = true;
        group.add(mesh1);
        
        // Top foliage
        const foliage2 = new THREE.ConeGeometry(0.5 * scale, 0.8 * scale, 6);
        const mesh2 = new THREE.Mesh(foliage2, foliageMat);
        mesh2.position.y = 1.9 * scale + 0.4 * scale;
        mesh2.castShadow = true;
        mesh2.receiveShadow = true;
        group.add(mesh2);

        group.position.set(posX, posY, posZ);
        return group;
    }

    // --- Scatter trees on the mountain ---
    const treeCount = 120;
    for (let i = 0; i < treeCount; i++) {
        // Random position within the mountain radius
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 6; // between 3 and 9
        const x = Math.cos(angle) * radius * (0.8 + 0.4 * Math.random());
        const z = Math.sin(angle) * radius * (0.8 + 0.4 * Math.random());
        
        const groundY = getHeightAt(x, z, heightCoef);
        
        // Avoid placing trees in very low areas or too high on peak
        if (groundY < 0.4 || groundY > 3.2) continue;
        
        // Random scale for variety
        const scale = Math.random() * 0.4;
        
        const tree = createTree(x, groundY, z, scale);
        
        // Slight random rotation around Y
        tree.rotation.y = Math.random() * Math.PI * 2;
        
        scene.add(tree);
    }

    // Add a few trees on the lower外围
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 9 + Math.random() * 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const groundY = getHeightAt(x, z, heightCoef);
        if (groundY < 0.3) continue;
        const tree = createTree(x, groundY, z, 0.5 + Math.random()*0.5);
        tree.rotation.y = Math.random() * Math.PI * 2;
        scene.add(tree);
    }
}