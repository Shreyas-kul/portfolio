import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const points = useRef();

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.04;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    }
  });

  const particleCount = 2500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

    const r = Math.random();
    const color = new THREE.Color(r > 0.7 ? '#a78bfa' : r > 0.3 ? '#22d3ee' : '#ffffff');
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} vertexColors transparent opacity={0.35} sizeAttenuation />
    </points>
  );
};

const Background = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-[#020204]">
    {/* Ambient gradient orbs */}
    <div className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-cyan-600/[0.07] blur-[150px] animate-float-slow" />
    <div className="absolute bottom-[-25%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-violet-600/[0.06] blur-[150px] animate-float-delayed" />
    <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-600/[0.04] blur-[120px] animate-float" />

    {/* Three.js particle field */}
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ParticleField />
    </Canvas>

    {/* Noise texture overlay */}
    <div className="noise-overlay" />
  </div>
);

export default Background;
