import * as THREE from 'three';

export function createSnowCap(scene) {
    // --- Add a small snow cap on the peak (just for visual interest) ---
    const snowGeo = new THREE.SphereGeometry(0.9, 10, 10);
    const snowMat = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x335566 });
    const snowCap = new THREE.Mesh(snowGeo, snowMat);
    snowCap.position.set(0, 9.2, 0);
    snowCap.castShadow = true;
    snowCap.receiveShadow = true;
    scene.add(snowCap);
}