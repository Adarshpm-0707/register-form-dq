// ─────────────────────────────────────────────────────
//  components/Mascot3D.jsx
//  Interactive 3D Robot Mascot - Fully Responsive
// ─────────────────────────────────────────────────────

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb";

// ──────────────────────────────────────────────────────────
// CameraController - Handles true 3D responsiveness
// ──────────────────────────────────────────────────────────
function CameraController() {
  const { viewport } = useThree();

  useFrame((state) => {
    const viewportWidth = state.viewport.width;
    
    // Narrow screens (mobile)
    const minViewportWidth = 3.5; 
    // Wide screens (desktop)
    const maxViewportWidth = 10; 
    
    // Target camera distances
    const mobileZ = 12;  
    const desktopZ = 7; 

    const t = (viewportWidth - minViewportWidth) / (maxViewportWidth - minViewportWidth);
    const clampedT = Math.max(0, Math.min(1, t)); 

    const targetZ = THREE.MathUtils.lerp(mobileZ, desktopZ, clampedT);
    
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
  });

  return null; 
}

// ──────────────────────────────────────────────────────────
// Model Component - Handles the 3D asset and interactions
// ──────────────────────────────────────────────────────────
function Model({ ...props }) {
  const group = useRef();
  const gltf = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(gltf.animations, group);

  useEffect(() => {
    const animationName = names.includes("Dance") ? "Dance" : names[0];
    if (actions[animationName]) {
      actions[animationName].reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  useFrame((state) => {
    if (group.current) {
      const targetRotationX = (state.mouse.y * Math.PI) / 12;
      const targetRotationY = (state.mouse.x * Math.PI) / 8;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// ──────────────────────────────────────────────────────────
// Main Mascot3D Component
// ──────────────────────────────────────────────────────────
function Mascot3D() {
  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] relative cursor-grab active:cursor-grabbing group">
      <Canvas
        shadows
        camera={{ position: [0, 2, 7], fov: 40 }} 
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={1} color="#22d3ee" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <CameraController />

          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Model position={[0, -1.8, 0]} />
          </Float>
          
          <ContactShadows position={[0, -1.9, 0]} opacity={0.6} scale={12} blur={2.5} far={5} />
        </Suspense>

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);

export default Mascot3D;