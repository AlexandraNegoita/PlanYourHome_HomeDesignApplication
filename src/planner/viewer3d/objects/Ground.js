import * as THREE from 'three';
export class Ground {
    buildGround(board, textures) {
        const GROUND_SIZE = 1000;
        const TEXTURE_REPEAT = 150;
        textures.groundTextureLoaded.groundCOL.wrapS = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundCOL.wrapT = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundCOL.repeat.set(TEXTURE_REPEAT, TEXTURE_REPEAT);
        textures.groundTextureLoaded.groundNRM.wrapS = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundNRM.wrapT = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundNRM.repeat.set(TEXTURE_REPEAT, TEXTURE_REPEAT);
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE), new THREE.MeshPhongMaterial({
            map: textures.groundTextureLoaded.groundCOL,
            normalMap: textures.groundTextureLoaded.groundNRM,
            envMap: textures.envMap
        }));
        ground.rotateX(-Math.PI / 2);
        ground.translateX(-0.5);
        ground.translateY(-0.5);
        return ground;
    }
}
