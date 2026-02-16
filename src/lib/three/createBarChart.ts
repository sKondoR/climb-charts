import * as THREE from 'three';

import type { BarData } from '../../types/chart';

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

  // Create renderer before creating DOM element
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';

  const barWidth = (width / data.length) * 0.6;
  const spacing = (width / data.length) * 0.4;
  const maxValue = Math.max(...data.map((d) => d.value));

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * (height * 0.8);
    const x = (index * (barWidth + spacing)) - (width / 2) + (barWidth / 2);

    // Create bar geometry
    const geometry = new THREE.BoxGeometry(barWidth, barHeight, 1);
    // Convert hex color from #RRGGBB to Three.js format 0xRRGGBB
    const color = new THREE.Color(item.color);
    const material = new THREE.MeshBasicMaterial({
      color: color,
    });

    const bar = new THREE.Mesh(geometry, material);
    bar.position.set(x, -barHeight / 2, 0);

    // Add text label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return { domElement: document.createElement('div'), scene: group };

    canvas.width = 256;
    canvas.height = 128;
    context.fillStyle = '#ffffff';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.fillText(item.label, 128, 64);
    context.font = 'bold 36px Arial';
    context.fillText(item.value.toString(), 128, 110);

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
    renderer.render(group, camera);
  }
  animate();

  return { domElement, scene: group };
}
