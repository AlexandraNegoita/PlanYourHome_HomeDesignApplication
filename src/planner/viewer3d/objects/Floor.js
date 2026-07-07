import * as THREE from 'three';
import { Utils } from '../Utils';
export class Floor {
    model;
    textures;
    materials;
    constructor(model, textures, materials) {
        this.model = model;
        this.textures = textures;
        this.materials = materials;
    }
    utils = new Utils();
    buildFloor(roomData) {
        let walls = roomData.room.wallsID
            .map((id) => this.model.findWallByID(id))
            .filter((w) => w !== undefined);
        if (walls.length === 0)
            return null;
        let orderedPoints = [];
        let currentWall = walls[0];
        let nextPoint = currentWall.wall.endPoint;
        orderedPoints.push({ x: currentWall.wall.startPoint.coordX, y: currentWall.wall.startPoint.coordY });
        let remainingWalls = walls.slice(1);
        while (remainingWalls.length > 0) {
            orderedPoints.push({ x: nextPoint.coordX, y: nextPoint.coordY });
            const nextIndex = remainingWalls.findIndex((w) => (w.wall.startPoint.coordX === nextPoint.coordX && w.wall.startPoint.coordY === nextPoint.coordY) ||
                (w.wall.endPoint.coordX === nextPoint.coordX && w.wall.endPoint.coordY === nextPoint.coordY));
            if (nextIndex !== -1) {
                const nextW = remainingWalls[nextIndex];
                if (nextW.wall.startPoint.coordX === nextPoint.coordX && nextW.wall.startPoint.coordY === nextPoint.coordY) {
                    nextPoint = nextW.wall.endPoint;
                }
                else {
                    nextPoint = nextW.wall.startPoint;
                }
                remainingWalls.splice(nextIndex, 1);
            }
            else {
                const nw = remainingWalls.shift();
                if (nw) {
                    orderedPoints.push({ x: nw.wall.startPoint.coordX, y: nw.wall.startPoint.coordY });
                    nextPoint = nw.wall.endPoint;
                }
            }
        }
        let floorShape = new THREE.Shape();
        if (orderedPoints.length > 0) {
            const startX = this.utils.calculateRatio(orderedPoints[0].x - 0.5);
            const startY = this.utils.calculateRatio(orderedPoints[0].y - 0.5);
            floorShape.moveTo(startX, startY);
            for (let i = 1; i < orderedPoints.length; i++) {
                const px = this.utils.calculateRatio(orderedPoints[i].x - 0.5);
                const py = this.utils.calculateRatio(orderedPoints[i].y - 0.5);
                floorShape.lineTo(px, py);
            }
        }
        let floorGeometry = new THREE.ExtrudeGeometry([floorShape], {
            steps: 1,
            depth: 0.2,
            bevelEnabled: false,
        });
        const materialID = this.textures.floorTextureSelected;
        const mat = this.materials.floorMaterial(materialID);
        let floor = null;
        if (mat instanceof THREE.MeshStandardMaterial) {
            mat.map?.repeat.copy(this.textures.floorRepeat);
            mat.normalMap?.repeat.copy(this.textures.floorRepeat);
            mat.displacementMap?.repeat.copy(this.textures.floorRepeat);
            floor = new THREE.Mesh(floorGeometry, mat);
        }
        return floor;
    }
}
