import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function SoilCylinder({ moisture }) {
  const meshRef = useRef();
  const waterRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const waterHeight = (moisture / 100) * 3;
  const waterColor = moisture < 30 ? '#ef4444' : moisture < 60 ? '#f59e0b' : '#10b981';

  return (
    <group>
      {/* Soil Container */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 3, 32]} />
        <meshStandardMaterial 
          color="#8b4513" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Water Level */}
      <mesh ref={waterRef} position={[0, -1.5 + waterHeight / 2, 0]}>
        <cylinderGeometry args={[1.4, 1.4, waterHeight, 32]} />
        <meshStandardMaterial 
          color={waterColor} 
          transparent 
          opacity={0.6}
          emissive={waterColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Moisture Percentage Text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {moisture.toFixed(1)}%
      </Text>

      {/* Particles for visual effect */}
      {[...Array(20)].map((_, i) => (
        <Sphere
          key={i}
          position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ]}
          args={[0.05, 8, 8]}
        >
          <meshStandardMaterial 
            color={waterColor} 
            emissive={waterColor}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
    </group>
  );
}

function SoilVisualization3D({ soilMoisture }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <SoilCylinder moisture={soilMoisture} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={3}
          maxDistance={10}
        />
        <gridHelper args={[10, 10, '#666', '#444']} />
      </Canvas>
    </div>
  );
}

export default SoilVisualization3D;
