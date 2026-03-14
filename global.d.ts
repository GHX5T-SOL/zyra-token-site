import type { Object3DNode } from '@react-three/fiber';
import type { AmbientLight, DirectionalLight } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
      directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>;
    }
  }
}

export {};
