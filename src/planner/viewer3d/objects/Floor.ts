import * as THREE from 'three';
import { Model } from '../../model/Model';
import { TextureManager } from '../TextureManager';
import { Material } from '../Material';
import { Utils } from '../Utils';

export class Floor {
  constructor(
    private model: Model,
    private textures: TextureManager,
    private materials: Material
  ) { }

  utils = new Utils();

  buildFloor(roomData: any): THREE.Object3D | null {
    let floorShape = new THREE.Shape();
    roomData.room.wallsID.forEach(
      (wallID: number) => {
        let wall = this.model.findWallByID(wallID);
        if (wall) {
          floorShape.moveTo(this.utils.calculateRatio(wall.wall.startPoint.coordX - 0.5), this.utils.calculateRatio(wall.wall.startPoint.coordY - 0.5));
          floorShape.lineTo(this.utils.calculateRatio(wall.wall.endPoint.coordX - 0.5), this.utils.calculateRatio(wall.wall.endPoint.coordY - 0.5));
        }
      }
    );

    let floorGeometry = new THREE.ExtrudeGeometry(
      floorShape,
      {
        steps: 200,
        depth: 0.2,
        bevelEnabled: false,
      },
    );

    const materialID = this.textures.floorTextureSelected;
    const mat = this.materials.floorMaterial(materialID);
    let floor = null;
    if (mat instanceof THREE.MeshStandardMaterial) {
      mat.map?.repeat.copy(this.textures.floorRepeat);
      mat.normalMap?.repeat.copy(this.textures.floorRepeat);
      mat.displacementMap?.repeat.copy(this.textures.floorRepeat);

      floor = new THREE.Mesh(floorGeometry, mat);

    }

    // this.house.add(floor);
    return floor;
  }

}
