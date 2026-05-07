import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb";

// ──────────────────────────────────────────────────────────
// CameraController - Handles true 3D responsiveness
// ──────────────────────────────────────────────────────────
function CameraController() {
  useFrame((state) => {
    const viewportWidth = state.viewport.width;
    
    // Scale based on viewport width
    const minWidth = 3; 
    const maxWidth = 12; 
    
    // Adjusted for side-by-side laptop layout
    const mobileZ = 13.5;  
    const desktopZ = 9; 

    const t = (viewportWidth - minWidth) / (maxWidth - minWidth);
    const clampedT = Math.max(0, Math.min(1, t)); 

    const targetZ = THREE.MathUtils.lerp(mobileZ, desktopZ, clampedT);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.2, 0.05);
  });
  return null; 
}

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
      const targetRotationY = (state.mouse.x * Math.PI) / 6;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function Mascot3D() {
  return (
    <div className="w-full h-full min-h-[350px] sm:min-h-[450px] lg:min-h-[600px] relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 12], fov: 40 }} 
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#22d3ee" />
        <pointLight position={[0, 2, -2]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <CameraController />

          <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
            <Model position={[0, -1.2, 0]} />
          </Float>

          <ContactShadows 
            position={[0, -1.24, 0]} 
            opacity={0.7} 
            scale={12} 
            blur={2.4} 
            far={4} 
            resolution={256} 
            color="#000000"
          />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.8} 
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);

export default Mascot3D;