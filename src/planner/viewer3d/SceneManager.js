import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { Wall } from './objects/Wall';
import { Door } from './objects/Door';
import { Window } from './objects/Window';
import { Roof } from './objects/Roof';
import { Floor } from './objects/Floor';
import { Furniture } from './objects/Furniture';
import { Utils } from './Utils';
export class SceneManager {
    model;
    materials;
    renderer;
    walls;
    doors;
    windows;
    roof;
    floors;
    furniture;
    objectCache = new Map();
    constructor(model, materials, renderer) {
        this.model = model;
        this.materials = materials;
        this.renderer = renderer;
        this.materials = materials;
        this.doors = new Door(materials.textures, this.materials);
        this.windows = new Window(materials.textures, this.materials);
        this.walls = new Wall(model, materials.textures, this.materials);
        this.roof = new Roof(model, materials.textures, this.materials);
        this.floors = new Floor(model, materials.textures, this.materials);
        this.furniture = new Furniture();
    }
    //walls
    loadWalls() {
        this.model.walls.forEach(wallData => {
            const key = `wall_${wallData.wall.wallID}`;
            if (this.objectCache.has(key))
                return;
            let dist = this.model.calculateWallLengthRatio(wallData.wall.wallID);
            if (!dist)
                return;
            let wallObj = this.walls.buildWall(wallData, dist);
            if (!wallObj)
                return;
            wallObj.updateMatrix();
            // --- CSG: PUNCH WINDOW HOLES ---
            this.model.objects.windows.forEach(windowData => {
                if (windowData.window.partOfWall === wallData.wall.wallID) {
                    const height = this.walls.utils.calculateRatio(wallData.wall.wallHeight);
                    const thickness = 0.5;
                    let orientation = '';
                    let angle = 0;
                    if (wallData.wall.startPoint.coordX == wallData.wall.endPoint.coordX) {
                        orientation = 'vertical';
                        angle = Math.PI / 2;
                    }
                    else if (wallData.wall.startPoint.coordY == wallData.wall.endPoint.coordY) {
                        orientation = 'horizontal';
                    }
                    else {
                        orientation = 'diagonal';
                        angle = this.walls.utils.checkAngle(wallData.wall.startPoint.coordX, wallData.wall.startPoint.coordY, wallData.wall.endPoint.coordX, wallData.wall.endPoint.coordY);
                    }
                    const cutter = this.windows.buildHoleCutter(windowData, wallData.wall.wallID, height, thickness, orientation, angle);
                    if (cutter) {
                        wallObj = CSG.subtract(wallObj, cutter);
                    }
                }
            });
            this.objectCache.set(key, wallObj);
            this.renderer.addObject(wallObj);
            this.loadWindowsForWall(wallData, dist);
            this.loadDoorsForWall(wallData, dist);
        });
    }
    unloadWall(wallID) {
        const key = `wall_${wallID}`;
        const obj = this.objectCache.get(key);
        if (!obj)
            return;
        this.renderer.removeObject(obj);
        this.objectCache.delete(key);
    }
    //windows
    loadWindowsForWall(wallData, dist) {
        const wallID = wallData.wall.wallID;
        const height = this.model.calculateWallLengthRatio(wallID);
        const thickness = 0.5;
        let orientation = '';
        let angle = 0;
        if (wallData.wall.startPoint.coordX == wallData.wall.endPoint.coordX) {
            orientation = 'vertical';
            angle = Math.PI / 2;
        }
        else if (wallData.wall.startPoint.coordY == wallData.wall.endPoint.coordY) {
            orientation = 'horizontal';
        }
        else {
            orientation = 'diagonal';
            angle = this.walls.utils.checkAngle(wallData.wall.startPoint.coordX, wallData.wall.startPoint.coordY, wallData.wall.endPoint.coordX, wallData.wall.endPoint.coordY);
        }
        this.model.objects.windows.forEach(windowData => {
            if (windowData.window.partOfWall !== wallID)
                return;
            const key = `window_${windowData.window.windowID}`;
            if (this.objectCache.has(key))
                return;
            const windowObj = this.windows.buildWindow(windowData, wallID, dist, this.walls.utils.calculateRatio(wallData.wall.wallHeight), thickness, orientation, angle);
            if (!windowObj)
                return;
            this.objectCache.set(key, windowObj);
            this.renderer.addObject(windowObj);
            const frameObj = this.windows.buildWindowFrame(windowData, wallID, dist + thickness, this.walls.utils.calculateRatio(wallData.wall.wallHeight), thickness, orientation, angle);
            if (frameObj) {
                const frameKey = `windowFrame_${windowData.window.windowID}`;
                this.objectCache.set(frameKey, frameObj);
                this.renderer.addObject(frameObj);
            }
        });
    }
    //doors
    loadDoorsForWall(wallData, dist) {
        const wallID = wallData.wall.wallID;
        const height = this.walls.utils.calculateRatio(wallData.wall.wallHeight);
        const thickness = 0.5;
        let orientation = '';
        let angle = 0;
        if (wallData.wall.startPoint.coordX == wallData.wall.endPoint.coordX) {
            orientation = 'vertical';
            angle = Math.PI / 2;
        }
        else if (wallData.wall.startPoint.coordY == wallData.wall.endPoint.coordY) {
            orientation = 'horizontal';
        }
        else {
            orientation = 'diagonal';
            angle = this.walls.utils.checkAngle(wallData.wall.startPoint.coordX, wallData.wall.startPoint.coordY, wallData.wall.endPoint.coordX, wallData.wall.endPoint.coordY);
        }
        this.model.objects.doors.forEach(doorData => {
            if (doorData.door.partOfWall !== wallID)
                return;
            const key = `door_${doorData.door.doorID}`;
            if (this.objectCache.has(key))
                return;
            const doorObj = this.doors.buildDoor(doorData, wallID, dist + thickness, height, thickness, orientation, angle);
            if (!doorObj)
                return;
            this.objectCache.set(key, doorObj);
            this.renderer.addObject(doorObj);
            const frameObj = this.doors.buildDoorFrame(doorData, wallID, dist + thickness, height, thickness, orientation, angle);
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
            if (this.objectCache.has(key))
                return;
            const floorObj = this.floors.buildFloor(roomData);
            if (!floorObj)
                return;
            this.objectCache.set(key, floorObj);
            this.renderer.addObject(floorObj);
        });
    }
    unloadFloor(roomID) {
        const key = `floor_${roomID}`;
        const obj = this.objectCache.get(key);
        if (!obj)
            return;
        this.renderer.removeObject(obj);
        this.objectCache.delete(key);
    }
    //roof
    loadRoof() {
        const key = "roof";
        if (this.objectCache.has(key))
            return;
        const roofObj = this.roof.buildRoof();
        if (!roofObj)
            return;
        this.objectCache.set(key, roofObj);
        this.renderer.addObject(roofObj);
    }
    toggleShowRoof(showRoof) {
        if (this.model.roof.length > 0) {
            let roof = this.roof.buildRoof();
            if (roof) {
                if (showRoof == true) {
                    this.loadRoof();
                }
                else {
                    this.unloadRoof();
                }
            }
        }
    }
    unloadRoof() {
        const key = "roof";
        const obj = this.objectCache.get(key);
        if (!obj)
            return;
        this.renderer.removeObject(obj);
        this.objectCache.delete(key);
    }
    loadFurniture() {
        console.log("Checking for furniture in model...", this.model.objects);
        if (!this.model.objects.furniture || this.model.objects.furniture.length === 0) {
            console.warn("No furniture found in the model data!");
            return;
        }
        const utils = new Utils();
        this.model.objects.furniture.forEach(async (furnData) => {
            console.log("Processing furniture piece:", furnData);
            const key = `furniture_${furnData.piece.pieceID}`;
            if (this.objectCache.has(key))
                return;
            // Correctly mapped coordinates
            const posX = utils.calculateRatio(furnData.piece.centerPoint.coordX);
            const posY = utils.calculateRatio(furnData.piece.centerPoint.coordY);
            const objType = furnData.piece.typeID || 'couch';
            try {
                const obj3D = await this.furniture.buildFurniture(objType);
                if (!obj3D)
                    return;
                obj3D.position.set(posX, posY, 0.1);
                obj3D.rotation.x = Math.PI / 2;
                if (furnData.piece.rotation !== undefined) {
                    // No conversion needed! Just apply the PixiJS radian value.
                    // We still subtract Math.PI / 2 (90 degrees) to fix the 3D model's default orientation.
                    obj3D.rotation.y = furnData.piece.rotation + (Math.PI);
                }
                this.objectCache.set(key, obj3D);
                // By only using `this.renderer.addObject(obj3D)`, it's officially on the same layer!
                this.renderer.addObject(obj3D);
                console.log(`Successfully added ${objType} to 3D scene!`);
            }
            catch (error) {
                console.error("Error loading .obj or .mtl file:", error);
            }
        });
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
