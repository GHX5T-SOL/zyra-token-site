'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const GLB_URL = 'https://raw.githubusercontent.com/GHX5T-SOL/incryptX/main/public/avatars/incrypt_ai_avatar.glb';

function Model() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(GLB_URL);
  return (
    <group ref={group}>
      <primitive object={scene} scale={1.2} position={[0, -0.5, 0]} />
    </group>
  );
}

export default function AvatarScene() {
  return (
    <div className="avatar-container">
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} />
        <directionalLight position={[-2, 2, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.4}
            maxPolarAngle={Math.PI / 2 + 0.2}
            minPolarAngle={Math.PI / 2 - 0.4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
