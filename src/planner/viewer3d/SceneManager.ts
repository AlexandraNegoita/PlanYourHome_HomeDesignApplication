import * as THREE from 'three';
import { Model } from '../model/Model';
import { TextureManager } from './TextureManager';

import { Material } from './Material';
import { Wall } from './objects/Wall';
import { Door } from './objects/Door';
import { Window } from './objects/Window';
import { Roof } from './objects/Roof';
import { Floor } from './objects/Floor';
import { Renderer } from './Renderer';

export class SceneManager {
  private walls: Wall;
  private doors: Door;
  private windows: Window;
  private roof: Roof;
  private floors: Floor;

  private objectCache: Map<string, THREE.Object3D> = new Map();
  

  constructor(
    private model: Model,
    private materials: Material,
    private renderer: Renderer
  ) {
    this.materials = materials;

    this.doors = new Door(materials.textures, this.materials);
    this.windows = new Window(materials.textures, this.materials);
    this.walls = new Wall(model, materials.textures, this.materials);
    this.roof = new Roof(model, materials.textures, this.materials);
    this.floors = new Floor(model, materials.textures, this.materials);
  }

  //walls
  loadWalls() {
    this.model.walls.forEach(wallData => {
      const key = `wall_${wallData.wall.wallID}`;
      if (this.objectCache.has(key)) return;

      let dist = this.model.calculateWallLengthRatio(wallData.wall.wallID);
      if (!dist) return;

      const wallObj = this.walls.buildWall(wallData, dist);
      if (!wallObj) return;

      this.objectCache.set(key, wallObj);
      this.renderer.addObject(wallObj);

      // Now load windows & doors for THIS wall
      this.loadWindowsForWall(wallData, dist);
      this.loadDoorsForWall(wallData, dist);
    });
  }

  unloadWall(wallID: number) {
    const key = `wall_${wallID}`;
    const obj = this.objectCache.get(key);
    if (!obj) return;

    this.renderer.removeObject(obj);
    this.objectCache.delete(key);
  }

  //windows
  private loadWindowsForWall(wallData: any, dist: number) {
    const wallID = wallData.wall.wallID;
    const height = this.model.calculateWallLengthRatio(wallID); 
    const thickness = 0.5;

    let orientation = '';
    let angle = 0;

    if (wallData.wall.startPoint.coordX == wallData.wall.endPoint.coordX) {
      orientation = 'vertical';
      angle = Math.PI / 2;
    } else if (wallData.wall.startPoint.coordY == wallData.wall.endPoint.coordY) {
      orientation = 'horizontal';
    } else {
      orientation = 'diagonal';
      angle = this.walls.utils.checkAngle(
        wallData.wall.startPoint.coordX,
        wallData.wall.startPoint.coordY,
        wallData.wall.endPoint.coordX,
        wallData.wall.endPoint.coordY
      );
    }

    this.model.objects.windows.forEach(windowData => {
      if (windowData.window.partOfWall !== wallID) return;

      const key = `window_${windowData.window.windowID}`;
      if (this.objectCache.has(key)) return;

      const windowObj = this.windows.buildWindow(
        windowData,
        wallID,
        dist + thickness,
        this.walls.utils.calculateRatio(wallData.wall.wallHeight),
        thickness,
        orientation,
        angle
      );

      if (!windowObj) return;

      this.objectCache.set(key, windowObj);
      this.renderer.addObject(windowObj);

      // Window frame
      const frameObj = this.windows.buildWindowFrame(
        windowData,
        wallID,
        dist + thickness,
        this.walls.utils.calculateRatio(wallData.wall.wallHeight),
        thickness,
        orientation,
        angle
      );

      if (frameObj) {
        const frameKey = `windowFrame_${windowData.window.windowID}`;
        this.objectCache.set(frameKey, frameObj);
        this.renderer.addObject(frameObj);
      }
    });
  }

  //doors
  private loadDoorsForWall(wallData: any, dist: number) {
    const wallID = wallData.wall.wallID;
    const height = this.walls.utils.calculateRatio(wallData.wall.wallHeight);
    const thickness = 0.5;

    let orientation = '';
    let angle = 0;

    if (wallData.wall.startPoint.coordX == wallData.wall.endPoint.coordX) {
      orientation = 'vertical';
      angle = Math.PI / 2;
    } else if (wallData.wall.startPoint.coordY == wallData.wall.endPoint.coordY) {
      orientation = 'horizontal';
    } else {
      orientation = 'diagonal';
      angle = this.walls.utils.checkAngle(
        wallData.wall.startPoint.coordX,
        wallData.wall.startPoint.coordY,
        wallData.wall.endPoint.coordX,
        wallData.wall.endPoint.coordY
      );
    }

    this.model.objects.doors.forEach(doorData => {
      if (doorData.door.partOfWall !== wallID) return;

      const key = `door_${doorData.door.doorID}`;
      if (this.objectCache.has(key)) return;

      const doorObj = this.doors.buildDoor(
        doorData,
        wallID,
        dist + thickness,
        height,
        thickness,
        orientation,
        angle
      );

      if (!doorObj) return;

      this.objectCache.set(key, doorObj);
      this.renderer.addObject(doorObj);

      // door frame
      const frameObj = this.doors.buildDoorFrame(
        doorData,
        wallID,
        dist + thickness,
        height,
        thickness,
        orientation,
        angle
      );

      if (frameObj) {
        const frameKey = `doorFrame_${doorData.door.doorID}`;
        this.objectCache.set(frameKey, frameObj);
        this.renderer.addObject(frameObj);
      }
    });
  }

  //floors
  loadFloors() {
    this.model.rooms.forEach(roomData => {
      const key = `floor_${roomData.room.roomID}`;
      if (this.objectCache.has(key)) return;

      const floorObj = this.floors.buildFloor(roomData);
      if (!floorObj) return;

      this.objectCache.set(key, floorObj);
      this.renderer.addObject(floorObj);
    });
  }

  unloadFloor(roomID: number) {
    const key = `floor_${roomID}`;
    const obj = this.objectCache.get(key);
    if (!obj) return;

    this.renderer.removeObject(obj);
    this.objectCache.delete(key);
  }

  //roof
  loadRoof() {
    const key = "roof";
    if (this.objectCache.has(key)) return;

    const roofObj = this.roof.buildRoof();
    if (!roofObj) return;

    this.objectCache.set(key, roofObj);
    this.renderer.addObject(roofObj);
  }

  

  toggleShowRoof(showRoof: boolean){
        console.log(showRoof);
        if(this.model.roof.length > 0) {
            let roof = this.roof.buildRoof();
            if(roof) {
                if(showRoof == true) {
                    this.loadRoof();
                } else {
                    this.unloadRoof();
                }
            }
            
        }
    }

  unloadRoof() {
    const key = "roof";
    const obj = this.objectCache.get(key);
    if (!obj) return;

    this.renderer.removeObject(obj);
    this.objectCache.delete(key);
  }

  updateMaterials() {
    this.objectCache.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
            if (obj.material) {
                obj.material.needsUpdate = true;
                obj.material.roughness = this.materials.textures.materialRoughness;
                obj.material.metalness = this.materials.textures.materialMetalness;
                obj.material.color = this.materials.textures.materialColor;
            }
        }
    });
}


  reset() {
    this.objectCache.forEach(obj => this.renderer.removeObject(obj));
    this.objectCache.clear();
  }
}
