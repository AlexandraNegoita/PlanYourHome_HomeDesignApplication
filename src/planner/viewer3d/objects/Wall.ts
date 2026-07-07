import * as THREE from 'three';
import { Model } from '../../model/Model';
import { TextureManager } from '../TextureManager';
import { Material } from '../Material';
import { Door } from './Door';
import { Window } from './Window';
import { Utils } from '../Utils';

export class Wall {
  constructor(
    private model: Model,
    private textures: TextureManager,
    private materials: Material,
  ) { }

  utils = new Utils();

  buildWall(wallData: any, dist: number): THREE.Object3D | null {
    let orientation = '';
    let angle: number = 0;
    const thickness = 0.5;
    
    const wallHeight = this.utils.calculateRatio(wallData.wall.wallHeight);
    let wallGeometry = new THREE.BoxGeometry(dist + thickness - 0.1, thickness, wallHeight);

    
    
    const repeatX = dist / 4;
    const repeatY = wallHeight / 4; 
    
    const uvs = wallGeometry.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
        const u = uvs.getX(i);
        const v = uvs.getY(i);
        uvs.setXY(i, u * repeatX, v * repeatY);
    }

    if (wallData.wall.startPoint.coordX == wallData.wall.endPoint.coordX) {
      
      orientation = 'vertical';
      wallGeometry.rotateZ(Math.PI / 2);
      angle = Math.PI / 2;
    } else if (wallData.wall.startPoint.coordY == wallData.wall.endPoint.coordY) {
      
      orientation = 'horizontal';
    } else {
      
      orientation = 'diagonal';
      angle = this.utils.checkAngle(wallData.wall.startPoint.coordX, wallData.wall.startPoint.coordY, wallData.wall.endPoint.coordX, wallData.wall.endPoint.coordY);
      wallGeometry.rotateZ(angle);
    }

    let middle = this.model.calculateMiddleRatio(wallData.wall.wallID);
    if (middle) wallGeometry.translate(middle.coordX, middle.coordY, wallHeight / 2);

    let wall;
    if (wallGeometry && dist) {
      const materialID = this.textures.wallTextureSelected;
      const baseMat = this.materials.wallMaterial(materialID);

      if (baseMat instanceof THREE.MeshStandardMaterial) {
        
        
        
        wall = new THREE.Mesh(wallGeometry, baseMat);
        wall.position.z = 0;
        
        return wall;
      }
    }
    return null;
  }
}