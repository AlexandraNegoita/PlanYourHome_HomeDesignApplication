import * as PIXI from "pixi.js";
import { Board } from "./Board";
import { Model } from "../model/Model";
import { Coordinates } from "./Coordinates";
import { editMode } from "./Viewer2D";
import { SpriteManager } from "./SpriteManager";
import { Wall } from "./Wall";
export class Roof extends Wall {
    wallID = 0;
    model = new Model();
    board = new Board();
    coords = new Coordinates();
    editMode = editMode.NONE;
    drawPosition = [0, 0];
    startPosition = [0, 0];
    endPosition = [0, 0];
    lineTempWidth;
    lineTempColor;
    lineWidth;
    lineColor;
    gripPoints = [];
    partOfRoomID = [];
    room = undefined;
    objects = [];
    objectsContainer = new PIXI.Container;
    spriteManager = new SpriteManager();
    // window: Window = new Window(this, this.model, this.spriteManager);
    // door: Door = new Door(this, this.model, this.spriteManager);
    constructor(lineSize, lineColor) {
        super();
        this.lineTempWidth = 2;
        this.lineWidth = lineSize || 8;
        this.lineTempColor = "0x000022";
        this.lineColor = lineColor || "0x000052";
    }
    setup(model, board, spriteManager) {
        this.model = model;
        this.board = board;
        this.spriteManager = spriteManager;
    }
    setEditMode(em) {
        this.editMode = em;
        if (this.editMode == editMode.WINDOW) {
            this.removeAllListeners();
            this.interactive = true;
            this.eventMode = 'dynamic';
            // this.on('click', (e) => this.drawPermanentWindow(e.data.global.x, e.data.global.y));
            // this.on('mouseout', this.clearWindow);
            //this.on('pointerupoutside', this.hover);
            // this.on('mousemove', (e) => {
            //     this.drawTemporaryWindow(e.data.global.x, e.data.global.y);
            // });
        }
        else if (this.editMode == editMode.DOOR) {
            this.removeAllListeners();
            this.interactive = true;
            this.eventMode = 'dynamic';
            // this.on('click', (e) => this.drawPermanentDoor(e.data.global.x, e.data.global.y));
            // this.on('mouseout', this.clearDoor);
            // //this.on('pointerupoutside', this.hover);
            // this.on('mousemove', (e) => {
            //     this.drawTemporaryDoor(e.data.global.x, e.data.global.y);
            // });
        }
        else {
            this.interactive = false;
            this.eventMode = "passive";
        }
    }
    getObjects() {
        this.objects.forEach(o => {
            this.objectsContainer.addChild(o);
        });
        return this.objectsContainer;
    }
    getGripPoints() {
        let c = new PIXI.Container;
        this.gripPoints.forEach(gp => {
            c.addChild(gp);
        });
        return c;
    }
    getDrawPosition() {
        return this.drawPosition;
    }
    moveToPoint(x, y) {
        this.drawPosition = this.coords.snapToPoint(this.board, x, y);
        return super.moveTo(x, y);
    }
    lineTo(x, y) {
        return super.lineTo(x, y);
    }
    drawTemporary(x, y) {
        this.drawTemporaryWall(x, y);
    }
    drawPermanent(x, y) {
        this.drawPermanentWall(x, y);
    }
    drawTemporaryWall(x, y) {
        this.clear();
        //const points = mouse_points.map((val, index) => val || this.points[index]);
        //this.points = points;
        this.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
        let newPos = this.coords.snapToPoint(this.board, x, y);
        this.lineTo(newPos[0], newPos[1]);
        this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
        this.drawTemporaryGripPoint(this.drawPosition[0], this.drawPosition[1]);
        this.drawTemporaryGripPoint(newPos[0], newPos[1]);
    }
    drawPermanentWall(x, y) {
        this.clear();
        let newPos = this.coords.snapToPoint(this.board, x, y);
        //console.log(x, y, newPos[0], newPos[1], this.drawPosition[0], this.drawPosition[1]);
        this.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
        this.lineTo(newPos[0], newPos[1]);
        this.endPosition = newPos;
        this.startPosition = this.drawPosition;
        this.stroke({ width: this.lineWidth, color: this.lineColor });
        let id = this.model.checkClosedPolygon(this.export(this.drawPosition[0], this.drawPosition[1], newPos[0], newPos[1], 100));
        //let id = this.model.initiateRoomDetection();
        // let ID = this.model.findWallByID(this.wallID)?.wall.roomID;
        if (id != -1)
            this.partOfRoomID.push(id); // else this.partOfRoomID = -1;
        console.log("ID: " + this.wallID + " : " + id);
        // console.log("before check");
        //this.tryRoom(newPos[0], newPos[1]);
        // this.export(this.drawPosition[0], this.drawPosition[1], newPos[0], newPos[1], 30);
    }
    checkAngle() {
        //distance
        var wall1X = (this.x + 0.5) - (this.x - 0.5);
        var wall1Y = 0; //this.y - this.y
        var wall2X = this.endPosition[0] - this.startPosition[0];
        var wall2Y = this.endPosition[1] - this.startPosition[1];
        var angle = Math.atan2(wall1X * wall2Y - wall1Y * wall2X, wall1X * wall2X + wall1Y * wall2Y);
        // if(angle < 0) {angle = angle * -1;}
        var degree_angle = 180 - angle * (180 / Math.PI);
        return angle;
        //if(degree_angle > 90) return false;
        //return true;
    }
    checkSin(x1, y1, x2, y2) {
        //distance
        var wall1X = (x1 + 0.5) - (x2 - 0.5);
        var wall1Y = 0; //this.y - this.y
        var wall2X = this.startPosition[0] - this.endPosition[0];
        var wall2Y = this.startPosition[1] - this.endPosition[1];
        var angle = Math.atan2(wall1X * wall2Y - wall1Y * wall2X, wall1X * wall2X + wall1Y * wall2Y);
        // if(angle < 0) {angle = angle * -1;}
        var degree_angle = 180 - angle * (180 / Math.PI);
        return angle;
        //if(degree_angle > 90) return false;
        //return true;
    }
    // redraw(x: number, y: number, position: string) {
    //     this.clear();
    //     if(position == "start") {
    //         let distances: { coordX: number; coordY: number }[] = [];
    //         for(let i = 0; i < this.objects.length; i++){
    //             distances.push({
    //                 coordX: Math.abs(this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordX - this.objects[i].x),
    //                 coordY: Math.abs(this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordY - this.objects[i].y)
    //             });
    //         };
    //         this.moveToPoint(this.endPosition[0], this.endPosition[1]);
    //         this.lineTo(x, y);
    //         this.startPosition = [x, y];
    //         this.stroke({ width: this.lineWidth, color: this.lineColor });
    //         for(let i = 0; i < this.objects.length; i++){
    //             console.log("Unghi: " + (180 - this.checkAngle() * (180 / Math.PI)) + " --- i: " + i);
    //             //if(distances[i].coordY == 0) distances[i].coordY = this.lineWidth;
    //             //else distances[i].coordY -= this.lineWidth
    //             this.objects[i].x =  this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordX //> this.objects[i].x? this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordX- distances[i].coordX+this.lineWidth : this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordX+ distances[i].coordX-this.lineWidth;
    //             this.objects[i].y =  this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordY //> this.objects[i].y? this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordY- distances[i].coordY+this.lineWidth : this.calculatePointOnLine(this.endPosition[0], this.endPosition[1], this.startPosition[0], this.startPosition[1]).coordY+ distances[i].coordY-this.lineWidth;
    //             this.objects[i].rotation = this.checkAngle();
    //             this.objects[i].update();
    //         };
    //     } else {
    //         this.moveToPoint(this.startPosition[0], this.startPosition[1]);
    //         this.lineTo(x, y);
    //         this.endPosition = [x, y];
    //         this.stroke({ width: this.lineWidth, color: this.lineColor });
    //     }
    //     this.updateCoords(this.startPosition[0], this.startPosition[1], this.endPosition[0], this.endPosition[1]);
    //     console.log("ID: " + this.partOfRoomID);
    //     if(this.partOfRoomID.length > 0 && this.room) this.partOfRoomID.forEach(p=>this.room?.createRoom(this.model.roomToCoords(p)));
    // }
    tryRoom(x, y) {
        console.log("room try");
        //let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        if (this.partOfRoomID.length > 0) {
            //  console.log(this.model.toJSON());
            if (this.room) {
                console.log("room defined");
                this.room.clear();
                this.partOfRoomID.forEach(p => this.room?.createRoom(this.model.roomToCoords(p)));
            }
        }
    }
    drawTemporaryGripPoint(x, y) {
        this.circle(x, y, 7);
        this.fill(0xC8BCAC);
        this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
    }
    drawPermanentGripPoint(gp, x, y) {
        let newPos = this.coords.snapToPoint(this.board, x, y);
        this.gripPoints.push(gp);
        // console.log("draw: " + newPos[0] + " " + newPos[1]);
        gp.drawPermanent(newPos[0], newPos[1]);
    }
    calculateDistanceBetweenPoints(x1, y1, x2, y2) {
        return {
            coordX: Math.sqrt(Math.pow(x1 - x2, 2)),
            coordY: Math.sqrt(Math.pow(y1 - y2, 2))
        };
    }
    calculatePointOnLine(x1, y1, x2, y2) {
        return {
            coordX: (x1 + x2) / 2,
            coordY: (y1 + y2) / 2
        };
    }
    // drawTemporaryWindow(x: number, y: number) {
    //     if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
    //     if(this.objects.includes(this.window))  this.objects.splice(this.objects.indexOf(this.window), 1);
    //     this.window.destroy();
    //     let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
    //     this.window = new Window(this, this.model, this.spriteManager);
    //     this.window.setup();
    //     this.objectsContainer.addChild(this.window);
    //    //console.log(this.objects);
    //     this.window.drawTemporary(newPos[0], newPos[1]);
    //     //this.window.drawPermanent(x, y);
    // }
    // drawPermanentWindow(x: number, y: number) {
    //    // if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
    //     let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
    //    // this.window = new Window(this, this.model, this.spriteManager);
    //    // this.window.setup();
    //     this.objects.push(this.window);
    //     this.objectsContainer.addChild(this.window);
    //     this.window.drawPermanent(newPos[0], newPos[1]);
    //     console.log("obj:" + this.objects);
    //     //this.window.drawPermanent(x, y);
    //     this.window = new Window(this, this.model, this.spriteManager);
    // }
    // clearWindow() {
    //     if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
    // }
    // drawTemporaryDoor(x: number, y: number) {
    //     if(this.objectsContainer.children.includes(this.door)) this.objectsContainer.removeChild(this.door);
    //     let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
    //     this.door = new Door(this, this.model, this.spriteManager);
    //     this.door.setup();
    //     this.objectsContainer.addChild(this.door);
    //    //console.log(this.objects);
    //     this.door.drawTemporary(newPos[0], newPos[1]);
    //     //this.window.drawPermanent(x, y);
    // }
    // drawPermanentDoor(x: number, y: number) {
    //    // if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
    //     let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
    //    // this.window = new Window(this, this.model, this.spriteManager);
    //    // this.window.setup();
    //     this.objects.push(this.door);
    //     this.objectsContainer.addChild(this.door);
    //     this.door.drawPermanent(newPos[0], newPos[1]);
    //     //this.window.drawPermanent(x, y);
    //     this.door = new Door(this, this.model, this.spriteManager);
    // }
    // clearDoor() {
    //     if(this.objectsContainer.children.includes(this.door)) this.objectsContainer.removeChild(this.door);
    // }
    clearTemporary() {
        this.clear();
        //  this.stroke({ width: this.lineWidth, color: this.lineColor });
    }
    export(startPointX, startPointY, endPointX, endPointY, wallHeight) {
        let ret = this.model.addToRoof(startPointX, startPointY, endPointX, endPointY, wallHeight);
        this.wallID = ret.wall.wallID;
        return ret;
    }
}
