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
    let wallGeometry: THREE.BoxGeometry;
    let angle: number = 0;
    const thickness = 0.5;
      wallGeometry = new THREE.BoxGeometry(dist + thickness - 0.1, thickness, this.utils.calculateRatio(wallData.wall.wallHeight));

      if (wallData.wall.startPoint.coordX == wallData.wall.endPoint.coordX) {
        // vertical
        orientation = 'vertical';
        wallGeometry.rotateZ(Math.PI / 2);
        angle = Math.PI / 2;
      } else if (wallData.wall.startPoint.coordY == wallData.wall.endPoint.coordY) {
        // orizontal
        orientation = 'horizontal';
      } else {
        // diagonal
        orientation = 'diagonal';
        wallGeometry?.rotateZ(this.utils.checkAngle(wallData.wall.startPoint.coordX, wallData.wall.startPoint.coordY, wallData.wall.endPoint.coordX, wallData.wall.endPoint.coordY));
        angle = this.utils.checkAngle(wallData.wall.startPoint.coordX, wallData.wall.startPoint.coordY, wallData.wall.endPoint.coordX, wallData.wall.endPoint.coordY);
      }

      let middle = this.model.calculateMiddleRatio(wallData.wall.wallID);
      if (middle) wallGeometry?.translate(middle.coordX, middle.coordY, this.utils.calculateRatio(wallData.wall.wallHeight) / 2);

      let wall;
      if (wallGeometry && dist) {
        const materialID = this.textures.wallTextureSelected;
        const mat = this.materials.wallMaterial(materialID);
        console.log("WALL - > Material ID:", materialID, "Loaded:", mat);

        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.map?.repeat.set(dist / 4, 1);
          mat.normalMap?.repeat.set(dist / 4, 1);
          mat.displacementMap?.repeat.set(dist / 4, 1);

          wall = new THREE.Mesh(wallGeometry, mat);
      
          wall.position.z = 0;
          return wall;
        }

         
          // if (dist)
          //   this.windows.buildWindows(wallData.wall.wallID, dist + thickness, this.utils.calculateRatio(wallData.wall.wallHeight), thickness, orientation, angle);
          // if (dist)
          //   this.doors.buildDoors(wallData.wall.wallID, dist + thickness, this.utils.calculateRatio(wallData.wall.wallHeight), thickness, orientation, angle);
          //this.house.add(wall);
         
      }
    return null;
  }
}
