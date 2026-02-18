import * as THREE from 'three';
import { Board } from '../../viewer2d/Board';
import { TextureManager } from '../TextureManager';

export class Ground {
    buildGround(board: Board, textures: TextureManager) : THREE.Object3D {
        textures.groundTextureLoaded.groundCOL.wrapS = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundCOL.wrapT = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundCOL.repeat.set( 70, 70 );

        textures.groundTextureLoaded.groundNRM.wrapS = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundNRM.wrapT = THREE.RepeatWrapping;
        textures.groundTextureLoaded.groundNRM.repeat.set( 70, 70 );
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(board.points.length, board.points.length), new THREE.MeshPhongMaterial(
            { 
                map: textures.groundTextureLoaded.groundCOL,
                normalMap: textures.groundTextureLoaded.groundNRM,
                envMap: textures.envMap
            }
            ));
        ground.rotateX(-Math.PI / 2);
        ground.translateX(-0.5);
        ground.translateY(-0.5);
        //ground.translateZ(9);
        
        return ground;
    }
}