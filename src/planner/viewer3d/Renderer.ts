import * as THREE from 'three';

export class Renderer {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  renderer = new THREE.WebGLRenderer();
  house = new THREE.Group(); 

  constructor() {
    this.scene.add(this.house);
  }

  setup(fov: number, width: number, height: number, near: number, far: number) {
    this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
    this.renderer.setSize(width, height);
    this.house.rotateX(-Math.PI / 2);

  }

  addObject(obj: THREE.Object3D) {
    this.house.add(obj);
  }

  removeObject(obj: THREE.Object3D) {
    this.house.remove(obj);
  }

  clear() {
    this.house.clear();
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
