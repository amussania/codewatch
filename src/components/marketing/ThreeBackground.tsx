"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 80;
const CONNECT_DIST = 2.6;

function ParticleMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  /* Fixed geometry — computed once */
  const { nodePositions, nodeColors } = useMemo(() => {
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);
    const coral = new THREE.Color("#00b85f");
    const blue = new THREE.Color("#1a7be8");

    for (let i = 0; i < NODE_COUNT; i++) {
      nodePositions[i * 3]     = (Math.random() - 0.5) * 11;
      nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      const c = Math.random() > 0.5 ? coral : blue;
      nodeColors[i * 3]     = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }
    return { nodePositions, nodeColors };
  }, []);

  const linePositions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodePositions[i * 3]     - nodePositions[j * 3];
        const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
        const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < CONNECT_DIST * CONNECT_DIST) {
          pts.push(
            nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2],
            nodePositions[j * 3], nodePositions[j * 3 + 1], nodePositions[j * 3 + 2],
          );
        }
      }
    }
    return new Float32Array(pts);
  }, [nodePositions]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width  - 0.5) * 2;
      mouse.current.y = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    /* Lerp smoothMouse toward raw mouse — creates the lagging drift feel */
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.025;
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.025;

    groupRef.current.rotation.y = t * 0.035 + smoothMouse.current.x * 0.28;
    groupRef.current.rotation.x = Math.sin(t * 0.022) * 0.07 - smoothMouse.current.y * 0.18;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[nodeColors,    3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#1a7be8" transparent opacity={0.13} />
      </lineSegments>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ParticleMesh />
      </Canvas>
    </div>
  );
}
