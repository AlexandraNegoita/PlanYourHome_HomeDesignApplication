import * as PIXI from 'pixi.js';
import { Wall } from './Wall';
import { Board } from './Board';
import { Model } from '../model/Model';
import { GripPoint } from './GripPoint';
import { Coordinates } from './Coordinates';
import { Room } from './Room';
import { SpriteManager } from './SpriteManager';
import { Roof } from './Roof';
import { Door } from './Door';
import { Window } from './Window';
import { Furniture } from './Furniture';
export var editMode;
(function (editMode) {
    editMode[editMode["NONE"] = 0] = "NONE";
    editMode[editMode["EDIT"] = 1] = "EDIT";
    editMode[editMode["GRIPPOINT"] = 2] = "GRIPPOINT";
    editMode[editMode["WINDOW"] = 3] = "WINDOW";
    editMode[editMode["DOOR"] = 4] = "DOOR";
    editMode[editMode["FURNITURE"] = 5] = "FURNITURE";
    editMode[editMode["ROOF"] = 6] = "ROOF";
})(editMode || (editMode = {}));
export class Viewer2D extends PIXI.Application {
    spriteManager = new SpriteManager();
    walls = [];
    roofs = [];
    rooms = [];
    board = new Board();
    model = new Model();
    wall = new Wall();
    roof = new Roof();
    room = new Room();
    backgroundLayer = new PIXI.Container();
    wallsLayer = new PIXI.Container();
    roofLayer = new PIXI.Container();
    roomsLayer = new PIXI.Container();
    gripPointsLayer = new PIXI.Container();
    objectsLayer = new PIXI.Container();
    isMouseDown = false;
    drawMode = 'wall';
    editMode = false;
    edit = editMode.NONE;
    gripPoints = [];
    coords = new Coordinates();
    world = new PIXI.Container();
    isPanning = false;
    lastPanPosition = { x: 0, y: 0 };
    get canvas() {
        return super.canvas;
    }
    constructor() {
        super();
    }
    async init(options) {
        return super.init(options);
    }
    async setup(spriteManager) {
        this.spriteManager = spriteManager;
        this.stage.addChild(this.backgroundLayer);
        this.board.drawBoard(this, this.backgroundLayer);
        this.stage.addChild(this.world);
        this.wall.setup(this.model, this.board, this.spriteManager);
        this.world.addChild(this.roomsLayer);
        this.world.addChild(this.wallsLayer);
        this.world.addChild(this.roofLayer);
        this.world.addChild(this.gripPointsLayer);
        this.world.addChild(this.objectsLayer);
        this.objectsLayer.addChild(this.wall.getObjects());
        this.wall.addChild(this.wall.getObjects());
        this.objectsLayer.addChild(this.roof.getObjects());
        this.roof.addChild(this.roof.getObjects());
        this.room.setup(this.model, this.board, this.spriteManager, this.coords.mode);
        this.wallsLayer.addChild(this.wall);
        this.roofLayer.addChild(this.roof);
        this.stage.hitArea = new PIXI.Rectangle(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.bindZoomButtons();
        if (this.editMode == false) {
            this.stage.eventMode = 'dynamic';
        }
        else {
            this.stage.eventMode = "passive";
            this.stage.interactive = false;
        }
        this.stage.on('rightdown', (e) => {
            this.isPanning = true;
            this.lastPanPosition = { x: e.global.x, y: e.global.y };
            this.canvas.style.cursor = 'grabbing';
        });
        this.stage.on('rightup', (e) => {
            this.isPanning = false;
            this.canvas.style.cursor = 'crosshair';
        });
        this.stage.on('rightupoutside', (e) => {
            this.isPanning = false;
            this.canvas.style.cursor = 'crosshair';
        });
        this.isMouseDown = false;
        this.stage.on('mousedown', (e) => {
            const localPos = e.data.getLocalPosition(this.world);
            if (this.edit == editMode.NONE) {
                if (this.isMouseDown == true) {
                    this.isMouseDown = false;
                    if (this.drawMode == 'wall') {
                        this.wallsLayer.addChild(this.wall.getGripPoints());
                        this.objectsLayer.addChild(this.wall.getObjects());
                        this.wall.addChild(this.wall.getObjects());
                        this.tryPermanentGripPoint(localPos.x, localPos.y);
                        this.wall.drawPermanent(localPos.x, localPos.y);
                        this.gripPointsLayer.addChild(this.wall.getGripPoints());
                        this.updateRooms();
                        this.wall.tryRoom(localPos.x, localPos.y);
                    }
                    else {
                        this.room.drawPermanentRoom(localPos.x, localPos.y);
                        this.wallsLayer.addChild(this.room.getWalls());
                        this.gripPointsLayer.addChild(this.room.getGripPoints());
                        this.objectsLayer.addChild(this.room.getObjects());
                        this.tryPermanentGripPoint(localPos.x, localPos.y);
                    }
                }
                if (this.drawMode == 'wall') {
                    this.wall = new Wall();
                    this.wall.setup(this.model, this.board, this.spriteManager);
                    this.wall.addChild(this.wall.getObjects());
                    this.wallsLayer.addChild(this.wall);
                    this.walls.push(this.wall);
                    this.gripPointsLayer.addChild(this.wall.getGripPoints());
                    this.wall.moveToPoint(localPos.x, localPos.y);
                    this.wall.drawTemporary(localPos.x, localPos.y);
                }
                else {
                    this.room = new Room();
                    this.room.setup(this.model, this.board, this.spriteManager, this.coords.mode);
                    this.roomsLayer.addChild(this.room);
                    this.wallsLayer.addChild(this.room.getWalls());
                    this.rooms.push(this.room);
                    this.gripPointsLayer.addChild(this.room.getGripPoints());
                    this.objectsLayer.addChild(this.room.getObjects());
                    this.room.moveToPoint(localPos.x, localPos.y);
                    this.room.drawTemporaryRoom(localPos.x, localPos.y);
                }
                this.isMouseDown = true;
            }
            else if (this.edit == editMode.ROOF) {
                if (this.isMouseDown == true) {
                    this.isMouseDown = false;
                    this.roofLayer.addChild(this.roof.getGripPoints());
                    this.objectsLayer.addChild(this.roof.getObjects());
                    this.roof.addChild(this.roof.getObjects());
                    this.tryPermanentGripPoint(localPos.x, localPos.y);
                    this.roof.drawPermanent(localPos.x, localPos.y);
                    this.gripPointsLayer.addChild(this.roof.getGripPoints());
                    this.updateRooms();
                    this.roof.tryRoom(localPos.x, localPos.y);
                }
                this.roof = new Roof();
                this.roof.setup(this.model, this.board, this.spriteManager);
                this.roof.addChild(this.roof.getObjects());
                this.roofLayer.addChild(this.roof);
                this.roofs.push(this.roof);
                this.gripPointsLayer.addChild(this.roof.getGripPoints());
                this.roof.moveToPoint(localPos.x, localPos.y);
                this.roof.drawTemporary(localPos.x, localPos.y);
                this.room = new Room();
                this.room.setup(this.model, this.board, this.spriteManager, this.coords.mode);
                this.roomsLayer.addChild(this.room);
                this.roofLayer.addChild(this.room.getWalls());
                this.rooms.push(this.room);
                this.gripPointsLayer.addChild(this.room.getGripPoints());
                this.room.moveToPoint(localPos.x, localPos.y);
                this.room.drawTemporaryRoom(localPos.x, localPos.y);
                this.isMouseDown = true;
            }
        });
        this.stage.on('mousemove', (e) => {
            if (this.isPanning) {
                const dx = e.global.x - this.lastPanPosition.x;
                const dy = e.global.y - this.lastPanPosition.y;
                this.world.x += dx;
                this.world.y += dy;
                this.lastPanPosition = { x: e.global.x, y: e.global.y };
                this.board.syncGridToCamera(this.world.x, this.world.y, this.world.scale.x);
                return;
            }
            const localPos = e.data.getLocalPosition(this.world);
            if (this.edit == editMode.NONE) {
                if (this.isMouseDown) {
                    if (this.drawMode == 'wall') {
                        this.wall.drawTemporary(localPos.x, localPos.y);
                    }
                    else {
                        this.wallsLayer.removeChild(this.room.getWalls());
                        this.room.drawTemporaryRoom(localPos.x, localPos.y);
                        this.wallsLayer.addChild(this.room.getWalls());
                    }
                }
            }
            else if (this.edit == editMode.WINDOW) {
                this.objectsLayer.addChild(this.wall.getObjects());
                this.wall.addChild(this.wall.getObjects());
            }
            else if (this.edit == editMode.DOOR) {
                this.objectsLayer.addChild(this.wall.getObjects());
                this.wall.addChild(this.wall.getObjects());
            }
            else if (this.edit == editMode.FURNITURE) {
                // this.objectsLayer.addChild(this.wall.getObjects());
            }
            else if (this.edit == editMode.ROOF) {
                if (this.isMouseDown) {
                    this.roof.drawTemporary(localPos.x, localPos.y);
                }
            }
        });
        this.stage.on('rightclick', (e) => {
            if (this.edit == editMode.NONE) {
                e.preventDefault();
                if (this.isMouseDown) {
                    if (this.drawMode == 'wall') {
                        this.wall.clearTemporary();
                    }
                    else {
                        this.room.clear();
                        this.wallsLayer.removeChild(this.room.getWalls());
                    }
                    this.isMouseDown = false;
                }
            }
            else if (this.edit == editMode.ROOF) {
                e.preventDefault();
                if (this.isMouseDown) {
                    this.roof.clearTemporary();
                    this.isMouseDown = false;
                }
            }
        });
    }
    // --- NEW: BIND HTML ZOOM BUTTONS ---
    bindZoomButtons() {
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        if (zoomInBtn)
            zoomInBtn.onclick = () => this.handleZoom(true);
        if (zoomOutBtn)
            zoomOutBtn.onclick = () => this.handleZoom(false);
    }
    // --- NEW: ZOOM LOGIC (Keep this exactly the same as before!) ---
    handleZoom(zoomIn) {
        const zoomSpeed = 0.2;
        const zoomFactor = zoomIn ? (1 + zoomSpeed) : (1 - zoomSpeed);
        // Zoom directly to the center of the canvas viewport
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const localX = (centerX - this.world.x) / this.world.scale.x;
        const localY = (centerY - this.world.y) / this.world.scale.y;
        this.world.scale.x *= zoomFactor;
        this.world.scale.y *= zoomFactor;
        this.world.x = centerX - localX * this.world.scale.x;
        this.world.y = centerY - localY * this.world.scale.y;
        // Keep infinite grid aligned
        this.board.syncGridToCamera(this.world.x, this.world.y, this.world.scale.x);
    }
    tryPermanentGripPoint(x, y) {
        if (this.edit == editMode.NONE) {
            let newPos = this.coords.snapToPoint(this.board, x, y);
            ;
            // if(this.coords.mode == SnapMode.GRID) newPos = this.coords.snapToPoint(this.board, x, y);
            // else newPos = [x, y];
            if (this.drawMode == 'wall') {
                this.drawPermanentGripPoint(this.wall, this.wall.drawPosition[0], this.wall.drawPosition[1], "start");
                this.drawPermanentGripPoint(this.wall, newPos[0], newPos[1], "end");
            }
            else {
                this.room.walls.forEach(wall => {
                    this.drawPermanentGripPoint(wall, wall.drawPosition[0], wall.drawPosition[1], "start");
                    this.drawPermanentGripPoint(wall, wall.endPosition[0], wall.endPosition[1], "end");
                });
            }
        }
        else if (this.edit == editMode.ROOF) {
            let newPos = this.coords.snapToPoint(this.board, x, y);
            ;
            // if(this.coords.mode == SnapMode.GRID) newPos = this.coords.snapToPoint(this.board, x, y);
            // else newPos = [x, y];
            this.drawPermanentGripPoint(this.roof, this.roof.drawPosition[0], this.roof.drawPosition[1], "start");
            this.drawPermanentGripPoint(this.roof, newPos[0], newPos[1], "end");
        }
    }
    drawPermanentGripPoint(wall, x, y, position) {
        if (this.edit == editMode.NONE) {
            let gp = new GripPoint([{ wall: wall, position: position }], this.board, this.model);
            let pos = gp.checkCoords(x, y);
            let exists = this.model.checkLinkage(pos) && this.wall.gripPoints.length > 0;
            if (!exists) {
                this.gripPoints.push(gp);
                wall.drawPermanentGripPoint(gp, x, y);
                for (var wall1 of this.walls) {
                    if (wall1.startPosition[0] == x && wall1.startPosition[1] == y) {
                        gp.walls.push({ wall: wall1, position: "start" });
                    }
                    else if (wall1.endPosition[0] == x && wall1.endPosition[1] == y) {
                        gp.walls.push({ wall: wall1, position: "end" });
                    }
                }
            }
            else {
                for (var gripPoint of this.gripPoints) {
                    if (gripPoint.center.x == x && gripPoint.center.y == y) {
                        gripPoint.walls.push({ wall: wall, position: position });
                    }
                }
            }
        }
        else if (this.edit == editMode.ROOF) {
            let gp = new GripPoint([{ wall: wall, position: position }], this.board, this.model);
            let pos = gp.checkCoords(x, y);
            let exists = this.model.checkLinkage(pos);
            if (!exists) {
                this.gripPoints.push(gp);
                wall.drawPermanentGripPoint(gp, x, y);
            }
            else {
                for (var gripPoint of this.gripPoints) {
                    if (gripPoint.center.x == x && gripPoint.center.y == y) {
                        gripPoint.walls.push({ wall: wall, position: position });
                    }
                }
            }
        }
    }
    updateRooms() {
        if (this.edit == editMode.NONE) {
            this.model.walls.forEach(wall1 => {
                this.walls.forEach(wall2 => {
                    if (wall1.wall.wallID == wall2.wallID) {
                        if (wall1.wall.roomID.length > 0) {
                            wall2.partOfRoomID = wall1.wall.roomID;
                        }
                    }
                });
            });
            // ---> FIX: WIPE ALL OLD GHOST LAYERS BEFORE REDRAWING <---
            this.roomsLayer.removeChildren();
            this.rooms = [];
            this.model.rooms.forEach(roomData => {
                let r = new Room();
                r.setup(this.model, this.board, this.spriteManager, this.coords.mode);
                r.roomID = roomData.room.roomID;
                this.roomsLayer.addChild(r);
                this.rooms.push(r); // Track it
                this.objectsLayer.addChild(r.getObjects());
                if (roomData.room.roomType)
                    r.setRoomType(roomData.room.roomType);
                r.createRoom(this.model.roomToCoords(roomData.room.roomID));
                let walls = this.model.getWallsFromRoom(roomData.room.roomID);
                walls.forEach(w1 => {
                    this.walls.forEach(w2 => {
                        if (w1.wall.wallID == w2.wallID) {
                            // Populate our new array!
                            if (!w2.connectedRooms)
                                w2.connectedRooms = [];
                            if (!w2.connectedRooms.includes(r))
                                w2.connectedRooms.push(r);
                            w2.room = r;
                        }
                    });
                });
            });
        }
        else if (this.edit == editMode.ROOF) {
            this.model.roof.forEach(wall1 => {
                this.roofs.forEach(wall2 => {
                    if (wall1.wall.wallID == wall2.wallID) {
                        if (wall1.wall.roomID.length > 0) {
                            wall2.partOfRoomID = wall1.wall.roomID;
                        }
                    }
                });
            });
        }
    }
    async clearBoard() {
        this.model.clearModel();
        await this.wallsLayer.children.forEach(async (wall) => { await this.wallsLayer.removeChild(wall); });
        await this.roofLayer.children.forEach(async (wall) => { await this.roofLayer.removeChild(wall); });
        await this.roomsLayer.children.forEach(async (wall) => { await this.roomsLayer.removeChild(wall); });
        await this.gripPointsLayer.children.forEach(async (wall) => { await this.gripPointsLayer.removeChild(wall); });
        await this.objectsLayer.children.forEach(async (wall) => { await this.objectsLayer.removeChild(wall); });
        this.walls = [];
        this.roofs = [];
        this.rooms = [];
        this.gripPoints = [];
        this.wall = new Wall();
        this.roof = new Roof();
        this.room = new Room();
    }
    buildModel(plan) {
        this.model.importPlan(plan);
        // 1. RECONSTRUCT WALLS
        this.model.walls.forEach(wallData => {
            this.wall = new Wall();
            this.wall.setup(this.model, this.board, this.spriteManager);
            this.wall.wallID = wallData.wall.wallID;
            this.wall.startPosition = [wallData.wall.startPoint.coordX, wallData.wall.startPoint.coordY];
            this.wall.endPosition = [wallData.wall.endPoint.coordX, wallData.wall.endPoint.coordY];
            this.wall.drawPosition = this.wall.startPosition;
            this.wall.partOfRoomID = wallData.wall.roomID;
            this.wall.clear();
            this.wall.moveToPoint(this.wall.startPosition[0], this.wall.startPosition[1]);
            this.wall.lineTo(this.wall.endPosition[0], this.wall.endPosition[1]);
            this.wall.stroke({ width: this.wall.lineWidth, color: this.wall.lineColor });
            this.walls.push(this.wall);
            this.wallsLayer.addChild(this.wall);
            this.objectsLayer.addChild(this.wall.getObjects());
        });
        // 2. GRIP POINTS
        const wallGripMap = new Map();
        this.walls.forEach(w => {
            const startKey = `${w.startPosition[0]},${w.startPosition[1]}`;
            const endKey = `${w.endPosition[0]},${w.endPosition[1]}`;
            if (!wallGripMap.has(startKey)) {
                let gp = new GripPoint([{ wall: w, position: "start" }], this.board, this.model);
                gp.drawPermanent(w.startPosition[0], w.startPosition[1]);
                wallGripMap.set(startKey, gp);
                this.gripPoints.push(gp);
                this.gripPointsLayer.addChild(gp);
                w.gripPoints.push(gp);
            }
            else {
                let gp = wallGripMap.get(startKey);
                gp.walls.push({ wall: w, position: "start" });
                w.gripPoints.push(gp);
            }
            if (!wallGripMap.has(endKey)) {
                let gp = new GripPoint([{ wall: w, position: "end" }], this.board, this.model);
                gp.drawPermanent(w.endPosition[0], w.endPosition[1]);
                wallGripMap.set(endKey, gp);
                this.gripPoints.push(gp);
                this.gripPointsLayer.addChild(gp);
                w.gripPoints.push(gp);
            }
            else {
                let gp = wallGripMap.get(endKey);
                gp.walls.push({ wall: w, position: "end" });
                w.gripPoints.push(gp);
            }
        });
        // 3. RECONSTRUCT DOORS
        this.model.objects.doors.forEach(doorData => {
            const targetWall = this.walls.find(w => w.wallID === doorData.door.partOfWall);
            if (targetWall) {
                let newDoor = new Door(targetWall, this.model, this.spriteManager);
                newDoor.setup();
                newDoor.doorID = doorData.door.doorID;
                newDoor.alpha = 1;
                newDoor.rotation = newDoor.checkAngle(targetWall);
                newDoor.x = doorData.door.centerPoint.coordX;
                newDoor.y = doorData.door.centerPoint.coordY - targetWall.lineWidth / 2;
                targetWall.objectsContainer.addChild(newDoor);
                this.objectsLayer.addChild(targetWall.getObjects());
            }
        });
        // 4. RECONSTRUCT WINDOWS
        this.model.objects.windows.forEach(windowData => {
            const targetWall = this.walls.find(w => w.wallID === windowData.window.partOfWall);
            if (targetWall) {
                let newWindow = new Window(targetWall, this.model, this.spriteManager);
                newWindow.setup();
                newWindow.alpha = 1;
                newWindow.rotation = newWindow.checkAngle(targetWall);
                newWindow.x = windowData.window.centerPoint.coordX;
                newWindow.y = windowData.window.centerPoint.coordY;
                targetWall.objects.push(newWindow);
                targetWall.objectsContainer.addChild(newWindow);
                this.objectsLayer.addChild(targetWall.getObjects());
            }
        });
        this.updateRooms();
        // 5. RECONSTRUCT FURNITURE
        if (plan.objects && plan.objects.furniture) {
            plan.objects.furniture.forEach(furnitureData => {
                console.log(`Attempting to draw furniture piece (Type ID: ${furnitureData.piece.typeID}) at X: ${furnitureData.piece.centerPoint.coordX}, Y: ${furnitureData.piece.centerPoint.coordY}`);
                const targetRoom = this.rooms.find(r => r.roomID === furnitureData.piece.partOfRoom);
                if (targetRoom) {
                    let newPiece = new Furniture(targetRoom, this.model, this.spriteManager, furnitureData.piece.typeID);
                    newPiece.setup();
                    newPiece.pieceID = furnitureData.piece.pieceID;
                    newPiece.alpha = 1;
                    newPiece.rotation = furnitureData.piece.rotation || 0;
                    newPiece.x = furnitureData.piece.centerPoint.coordX;
                    newPiece.y = furnitureData.piece.centerPoint.coordY;
                    targetRoom.objects.push(newPiece);
                    targetRoom.objectsContainer.addChild(newPiece);
                    newPiece.drawPermanent(furnitureData.piece.centerPoint.coordX, furnitureData.piece.centerPoint.coordY);
                    this.objectsLayer.addChild(targetRoom.getObjects());
                    console.log("✅ Successfully rendered furniture ID: " + furnitureData.piece.typeID);
                }
                else {
                    console.warn("⚠️ Could not find target room ID: " + furnitureData.piece.partOfRoom);
                }
            });
        }
        else {
            console.log("No furniture found in this plan.");
        }
        // 6. RECONSTRUCT ROOF
        const roofGripMap = new Map();
        this.model.roof.forEach(roofData => {
            this.roof = new Roof();
            this.roof.setup(this.model, this.board, this.spriteManager);
            this.roof.startPosition = [roofData.wall.startPoint.coordX, roofData.wall.startPoint.coordY];
            this.roof.endPosition = [roofData.wall.endPoint.coordX, roofData.wall.endPoint.coordY];
            this.roof.clear();
            this.roof.moveToPoint(this.roof.startPosition[0], this.roof.startPosition[1]);
            this.roof.lineTo(this.roof.endPosition[0], this.roof.endPosition[1]);
            this.roof.stroke({ width: 8, color: "0x530000" });
            this.roofs.push(this.roof);
            this.roofLayer.addChild(this.roof);
            this.roof.addChild(this.roof.getObjects());
            const startKey = `${this.roof.startPosition[0]},${this.roof.startPosition[1]}`;
            const endKey = `${this.roof.endPosition[0]},${this.roof.endPosition[1]}`;
            if (!roofGripMap.has(startKey)) {
                let gp = new GripPoint([{ wall: this.roof, position: "start" }], this.board, this.model);
                gp.drawPermanent(this.roof.startPosition[0], this.roof.startPosition[1]);
                roofGripMap.set(startKey, gp);
                this.gripPoints.push(gp);
                this.gripPointsLayer.addChild(gp);
                this.roof.gripPoints.push(gp);
            }
            else {
                let gp = roofGripMap.get(startKey);
                gp.walls.push({ wall: this.roof, position: "start" });
                this.roof.gripPoints.push(gp);
            }
            if (!roofGripMap.has(endKey)) {
                let gp = new GripPoint([{ wall: this.roof, position: "end" }], this.board, this.model);
                gp.drawPermanent(this.roof.endPosition[0], this.roof.endPosition[1]);
                roofGripMap.set(endKey, gp);
                this.gripPoints.push(gp);
                this.gripPointsLayer.addChild(gp);
                this.roof.gripPoints.push(gp);
            }
            else {
                let gp = roofGripMap.get(endKey);
                gp.walls.push({ wall: this.roof, position: "end" });
                this.roof.gripPoints.push(gp);
            }
        });
    }
    setSnapMode(mode) {
        this.rooms.forEach(room => {
            room.coords.changeSnapMode(mode);
        });
    }
    setDrawMode(mode) {
        this.drawMode = mode;
    }
    setEditMode(mode) {
        this.edit = mode;
        if (this.edit == editMode.GRIPPOINT) {
            this.walls.forEach(wall => {
                wall.setEditMode(mode);
                wall.gripPoints.forEach(gp => {
                    gp.setup(this.stage, true);
                });
            });
            this.roofs.forEach(roof => {
                roof.setEditMode(mode);
                roof.gripPoints.forEach(gp => {
                    gp.setup(this.stage, true);
                });
            });
        }
        else {
            this.walls.forEach(wall => {
                wall.setEditMode(mode);
                wall.gripPoints.forEach(gp => {
                    gp.setup(this.stage, false);
                });
            });
            this.roofs.forEach(roof => {
                roof.setEditMode(mode);
                roof.gripPoints.forEach(gp => {
                    gp.setup(this.stage, false);
                });
            });
            this.rooms.forEach(room => {
                room.setEditMode(mode);
            });
        }
    }
    async createFurnitureTexture(furnitureAsset) {
        this.spriteManager.createFurnitureTexture(furnitureAsset);
    }
    getModel() {
        return this.model;
    }
    getBoard() {
        return this.board;
    }
    toJSON() {
        return this.model.toJSON();
    }
}
