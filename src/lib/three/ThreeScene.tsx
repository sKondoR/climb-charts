'use client';

import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ThreeSceneProps {
  children: React.ReactNode;
  height?: number;
  width?: number;
  backgroundColor?: string;
  enableControls?: boolean;
}

function Scene({ children, height = 600, width = 800, backgroundColor = '#1a1a2e', enableControls = false }: ThreeSceneProps) {
  const { size } = useThree();
  
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }
  }, [size]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      {children}
      {enableControls && <OrbitControls />}
    </Canvas>
  );
}

export function ThreeScene({ children, height, width, backgroundColor, enableControls }: ThreeSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Scene height={height} width={width} backgroundColor={backgroundColor} enableControls={enableControls}>
        {children}
      </Scene>
    </div>
  );
}
