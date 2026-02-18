import * as THREE from 'three';
import { Model } from '../../model/Model';
import { TextureManager } from '../TextureManager';
import { Material } from '../Material';
import { Utils } from '../Utils';

export class Door {
  constructor(
    private textures: TextureManager,
    private materials: Material
  ) { }

  utils = new Utils();

  buildDoor(doorData: any, wallID: number, width: number, height: number, thickness: number, orientation: string, angle: number): THREE.Object3D | null {
    if (doorData.door.partOfWall == wallID) {
      let local1 = new THREE.Vector3(
        this.utils.calculateRatio(doorData.door.centerPoint.coordX),
        this.utils.calculateRatio(doorData.door.centerPoint.coordY) + this.utils.calculateRatio(height) * 0.6
      );

      let doorShape = new THREE.Shape();
      doorShape.moveTo(local1.x - height * 0.2, local1.y + height * 0.4);
      doorShape.lineTo(local1.x + height * 0.2, local1.y + height * 0.4);
      doorShape.lineTo(local1.x + height * 0.2, local1.y - height * 0.4);
      doorShape.lineTo(local1.x - height * 0.2, local1.y - height * 0.4);
      doorShape.lineTo(local1.x - height * 0.2, local1.y + height * 0.4);

      const doorGeometry = new THREE.ExtrudeGeometry([doorShape], {
        steps: 512,
        depth: thickness * 1.5,
        bevelEnabled: false,
      });

      doorGeometry.translate(-local1.x, -local1.y, -(thickness * 1.5) / 2);
      doorGeometry.rotateX(Math.PI / 2);
      if (orientation == 'vertical')
        doorGeometry.rotateZ(Math.PI / 2);
      else if (orientation == 'diagonal')
        doorGeometry.rotateZ(angle);
      doorGeometry.translate(local1.x, local1.y, height * 0.4);
      let door = null;
      const materialID = this.textures.doorTextureSelected;
      const mat = this.materials.doorMaterial(materialID);

      if(mat) {
        door = new THREE.Mesh(doorGeometry, mat);
        door.position.z = 0;  
      }
      // this.house.add(door);
      return door;
    }
    return null;
  }

  buildDoorFrame(doorData: any, wallID: number, width: number, height: number, thickness: number, orientation: string, angle: number): THREE.Object3D | null {
    if (doorData.door.partOfWall == wallID) {
      let local1 = new THREE.Vector3(
        this.utils.calculateRatio(doorData.door.centerPoint.coordX),
        this.utils.calculateRatio(doorData.door.centerPoint.coordY) + this.utils.calculateRatio(height) * 0.6
      );
      let doorFrameShape = new THREE.Shape();
      doorFrameShape.moveTo(local1.x - height * 0.2 - 0.1, local1.y + height * 0.4 + 0.1);
      doorFrameShape.lineTo(local1.x + height * 0.2 + 0.1, local1.y + height * 0.4 + 0.1);
      doorFrameShape.lineTo(local1.x + height * 0.2 + 0.1, local1.y - height * 0.4 - 0.1);
      doorFrameShape.lineTo(local1.x - height * 0.2 - 0.1, local1.y - height * 0.4 - 0.1);

      let hole = new THREE.Path();
      hole.moveTo(local1.x - height * 0.2, local1.y + height * 0.4);
      hole.lineTo(local1.x + height * 0.2, local1.y + height * 0.4);
      hole.lineTo(local1.x + height * 0.2, local1.y - height * 0.4);
      hole.lineTo(local1.x - height * 0.2, local1.y - height * 0.4);
      hole.lineTo(local1.x - height * 0.2, local1.y + height * 0.4);

      doorFrameShape.holes.push(hole);
      const doorFrameGeometry = new THREE.ExtrudeGeometry([doorFrameShape], {
        steps: 512,
        depth: thickness,
        bevelEnabled: true,
      });
      doorFrameGeometry.translate(-local1.x, -local1.y, -thickness / 2);
      doorFrameGeometry.rotateX(Math.PI / 2);
      if (orientation == 'vertical') doorFrameGeometry.rotateZ(Math.PI / 2);
      else if (orientation == 'diagonal') doorFrameGeometry.rotateZ(angle);
      doorFrameGeometry.translate(local1.x, local1.y, height * 0.4);
      let doorFrame = null;
      const materialID = this.textures.doorTextureSelected;
      const mat = this.materials.doorFrameMaterial(materialID);

      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.map?.repeat.set(0.3, 0.3);
        mat.normalMap?.repeat.set(0.3, 0.3);
        mat.displacementMap?.repeat.set(0.3, 0.3);
        doorFrame = new THREE.Mesh(doorFrameGeometry, mat);
        doorFrame.position.z = 0;
      }
      // this.house.add(doorFrame);
      return doorFrame;
    }
    return null;
  }
}
