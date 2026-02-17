import * as THREE from 'three';

export function createLighting(scene) {
    // --- Lighting ---
    // Ambient base
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    // Main directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    sunLight.position.set(5, 15, 10);
    sunLight.castShadow = true;
    sunLight.receiveShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    const d = 20;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 30;
    scene.add(sunLight);

    // Fill light from opposite side
    const fillLight = new THREE.DirectionalLight(0xcce0ff, 0.5);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Slight backlight
    const backLight = new THREE.DirectionalLight(0xffeedd, 0.3);
    backLight.position.set(-2, 3, -10);
    scene.add(backLight);
}