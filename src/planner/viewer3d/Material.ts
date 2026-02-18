import * as THREE from 'three';
import { TextureManager } from './TextureManager';

interface UnloadedMaterial {
    colorTexture: THREE.Texture;
    normalTexture: THREE.Texture;
    heightTexture: THREE.Texture;
}

export class Material {
    public textures: TextureManager;

    private unloadedMaterials: Map<string, UnloadedMaterial> = new Map();
    private loadedMaterials: Map<string, THREE.Material> = new Map();

    activeWallMaterial: THREE.MeshStandardMaterial | null = null;
    activeFloorMaterial: THREE.MeshStandardMaterial | null = null;
    activeRoofMaterial: THREE.MeshStandardMaterial | null = null;
    activeWindowFrameMaterial: THREE.MeshStandardMaterial | null = null;
    activeDoorFrameMaterial: THREE.MeshStandardMaterial | null = null;
    activeDoorMaterial: THREE.MeshStandardMaterial | null = null;

    constructor(textures: TextureManager) {
        this.textures = textures;
    }

    // -------------------------------------------------------
    // REGISTER MATERIAL TEXTURES
    // -------------------------------------------------------
    registerWallMaterial(id: string) {
        const tex = this.textures.wallTextureLoaded[id];
        if (!tex) return;

        this.unloadedMaterials.set(id, {
            colorTexture: tex.wallCOL,
            normalTexture: tex.wallNRM,
            heightTexture: tex.wallHGT
        });
    }

    registerFloorMaterial(id: string) {
        const tex = this.textures.floorTextureLoaded[id];
        if (!tex) return;

        this.unloadedMaterials.set(id, {
            colorTexture: tex.floorCOL,
            normalTexture: tex.floorNRM,
            heightTexture: tex.floorHGT
        });
    }

    registerRoofMaterial(id: string) {
        const tex = this.textures.roofTextureLoaded[id];
        if (!tex) return;

        this.unloadedMaterials.set(id, {
            colorTexture: tex.roofCOL,
            normalTexture: tex.roofNRM,
            heightTexture: tex.roofHGT
        });
    }

    // ⭐ FIX: use per‑ID window textures
    registerWindowFrameMaterial(id: string) {
        const tex = this.textures.windowTextureLoaded[id];
        if (!tex) return;

        this.unloadedMaterials.set(id, {
            colorTexture: tex.winCOL,
            normalTexture: tex.winNRM,
            heightTexture: tex.winHGT
        });
    }

    // ⭐ FIX: use per‑ID door frame textures
    registerDoorFrameMaterial(id: string) {
        const tex = this.textures.doorFrameTextureLoaded[id];
        if (!tex) return;

        this.unloadedMaterials.set(id, {
            colorTexture: tex.dfCOL,
            normalTexture: tex.dfNRM,
            heightTexture: tex.dfHGT
        });
    }

    // ⭐ FIX: use per‑ID door textures
    registerDoorMaterial(id: string) {
        const tex = this.textures.doorTextureLoaded[id];
        if (!tex) return;

        this.unloadedMaterials.set(id, {
            colorTexture: tex.doorCOL,
            normalTexture: tex.doorNRM,
            heightTexture: tex.doorHGT
        });
    }

