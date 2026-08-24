import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Grid() {
  return (
    <gridHelper 
      args={[100, 20, "#c6ff34", "#1e1e3f"]} 
      position={[0, -10, 0]} 
      rotation={[0, 0, 0]} 
      onBeforeCompile={(shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          `gl_FragColor = vec4( color, opacity );`,
          `gl_FragColor = vec4( color, opacity * 0.1 );`
        );
      }}
    />
  );
}

function Nodes({ count = 20 }) {
  const group = useRef();
  const nodes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40
      ],
      speed: Math.random() * 0.15 + 0.05,
      size: Math.random() * 1.5 + 0.5
    }));
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current && group.current.children) {
      group.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time * nodes[i].speed) * 0.005;
        child.rotation.x += 0.005;
        child.rotation.y += 0.005;
      });
    }
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <octahedronGeometry args={[node.size, 0]} />
          <meshBasicMaterial color="#c6ff34" wireframe transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function Particles({ count = 4000 }) {
  const points = useRef();
  const scrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollPos.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 100;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 100;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0003;
      const targetRotationY = scrollPos.current * Math.PI * 0.3;
      const targetZ = scrollPos.current * 20;
      
      points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, targetRotationY, 0.05);
      points.current.position.z = THREE.MathUtils.lerp(points.current.position.z, targetZ, 0.05);
      
      const time = state.clock.getElapsedTime();
      points.current.position.y = Math.sin(time * 0.05) * 0.2;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#c6ff34"
        transparent
        opacity={0.15}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050521] overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }} gl={{ powerPreference: "high-performance", antialias: false }}>
        <color attach="background" args={["#050521"]} />
        <fog attach="fog" args={["#050521", 20, 50]} />
        <ambientLight intensity={0.3} />
        <Grid />
        <Nodes count={20} />
        <Particles count={4000} />
      </Canvas>
      {/* HUD Scanline & Grain */}
      <div className="background-noise absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050521] via-transparent to-[#050521] opacity-70 pointer-events-none" />
    </div>
  );
}

export default React.memo(Background3D);
