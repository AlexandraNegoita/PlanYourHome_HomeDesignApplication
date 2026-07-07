import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { furnitureAssets } from '../../../pages/generated-assets';
import { Utils } from '../Utils';
export class Furniture {
    cache = new Map();
    utils = new Utils();
    async buildFurniture(typeID) {
        const config = furnitureAssets[typeID];
        if (!config) {
            console.error(`Furniture type ${typeID} not found in 3D catalog.`);
            return null;
        }
        if (this.cache.has(typeID)) {
            return this.cache.get(typeID).clone();
        }
        return new Promise((resolve, reject) => {
            const mtlLoader = new MTLLoader();
            const mtlPath = config.mtl.substring(0, config.mtl.lastIndexOf('/') + 1);
            const mtlFile = config.mtl.substring(config.mtl.lastIndexOf('/') + 1);
            mtlLoader.setPath(mtlPath);
            mtlLoader.load(mtlFile, (materials) => {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                const objPath = config.obj.substring(0, config.obj.lastIndexOf('/') + 1);
                const objFile = config.obj.substring(config.obj.lastIndexOf('/') + 1);
                objLoader.setPath(objPath);
                objLoader.load(objFile, (object) => {
                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh && child.material) {
                            const oldMats = Array.isArray(child.material) ? child.material : [child.material];
                            const newMats = oldMats.map(oldMat => {
                                let matColor = new THREE.Color(0xcccccc);
                                if (oldMat.color) {
                                    matColor.copy(oldMat.color);
                                    matColor.convertLinearToSRGB();
                                    const hsl = { h: 0, s: 0, l: 0 };
                                    matColor.getHSL(hsl);
                                    const newLightness = Math.min(1.0, hsl.l * 1.4);
                                    const newSaturation = Math.min(1.0, hsl.s * 1.2);
                                    matColor.setHSL(hsl.h, newSaturation, newLightness);
                                }
                                return new THREE.MeshPhysicalMaterial({
                                    color: matColor,
                                    roughness: 0.85,
                                    metalness: 0.0,
                                    clearcoat: 0.5,
                                    sheen: 0.6,
                                    sheenColor: new THREE.Color(0xffffff),
                                    side: THREE.DoubleSide
                                });
                            });
                            child.material = newMats.length === 1 ? newMats[0] : newMats;
                        }
                    });
                    const worldRatioMultiplier = this.utils.calculateRatio(1);
                    object.scale.setScalar(worldRatioMultiplier * config.scale);
                    const box = new THREE.Box3().setFromObject(object);
                    const center = box.getCenter(new THREE.Vector3());
                    object.position.sub(center);
                    object.position.y = 0;
                    const group = new THREE.Group();
                    group.add(object);
                    this.cache.set(typeID, group);
                    resolve(group.clone());
                }, undefined, reject);
            }, undefined, reject);
        });
    }
}
