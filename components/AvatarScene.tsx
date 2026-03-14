'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const IDLE_GLB = 'https://raw.githubusercontent.com/GHX5T-SOL/incryptX/main/public/avatars/avatar%20movements/idle.glb';

function Model() {
  const group = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const { scene, animations } = useGLTF(IDLE_GLB);

  useEffect(() => {
    if (!animations?.length) return;
    mixer.current = new THREE.AnimationMixer(scene);
    const clip = animations[0];
    const action = mixer.current.clipAction(clip);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
    action.play();
  }, [scene, animations]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={0.9} position={[0, -0.9, 0]} />
    </group>
  );
}

export default function AvatarScene() {
  return (
    <div className="avatar-container">
      <Canvas
        camera={{ position: [0, 0.1, 2.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.5} />
        <pointLight position={[0, 2, 2]} intensity={0.4} color="#00ffff" />
        <Suspense fallback={null}>
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.35}
            maxPolarAngle={Math.PI / 2 + 0.15}
            minPolarAngle={Math.PI / 2 - 0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
