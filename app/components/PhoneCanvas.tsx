"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, MeshTransmissionMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function PhoneMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2 - 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05 + 0.05;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <group ref={meshRef}>
      {/* Phone body */}
      <RoundedBox args={[1.4, 2.8, 0.12]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#0D1B30" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Screen */}
      <RoundedBox args={[1.2, 2.4, 0.01]} radius={0.08} smoothness={4} position={[0, 0, 0.07]}>
        <meshStandardMaterial color="#1A56DB" emissive="#1A56DB" emissiveIntensity={0.3} />
      </RoundedBox>
      {/* Balance card on screen */}
      <RoundedBox args={[1.0, 0.6, 0.01]} radius={0.05} position={[0, 0.6, 0.08]}>
        <meshStandardMaterial color="#0D2F6E" emissive="#1A56DB" emissiveIntensity={0.5} />
      </RoundedBox>
      {/* Gold accent bar */}
      <RoundedBox args={[1.0, 0.06, 0.01]} radius={0.03} position={[0, 0.28, 0.08]}>
        <meshStandardMaterial color="#D4A017" emissive="#D4A017" emissiveIntensity={0.8} />
      </RoundedBox>
      {/* Action buttons row */}
      {[-0.36, -0.12, 0.12, 0.36].map((x, i) => (
        <RoundedBox key={i} args={[0.18, 0.18, 0.01]} radius={0.04} position={[x, -0.1, 0.08]}>
          <meshStandardMaterial color="#122040" emissive="#1A56DB" emissiveIntensity={0.3} />
        </RoundedBox>
      ))}
      {/* Transaction lines */}
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} args={[0.9, 0.06, 0.01]} radius={0.03} position={[0, -0.5 - i * 0.18, 0.08]}>
          <meshStandardMaterial color="#1E3A5F" />
        </RoundedBox>
      ))}
      {/* Notch */}
      <RoundedBox args={[0.3, 0.06, 0.02]} radius={0.03} position={[0, 1.32, 0.07]}>
        <meshStandardMaterial color="#060D1A" />
      </RoundedBox>
    </group>
  );
}

function FloatingParticles() {
  const count = 60;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#4D7FE8" transparent opacity={0.6} />
    </points>
  );
}

export default function PhoneCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ height: "100%", width: "100%" }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#1A56DB" />
      <pointLight position={[-3, -2, 2]} intensity={1} color="#D4A017" />
      <Stars radius={30} depth={10} count={300} factor={2} fade speed={0.5} />
      <FloatingParticles />
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <PhoneMesh />
      </Float>
    </Canvas>
  );
}
