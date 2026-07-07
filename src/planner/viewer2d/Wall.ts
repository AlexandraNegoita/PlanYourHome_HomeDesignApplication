import * as PIXI from "pixi.js";
import { Board } from "./Board";
import { Model } from "../model/Model";
import { GripPoint } from "./GripPoint";
import { Coordinates } from "./Coordinates";
import { Room } from "./Room";
import { editMode } from "./Viewer2D";
import { Window } from "./Window";
import { SpriteManager } from "./SpriteManager";
import { Door } from "./Door";
import { Object } from "./Object";
export class Wall extends PIXI.Graphics {
    wallID: number = 0;
    model: Model = new Model();
    board: Board = new Board();
    coords: Coordinates = new Coordinates();
    editMode: editMode = editMode.NONE;
    drawPosition: number[] = [0,0];
    startPosition: number[] = [0,0];
    endPosition: number[] = [0,0];
    lineTempWidth: number;
    lineTempColor: string;
    lineWidth: number;
    lineColor: string;
    gripPoints: GripPoint[] = [];
    partOfRoomID: number[] = [];
    public connectedRooms: Room[] = []; // <--- ADD THIS LINE
    room : Room | undefined = undefined; // (Keep your old one)
    objects: Object[] = [];
    objectsContainer: PIXI.Container = new PIXI.Container;
    spriteManager: SpriteManager = new SpriteManager();
    window: Window = new Window(this, this.model, this.spriteManager);
    door: Door = new Door(this, this.model, this.spriteManager);

    constructor(lineSize?: number, lineColor?: string) {
        super();
        this.lineTempWidth = 2;
        this.lineWidth = lineSize || 8;
        this.lineTempColor = "0xFF0000";
        this.lineColor = lineColor || "0x530000";
    }
    setup(model: Model, board: Board, spriteManager: SpriteManager) {
        this.model = model;
        this.board = board;
        this.spriteManager = spriteManager;
    }
    setEditMode(em: editMode) {
        this.editMode = em;
        if(this.editMode == editMode.WINDOW) {
            this.removeAllListeners();
            this.interactive = true;
            this.eventMode = 'dynamic';
            this.on('click', (e) => this.drawPermanentWindow(e.data.global.x, e.data.global.y));
            this.on('mouseout', this.clearWindow);
            //this.on('pointerupoutside', this.hover);
            this.on('mousemove', (e) => {
                this.drawTemporaryWindow(e.data.global.x, e.data.global.y);
            });
        } else if(this.editMode == editMode.DOOR) {
            this.removeAllListeners();
            this.interactive = true;
            this.eventMode = 'dynamic';
            this.on('click', (e) => this.drawPermanentDoor(e.data.global.x, e.data.global.y));
            this.on('mouseout', this.clearDoor);
            //this.on('pointerupoutside', this.hover);
            this.on('mousemove', (e) => {
                this.drawTemporaryDoor(e.data.global.x, e.data.global.y);
            });
        }
        else {
            this.interactive = false;
            this.eventMode = "passive";
        }
    }
    getObjects() : PIXI.Container {
        this.objects.forEach(o => {
            this.objectsContainer.addChild(o);
        });
        return this.objectsContainer;
    }
    getGripPoints() : PIXI.Container {
        let c : PIXI.Container = new PIXI.Container;
        this.gripPoints.forEach(gp => {
            c.addChild(gp);
        });
        return c;
    }
     getDrawPosition() {
        return this.drawPosition;
    }
    moveToPoint(x: number, y: number): this {
        this.drawPosition = this.coords.snapToPoint(this.board, x, y);
		return super.moveTo(x, y);
	}
    lineTo(x: number, y: number): this {
		return super.lineTo(x, y);
	}

    drawTemporary(x: number, y: number) {
            this.drawTemporaryWall(x, y);
    }
    drawPermanent(x: number, y: number) {
            this.drawPermanentWall(x, y);
    }
 
