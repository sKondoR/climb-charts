import * as THREE from 'three';

import type { BarData } from '../../types/chart';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export interface ChartResult {
  domElement: HTMLElement;
  scene: THREE.Group;
}

export function createBarChart(
  data: BarData[],
  width: number,
  height: number
): ChartResult {
  const group = new THREE.Group();

  // Create renderer with shadows enabled
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const barWidth = 1;
  const spacing = 1;
  const heightCoef = 0.3;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(15, 10, 20);
  camera.lookAt(0, 0, 0);

    // --- Controls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 5, 0);

  // A subtle ground plane to catch shadows (semi-transparent)
  const planeGeometry = new THREE.CircleGeometry(15, 32);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a4a, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  group.add(plane);

  data.forEach((item, index) => {
    const barHeight = item.value * heightCoef;
    const x = index * barWidth + spacing;

    // Create bar geometry
    const geometry = new THREE.BoxGeometry(barWidth, barHeight, barWidth);

    // Convert hex color from #RRGGBB to Three.js format 0xRRGGBB
    const color = new THREE.Color(item.color);
    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: 0x000000,
        roughness: 0.3,
        metalness: 0.1
    });

    const bar = new THREE.Mesh(geometry, material);
    bar.position.set(x, barHeight / 2, 0);
    bar.castShadow = true;
    bar.receiveShadow = true;

    // Add text label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return { domElement: document.createElement('div'), scene: group };

    canvas.width = 256;
    canvas.height = 128;
    context.fillStyle = '#ffffff';
    context.font = 'bold 60px Arial';
    context.textAlign = 'center';
    context.fillText(`${item.label} (${item.value})`, 128, 64);
    // context.font = 'bold 36px Arial';
    // context.fillText(item.value.toString(), 128, 110);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const label = new THREE.Sprite(labelMaterial);
    label.position.set(x, barHeight + 1.5, 0);
    label.scale.set(2, 1, 1);

    group.add(bar);
    group.add(label);
  });

  const domElement = document.createElement('div');
  domElement.style.width = `${width}px`;
  domElement.style.height = `${height}px`;
  domElement.style.position = 'relative';
  domElement.style.overflow = 'hidden';

  // Add renderer to DOM
  domElement.appendChild(renderer.domElement);
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(group, camera);
  }
  animate();

  // Ambient light to soften shadows
  const ambientLight = new THREE.AmbientLight(0x404060);
  group.add(ambientLight);

  // Main directional light (like the sun)
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 20, 5);
  dirLight.castShadow = true;
  dirLight.receiveShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  const d = 20;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 30;
  group.add(dirLight);

  // Fill light from the opposite side
  const fillLight = new THREE.DirectionalLight(0xffcc88, 0.5);
  fillLight.position.set(-10, 5, -10);
  group.add(fillLight);

  return { domElement, scene: group };
}
