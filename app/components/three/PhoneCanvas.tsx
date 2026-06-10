"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function PhoneMesh() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.18 - 0.15;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.25) * 0.04 + 0.04;
  });

  return (
    <group ref={group}>
      {/* Body */}
      <RoundedBox args={[1.5, 3.0, 0.13]} radius={0.13} smoothness={4}>
        <meshStandardMaterial color="#0D1B30" metalness={0.9} roughness={0.15} />
      </RoundedBox>
      {/* Screen */}
      <RoundedBox args={[1.3, 2.6, 0.01]} radius={0.09} smoothness={4} position={[0, 0, 0.075]}>
        <meshStandardMaterial color="#060D1A" />
      </RoundedBox>
      {/* Balance card */}
      <RoundedBox args={[1.1, 0.65, 0.012]} radius={0.06} position={[0, 0.65, 0.082]}>
        <meshStandardMaterial color="#0D2F6E" emissive="#1A56DB" emissiveIntensity={0.4} />
      </RoundedBox>
      {/* Gold bar */}
      <RoundedBox args={[1.1, 0.055, 0.012]} radius={0.025} position={[0, 0.31, 0.082]}>
        <meshStandardMaterial color="#D4A017" emissive="#D4A017" emissiveIntensity={0.9} />
      </RoundedBox>
      {/* Quick action buttons */}
      {[-0.39, -0.13, 0.13, 0.39].map((x, i) => (
        <RoundedBox key={i} args={[0.2, 0.2, 0.01]} radius={0.05} position={[x, -0.08, 0.082]}>
          <meshStandardMaterial color="#122040" emissive="#1A56DB" emissiveIntensity={0.25} />
        </RoundedBox>
      ))}
      {/* Transaction rows */}
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} args={[0.95, 0.065, 0.01]} radius={0.03} position={[0, -0.52 - i * 0.19, 0.082]}>
          <meshStandardMaterial color="#1E3A5F" />
        </RoundedBox>
      ))}
      {/* Notch */}
      <RoundedBox args={[0.32, 0.065, 0.02]} radius={0.03} position={[0, 1.41, 0.075]}>
        <meshStandardMaterial color="#060D1A" />
      </RoundedBox>
    </group>
  );
}

function Particles() {
  const count = 50;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#4D7FE8" transparent opacity={0.5} />
    </points>
  );
}

export default function PhoneCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }} style={{ height: "100%", width: "100%" }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={2.5} color="#1A56DB" />
      <pointLight position={[-3, -2, 3]} intensity={1.2} color="#D4A017" />
      <pointLight position={[0, -4, 2]} intensity={0.8} color="#0D2F6E" />
      <Stars radius={35} depth={12} count={200} factor={2} fade speed={0.4} />
      <Particles />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.4}>
        <PhoneMesh />
      </Float>
    </Canvas>
  );
}