    drawTemporaryWall(x: number, y: number) {
        this.clear();
        //const points = mouse_points.map((val, index) => val || this.points[index]);
        //this.points = points;
        this.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
        
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        this.lineTo(newPos[0], newPos[1]);
        this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
        this.drawTemporaryGripPoint(this.drawPosition[0], this.drawPosition[1]);
        this.drawTemporaryGripPoint(newPos[0], newPos[1]);
    }
    drawPermanentWall(x: number, y: number) {
        this.clear();
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        //console.log(x, y, newPos[0], newPos[1], this.drawPosition[0], this.drawPosition[1]);
        this.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
        
      
        this.lineTo(newPos[0], newPos[1]);
        this.endPosition = newPos;
        this.startPosition = this.drawPosition;
        this.stroke({ width: this.lineWidth, color: this.lineColor });
        let id = this.model.checkClosedPolygon(this.export(this.drawPosition[0], this.drawPosition[1], newPos[0], newPos[1], 100));
        //let id = this.model.initiateRoomDetection();
        // let ID = this.model.findWallByID(this.wallID)?.wall.roomID;
        if(id != -1) this.partOfRoomID.push(id);// else this.partOfRoomID = -1;
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

    checkSin(x1: number, y1: number, x2: number, y2: number) {
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

   redraw(x: number, y: number, position: string) {
        this.clear();
        
        if (position == "start") {
            this.moveToPoint(this.endPosition[0], this.endPosition[1]);
            this.lineTo(x, y);
            this.startPosition = [x, y];
        } else {
            this.moveToPoint(this.startPosition[0], this.startPosition[1]);
            this.lineTo(x, y);
            this.endPosition = [x, y];
        }
        
        this.stroke({ width: this.lineWidth, color: this.lineColor });

        // Update doors and windows so they move with the wall
        for(let i = 0; i < this.objects.length; i++){
            let midPoint = this.calculatePointOnLine(
                this.endPosition[0], this.endPosition[1], 
                this.startPosition[0], this.startPosition[1]
            );
            this.objects[i].x = midPoint.coordX;
            this.objects[i].y = midPoint.coordY;
            this.objects[i].rotation = this.checkAngle();
            this.objects[i].update();
        }

        this.updateCoords(this.startPosition[0], this.startPosition[1], this.endPosition[0], this.endPosition[1]);
        
        // RE-DRAW FLOORS (FIXED TO CLEAR ALL ATTACHED GHOSTS)
        if (this.partOfRoomID.length > 0) {
            if (this.connectedRooms && this.connectedRooms.length > 0) {
                // 1. Wipe every floor touching this wall
                this.connectedRooms.forEach(r => r.clear());
                
                // 2. Redraw the new shapes onto the graphics objects
                this.partOfRoomID.forEach((roomID, idx) => {
                    let targetGraphic = this.connectedRooms[idx] || this.connectedRooms[0];
                    if (targetGraphic) {
                        targetGraphic.createRoom(this.model.roomToCoords(roomID));
                    }
                });
            } else if (this.room) { // Fallback just in case
                this.room.clear(); 
                this.partOfRoomID.forEach(p => this.room?.createRoom(this.model.roomToCoords(p)));
            }
        }
    }

    tryRoom(x: number, y: number){
        console.log("room try");
        //let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        
        if(this.partOfRoomID.length > 0) {
          //  console.log(this.model.toJSON());
          if(this.room) {
            console.log("room defined")
            this.room.clear();
            this.partOfRoomID.forEach(p=>this.room?.createRoom(this.model.roomToCoords(p)));
          }
           
        }
    }

    drawTemporaryGripPoint(x: number, y: number) {
        this.circle(x, y, 7);
        this.fill(0xC8BCAC);        
        this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
    }

    drawPermanentGripPoint(gp: GripPoint, x: number, y: number) {
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        this.gripPoints.push(gp);
        // console.log("draw: " + newPos[0] + " " + newPos[1]);
        gp.drawPermanent(newPos[0], newPos[1]);
    }


    calculateDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
        return {
           coordX:  Math.sqrt(Math.pow(x1 - x2, 2)),
           coordY:  Math.sqrt(Math.pow(y1 - y2, 2))
        };
    }

    calculatePointOnLine(x1: number, y1: number, x2: number, y2: number) {
        return {
           coordX:  (x1 + x2) / 2,
           coordY:  (y1 +  y2) / 2
        };
    }

    drawTemporaryWindow(x: number, y: number) {
        if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
        if(this.objects.includes(this.window))  this.objects.splice(this.objects.indexOf(this.window), 1);

        this.window.destroy();
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        this.window = new Window(this, this.model, this.spriteManager);
        this.window.setup();
        this.objectsContainer.addChild(this.window);
       //console.log(this.objects);
        this.window.drawTemporary(newPos[0], newPos[1]);
        //this.window.drawPermanent(x, y);

    }

    drawPermanentWindow(x: number, y: number) {
       // if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
       // this.window = new Window(this, this.model, this.spriteManager);
       // this.window.setup();
        this.objects.push(this.window);
        this.objectsContainer.addChild(this.window);
        this.window.drawPermanent(newPos[0], newPos[1]);
        console.log("obj:" + this.objects);
        //this.window.drawPermanent(x, y);

        this.window = new Window(this, this.model, this.spriteManager);
    }

    clearWindow() {
        if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
    }


    drawTemporaryDoor(x: number, y: number) {
        if(this.objectsContainer.children.includes(this.door)) this.objectsContainer.removeChild(this.door);
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        this.door = new Door(this, this.model, this.spriteManager);
        this.door.setup();
        this.objectsContainer.addChild(this.door);
       //console.log(this.objects);
        this.door.drawTemporary(newPos[0], newPos[1]);
        //this.window.drawPermanent(x, y);

    }

    drawPermanentDoor(x: number, y: number) {
       // if(this.objectsContainer.children.includes(this.window)) this.objectsContainer.removeChild(this.window);
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
       // this.window = new Window(this, this.model, this.spriteManager);
       // this.window.setup();
        this.objects.push(this.door);
        this.objectsContainer.addChild(this.door);
        this.door.drawPermanent(newPos[0], newPos[1]);
        //this.window.drawPermanent(x, y);

        this.door = new Door(this, this.model, this.spriteManager);
    }

    clearDoor() {
        if(this.objectsContainer.children.includes(this.door)) this.objectsContainer.removeChild(this.door);
    }

    clearTemporary() {
        this.clear();
      //  this.stroke({ width: this.lineWidth, color: this.lineColor });
    }


    export(startPointX: number, startPointY: number, endPointX: number, endPointY: number, wallHeight: number){
        let ret =  this.model.addToWalls(startPointX, startPointY, endPointX, endPointY, wallHeight);
        this.wallID = ret.wall.wallID;
        return ret;
    }

        updateCoords(startPointX: number, startPointY: number, endPointX: number, endPointY: number) {
            this.model.walls.forEach(wall => {
                if(wall.wall.wallID == this.wallID) {
                    this.model.updateWall(this.wallID, {
                        wall: {
                            wallID: this.wallID,
                            startPoint: {
                                coordX: startPointX,
                                coordY: startPointY
                            },
                            endPoint: {
                                coordX: endPointX,
                                coordY: endPointY
                            },
                            wallHeight: wall.wall.wallHeight,
                            linked: {
                                startPoint: wall.wall.linked.startPoint,
                                endPoint: wall.wall.linked.endPoint
                            },
                            roomID: wall.wall.roomID
                        }
                    })
                }
            })
        }
        
       
}
