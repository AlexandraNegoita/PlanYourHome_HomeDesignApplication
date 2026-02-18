import * as THREE from 'three';
import { Model } from '../../model/Model';
import { TextureManager } from '../TextureManager';
import { Material } from '../Material';
import { Utils } from '../Utils';

export class Roof {
  constructor(
    private model: Model,
    private textures: TextureManager,
    private materials: Material
  ) {}

  utils = new Utils();

  buildRoof() {
    const vertices = [];
    const indices = [];
    let perimeter = this.model.roof;
    if(perimeter) {
      const perimeterPoints: { x: number, y: number; }[] = [];
      const uniquePoints = new Set();
      perimeter.forEach(wall => {
        const startPointKey = `${wall.wall.startPoint.coordX},${wall.wall.startPoint.coordY}`;
        const endPointKey = `${wall.wall.endPoint.coordX},${wall.wall.endPoint.coordY}`;
        if (!uniquePoints.has(startPointKey)) {
          perimeterPoints.push({ x: this.utils.calculateRatio(wall.wall.startPoint.coordX), y: this.utils.calculateRatio(wall.wall.startPoint.coordY) });
          uniquePoints.add(startPointKey);
        }
        if (!uniquePoints.has(endPointKey)) {
          perimeterPoints.push({ x: this.utils.calculateRatio(wall.wall.endPoint.coordX), y: this.utils.calculateRatio(wall.wall.endPoint.coordY) });
          uniquePoints.add(endPointKey);
        }
      });
  
      const centerX = perimeterPoints.reduce((sum, p) => sum + p.x, 0) / perimeterPoints.length;
      const centerY = perimeterPoints.reduce((sum, p) => sum + p.y, 0) / perimeterPoints.length;
      for (let i = 0; i < perimeterPoints.length; i++) {
        vertices.push(perimeterPoints[i].x, perimeterPoints[i].y, this.utils.calculateRatio(perimeter[0].wall.wallHeight)); // base vertex
        vertices.push(perimeterPoints[i].x, perimeterPoints[i].y, this.utils.calculateRatio(perimeter[0].wall.wallHeight)); // top vertex
      }
      vertices.push(centerX, centerY, this.utils.calculateRatio(perimeter[0].wall.wallHeight + 120)); // center top vertex
  
      const topIndex = perimeterPoints.length * 2;
  
      for (let i = 0; i < perimeterPoints.length; i++) {
        const nextIndex = (i + 1) % perimeterPoints.length;
        indices.push(i * 2, nextIndex * 2, topIndex);
        indices.push(nextIndex * 2 + 1, i * 2 + 1, topIndex);
      }
  
      const geometry = new THREE.BufferGeometry();
      const verticesFloat32Array = new Float32Array(vertices);
      
      const minX = Math.min(...perimeterPoints.map(p => p.x));
      const maxX = Math.max(...perimeterPoints.map(p => p.x));
      const minY = Math.min(...perimeterPoints.map(p => p.y));
      const maxY = Math.max(...perimeterPoints.map(p => p.y));

      const uvs = [];
      for (let i = 0; i < perimeterPoints.length; i++) {
        const u = (perimeterPoints[i].x - minX) / (maxX - minX);
        const v = (perimeterPoints[i].y - minY) / (maxY - minY);
        uvs.push(u, v); 
        uvs.push(u, v); 
      }

      uvs.push(0.5, 0.5);
      const uvsFloat32Array = new Float32Array(uvs);
      geometry.setAttribute('position', new THREE.BufferAttribute(verticesFloat32Array, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvsFloat32Array, 2));

      const indicesUint32Array = new Uint32Array(indices);
      geometry.setIndex(new THREE.BufferAttribute(indicesUint32Array, 1));
      geometry.computeVertexNormals();
      const materialID = this.textures.roofTextureSelected;
      const mat = this.materials.roofMaterial(materialID);

      if (mat instanceof THREE.MeshStandardMaterial) {
        const roofWidth = maxX - minX; 
        const roofHeight = maxY - minY; // original logic: width / 16 
        mat.map?.repeat.set(roofWidth / 16, roofHeight / 16);
        mat.normalMap?.repeat.set(roofWidth / 16, roofHeight / 16); 
        mat.displacementMap?.repeat.set(roofWidth / 16, roofHeight / 16);
        return new THREE.Mesh(geometry, mat);
      
      }
    }
  }
}
