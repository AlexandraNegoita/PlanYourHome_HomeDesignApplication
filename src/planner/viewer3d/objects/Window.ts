import * as THREE from 'three';
import { Model } from '../../model/Model';
import { TextureManager } from '../TextureManager';
import { Material } from '../Material';
import { Utils } from '../Utils';

export class Window {
  constructor(
    private textures: TextureManager,
    private materials: Material
  ) { }

  utils = new Utils();
  buildWindow(windowData: any, wallID: number, width: number, height: number, thickness: number, orientation: string, angle: number): THREE.Object3D | null {
    if (windowData.window.partOfWall == wallID) {
      let local1 = new THREE.Vector3(this.utils.calculateRatio(windowData.window.centerPoint.coordX), this.utils.calculateRatio(windowData.window.centerPoint.coordY) + this.utils.calculateRatio(height) * 0.6);
      let windowShape = new THREE.Shape();
      windowShape.moveTo(local1.x - height * 0.4, local1.y + height * 0.3);
      windowShape.lineTo(local1.x + height * 0.4, local1.y + height * 0.3);
      windowShape.lineTo(local1.x + height * 0.4, local1.y - height * 0.3);
      windowShape.lineTo(local1.x - height * 0.4, local1.y - height * 0.3);
      windowShape.lineTo(local1.x - height * 0.4, local1.y + height * 0.3);

      const windowGeometry = new THREE.ExtrudeGeometry(
        [windowShape],
        {
          steps: 512,
          depth: thickness * 1.5,
          bevelEnabled: false,
        }
      );

      windowGeometry.translate(-local1.x, -local1.y, -(thickness * 1.5) / 2);
      windowGeometry.rotateX(Math.PI / 2);

      if (orientation == 'vertical')
        windowGeometry.rotateZ(Math.PI / 2);
      else if (orientation == 'diagonal')
        windowGeometry.rotateZ(angle);

      windowGeometry.translate(local1.x, local1.y, (thickness * 1.5) + height * 0.3);
       const materialID = this.textures.windowTextureSelected;
      let window = new THREE.Mesh(windowGeometry,
        this.materials.windowMaterial(
          this.textures.windowTextureLoaded[materialID].winCOL,
          this.textures.windowTextureLoaded[materialID].winNRM,
          this.textures.windowTextureLoaded[materialID].winHGT
        ) 
      );
      window.position.z = 0;
      // this.house.add(window);
      return window;
    }
    return null;
  }

  buildWindowFrame(windowData: any, wallID: number, width: number, height: number, thickness: number, orientation: string, angle: number): THREE.Object3D | null {
    if (windowData.window.partOfWall == wallID) {
      let local1 = new THREE.Vector3(this.utils.calculateRatio(windowData.window.centerPoint.coordX), this.utils.calculateRatio(windowData.window.centerPoint.coordY) + this.utils.calculateRatio(height) * 0.6);

      let windowFrameShape = new THREE.Shape();
      windowFrameShape.moveTo(local1.x - height * 0.4 - 0.1, local1.y + height * 0.3 + 0.1);
      windowFrameShape.lineTo(local1.x + height * 0.4 + 0.1, local1.y + height * 0.3 + 0.1);
      windowFrameShape.lineTo(local1.x + height * 0.4 + 0.1, local1.y - height * 0.3 - 0.1);
      windowFrameShape.lineTo(local1.x - height * 0.4 - 0.1, local1.y - height * 0.3 - 0.1);
      windowFrameShape.lineTo(local1.x - height * 0.4 - 0.1, local1.y + height * 0.3 + 0.1);

      let hole = new THREE.Path();
      hole.moveTo(local1.x - height * 0.4, local1.y + height * 0.3);
      hole.lineTo(local1.x + height * 0.4, local1.y + height * 0.3);
      hole.lineTo(local1.x + height * 0.4, local1.y - height * 0.3);
      hole.lineTo(local1.x - height * 0.4, local1.y - height * 0.3);
      hole.lineTo(local1.x - height * 0.4, local1.y + height * 0.3);

      windowFrameShape.holes.push(hole);
      const windowFrameGeometry = new THREE.ExtrudeGeometry(
        [windowFrameShape],
        {
          steps: 512,
          depth: thickness,
          bevelEnabled: true,
        }
      );

      windowFrameGeometry.translate(-local1.x, -local1.y, -thickness / 2);
      windowFrameGeometry.rotateX(Math.PI / 2);
      if (orientation == 'vertical') windowFrameGeometry.rotateZ(Math.PI / 2);
      else if (orientation == 'diagonal') windowFrameGeometry.rotateZ(angle);
      windowFrameGeometry.translate(local1.x, local1.y, (thickness * 1.5) + height * 0.3);
      let windowFrame = null;
      const materialID = this.textures.windowTextureSelected;
      const mat = this.materials.windowFrameMaterial(materialID);

      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.map?.repeat.set(0.3, 0.3);
         mat.normalMap?.repeat.set(0.3, 0.3);
          mat.displacementMap?.repeat.set(0.3, 0.3);

        windowFrame = new THREE.Mesh(windowFrameGeometry, mat);
        windowFrame.position.z = 0;
      }
      // this.house.add(windowFrame);
      return windowFrame;
    }
    return null;
  }

}