    // -------------------------------------------------------
    // INTERNAL: CREATE MATERIAL IF NOT CACHED
    // -------------------------------------------------------
    private loadMaterial(id: string): THREE.Material | null {
        if (this.loadedMaterials.has(id)) {
            return this.loadedMaterials.get(id)!;
        }

        const data = this.unloadedMaterials.get(id);
        if (!data) return null;

        const { colorTexture, normalTexture, heightTexture } = data;

        colorTexture.wrapS = colorTexture.wrapT = THREE.RepeatWrapping;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        heightTexture.wrapS = heightTexture.wrapT = THREE.RepeatWrapping;

        const mat = new THREE.MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture,
            displacementMap: heightTexture,
            displacementScale: 0,

            roughness: this.textures.materialRoughness,
            metalness: this.textures.materialMetalness,
            color: this.textures.materialColor,

            envMap: this.textures.envMap,
            envMapIntensity: 1.0
        });

        this.loadedMaterials.set(id, mat);
        return mat;
    }

    // -------------------------------------------------------
    // PUBLIC API: GET MATERIAL BY ID
    // (with lazy registration for window/door stuff)
    // -------------------------------------------------------
    wallMaterial(id: string): THREE.Material | null {
        let mat = this.loadMaterial(id);
        if (!mat) {
            this.registerWallMaterial(id);
            mat = this.loadMaterial(id);
        }
        if (mat instanceof THREE.MeshStandardMaterial) {
            this.activeWallMaterial = mat;
        }
        return mat;
    }

    floorMaterial(id: string): THREE.Material | null {
        let mat = this.loadMaterial(id);
        if (!mat) {
            this.registerFloorMaterial(id);
            mat = this.loadMaterial(id);
        }
        if (mat instanceof THREE.MeshStandardMaterial) {
            this.activeFloorMaterial = mat;
        }
        return mat;
    }

    roofMaterial(id: string): THREE.Material | null {
        let mat = this.loadMaterial(id);
        if (!mat) {
            this.registerRoofMaterial(id);
            mat = this.loadMaterial(id);
        }
        if (mat instanceof THREE.MeshStandardMaterial) {
            this.activeRoofMaterial = mat;
        }
        return mat;
    }

    windowFrameMaterial(id: string): THREE.Material | null {
        let mat = this.loadMaterial(id);
        if (!mat) {
            this.registerWindowFrameMaterial(id);
            mat = this.loadMaterial(id);
        }
        if (mat instanceof THREE.MeshStandardMaterial) {
            this.activeWindowFrameMaterial = mat;
        }
        return mat;
    }

    doorFrameMaterial(id: string): THREE.Material | null {
        let mat = this.loadMaterial(id);
        if (!mat) {
            this.registerDoorFrameMaterial(id);
            mat = this.loadMaterial(id);
        }
        if (mat instanceof THREE.MeshStandardMaterial) {
            this.activeDoorFrameMaterial = mat;
        }
        return mat;
    }

    doorMaterial(id: string): THREE.Material | null {
        let mat = this.loadMaterial(id);
        if (!mat) {
            this.registerDoorMaterial(id);
            mat = this.loadMaterial(id);
        }
        if (mat instanceof THREE.MeshStandardMaterial) {
            this.activeDoorMaterial = mat;
        }
        return mat;
    }

    // -------------------------------------------------------
    // SPECIAL WINDOW GLASS MATERIAL
    // -------------------------------------------------------
    windowMaterial(
        texture: THREE.Texture,
        normalTexture: THREE.Texture,
        heightTexture: THREE.Texture
    ): THREE.MeshPhysicalMaterial {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.3, 0.3);

        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        normalTexture.repeat.set(0.4, 0.3);

        heightTexture.wrapS = heightTexture.wrapT = THREE.RepeatWrapping;
        heightTexture.repeat.set(0.4, 0.4);

        return new THREE.MeshPhysicalMaterial({
            transmission: 0.95,
            transparent: true,
            opacity: 1.0,

            roughness: 0.05,
            metalness: 0.0,

            clearcoat: 1.0,
            clearcoatRoughness: 0.05,

            color: this.textures.materialColor,

            envMap: this.textures.envMap,
            envMapIntensity: 1.2
        });
    }

    // -------------------------------------------------------
    // LIVE UPDATE METHODS
    // -------------------------------------------------------
    updateWallMaterial() {
        const id = this.textures.wallTextureSelected;
        const tex = this.textures.wallTextureLoaded[id];
        const mat = this.activeWallMaterial;
        if (!mat || !tex) return;

        const oldRepeat = mat.map ? mat.map.repeat.clone() : new THREE.Vector2(1,1);

        mat.map = tex.wallCOL;
        mat.normalMap = tex.wallNRM;
        mat.displacementMap = tex.wallHGT;

        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.copy(oldRepeat);

        mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
        mat.normalMap.repeat.copy(oldRepeat);

        mat.displacementMap.wrapS = mat.displacementMap.wrapT = THREE.RepeatWrapping;
        mat.displacementMap.repeat.copy(oldRepeat);

        mat.roughness = this.textures.materialRoughness;
        mat.metalness = this.textures.materialMetalness;
        mat.color = this.textures.materialColor;

        mat.needsUpdate = true;
    }

    updateFloorMaterial() {
        const id = this.textures.floorTextureSelected;
        const tex = this.textures.floorTextureLoaded[id];
        const mat = this.activeFloorMaterial;
        if (!mat || !tex) return;

        mat.map = tex.floorCOL;
        mat.normalMap = tex.floorNRM;
        mat.displacementMap = tex.floorHGT;

        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.copy(this.textures.floorRepeat);

        mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
        mat.normalMap.repeat.copy(this.textures.floorRepeat);

        mat.displacementMap.wrapS = mat.displacementMap.wrapT = THREE.RepeatWrapping;
        mat.displacementMap.repeat.copy(this.textures.floorRepeat);


        mat.roughness = this.textures.materialRoughness;
        mat.metalness = this.textures.materialMetalness;
        mat.color = this.textures.materialColor;

        mat.needsUpdate = true;
    }

    updateRoofMaterial() {
        const id = this.textures.roofTextureSelected;
        const tex = this.textures.roofTextureLoaded[id];
        const mat = this.activeRoofMaterial;
        if (!mat || !tex) return;

        const oldRepeat = mat.map ? mat.map.repeat.clone() : new THREE.Vector2(1,1);

        mat.map = tex.roofCOL;
        mat.normalMap = tex.roofNRM;
        mat.displacementMap = tex.roofHGT;

        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.copy(oldRepeat);

        mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
        mat.normalMap.repeat.copy(oldRepeat);

        mat.displacementMap.wrapS = mat.displacementMap.wrapT = THREE.RepeatWrapping;
        mat.displacementMap.repeat.copy(oldRepeat);

        mat.roughness = this.textures.materialRoughness;
        mat.metalness = this.textures.materialMetalness;
        mat.color = this.textures.materialColor;

        mat.needsUpdate = true;
    }

    updateWindowFrameMaterial() {
        const id = this.textures.windowTextureSelected;
        const tex = this.textures.windowTextureLoaded[id];
        const mat = this.activeWindowFrameMaterial;
        if (!mat || !tex) return;

        const oldRepeat = mat.map ? mat.map.repeat.clone() : new THREE.Vector2(1,1);

        mat.map = tex.winCOL;
        mat.normalMap = tex.winNRM;
        mat.displacementMap = tex.winHGT;

        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.copy(oldRepeat);

        mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
        mat.normalMap.repeat.copy(oldRepeat);

        mat.displacementMap.wrapS = mat.displacementMap.wrapT = THREE.RepeatWrapping;
        mat.displacementMap.repeat.copy(oldRepeat);

        mat.roughness = this.textures.materialRoughness;
        mat.metalness = this.textures.materialMetalness;
        mat.color = this.textures.materialColor;

        mat.needsUpdate = true;
    }

    updateDoorFrameMaterial() {
        const id = this.textures.doorFrameTextureSelected;
        const tex = this.textures.doorFrameTextureLoaded[id];
        const mat = this.activeDoorFrameMaterial;
        if (!mat || !tex) return;

        const oldRepeat = mat.map ? mat.map.repeat.clone() : new THREE.Vector2(1,1);

        mat.map = tex.dfCOL;
        mat.normalMap = tex.dfNRM;
        mat.displacementMap = tex.dfHGT;

        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.copy(oldRepeat);

        mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
        mat.normalMap.repeat.copy(oldRepeat);

        mat.displacementMap.wrapS = mat.displacementMap.wrapT = THREE.RepeatWrapping;
        mat.displacementMap.repeat.copy(oldRepeat);

        mat.roughness = this.textures.materialRoughness;
        mat.metalness = this.textures.materialMetalness;
        mat.color = this.textures.materialColor;

        mat.needsUpdate = true;
    }

    updateDoorMaterial() {
        const id = this.textures.doorTextureSelected;
        const tex = this.textures.doorTextureLoaded[id];
        const mat = this.activeDoorMaterial;
        if (!mat || !tex) return;

        const oldRepeat = mat.map ? mat.map.repeat.clone() : new THREE.Vector2(1,1);

        mat.map = tex.doorCOL;
        mat.normalMap = tex.doorNRM;
        mat.displacementMap = tex.doorHGT;

        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.copy(oldRepeat);

        mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
        mat.normalMap.repeat.copy(oldRepeat);

        mat.displacementMap.wrapS = mat.displacementMap.wrapT = THREE.RepeatWrapping;
        mat.displacementMap.repeat.copy(oldRepeat);

        mat.roughness = this.textures.materialRoughness;
        mat.metalness = this.textures.materialMetalness;
        mat.color = this.textures.materialColor;

        mat.needsUpdate = true;
    }

    updateAllMaterials() {
        const mats = [
            this.activeWallMaterial,
            this.activeFloorMaterial,
            this.activeRoofMaterial,
            this.activeWindowFrameMaterial,
            this.activeDoorFrameMaterial,
            this.activeDoorMaterial
        ];

        mats.forEach(mat => {
            if (!mat) return;

            mat.roughness = this.textures.materialRoughness;
            mat.metalness = this.textures.materialMetalness;
            mat.color = this.textures.materialColor;

            mat.needsUpdate = true;
        });
    }
}
