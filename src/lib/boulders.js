import * as THREE from 'three';

export function createBoulders(heightCoef, getHeightAt, scene) {
    // --- Add some rocks / small boulders for detail (optional) ---
    const rockMat = new THREE.MeshPhongMaterial({ color: 0x888c8d, emissive: 0x111111 });
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = getHeightAt(x, z, heightCoef);
        if (y < 0.5 || y > 2.8) continue;
        
        const rockGeo = new THREE.DodecahedronGeometry(0.2 + Math.random()*0.3);
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(x, y, z);
        rock.castShadow = true;
        rock.receiveShadow = true;
        rock.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        scene.add(rock);
    }
}