import * as THREE from 'three';
export class Renderer {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    renderer = new THREE.WebGLRenderer();
    house = new THREE.Group();
    constructor() {
        this.scene.add(this.house);
    }
    setup(fov, width, height, near, far) {
        this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
        this.renderer.setSize(width, height);
        this.house.rotateX(-Math.PI / 2);
    }
    getInfo() {
        return this.renderer.info;
    }
    addObject(obj) {
        this.house.add(obj);
    }
    removeObject(obj) {
        this.house.remove(obj);
    }
    clear() {
        this.house.clear();
    }
    getRenderer() {
        return this.renderer;
    }
    getCamera() {
        return this.camera;
    }
}
