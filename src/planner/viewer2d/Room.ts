import * as PIXI from "pixi.js";
import { Wall } from "./Wall";
import { Coordinates } from "./Coordinates";
import { Board } from "./Board";
import { Model } from "../model/Model";
import { GripPoint } from "./GripPoint";

export class Room extends PIXI.Graphics {
    lineTempWidth: number;
    lineWidth: number;
    lineColor: string;
    strokeColor: string;
    roomID: number = -1;
    walls: Wall[] = []
    coords =  new Coordinates();
    drawPosition: number[] = [0,0];
    startPosition: number[] = [0,0];
    endPosition: number[] = [0,0];
    model: Model = new Model();
    board: Board = new Board();
    lineTempColor: string;
    gripPoints: GripPoint[] = [];

    
    constructor(roomID?: number, lineSize?: number, lineColor?: string) {
        super();
        this.roomID = roomID || -1;
        this.lineTempWidth = 2;
        this.lineWidth = lineSize || 5;
        this.lineTempColor = "0xFF0000";
        this.lineColor = lineColor || "0x530000";
        this.strokeColor = "0xC8BCAC";
    }
    setup(model: Model, board: Board) {
        this.model = model;
        this.board = board;
    }

    getGripPoints() : PIXI.Container {
        let c : PIXI.Container = new PIXI.Container;
        this.gripPoints.forEach(gp => {
            c.addChild(gp);
        });
        return c;
    }

    getWalls() : PIXI.Container {
        let c = new PIXI.Container();
        this.walls.forEach(w => {
            c.addChild(w);
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
    resetWalls () {
        this.walls = [];
    //    console.log("after reset: " + this.walls)
    }

    drawTemporaryRoom(x: number, y: number) {
        this.clear();
        this.resetWalls();
        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        this.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
        let wallN = new Wall();
        let wallS = new Wall();
        let wallE = new Wall();
        let wallW = new Wall();
        // wallN.setup(this.model, this.board);
        // wallS.setup(this.model, this.board);
        // wallE.setup(this.model, this.board);
        // wallW.setup(this.model, this.board);
        this.walls.push(wallN);
        this.walls.push(wallS);
        this.walls.push(wallE);
        this.walls.push(wallW);
        if(this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] < 0) { // II 
            wallN.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallN.drawTemporary(newPos[0], this.drawPosition[1]);
            wallE.moveToPoint(newPos[0], this.drawPosition[1]);
            wallE.drawTemporary(newPos[0], newPos[1]);
            wallS.moveToPoint(newPos[0], newPos[1]);
            wallS.drawTemporary(this.drawPosition[0], newPos[1]);
            wallW.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallW.drawTemporary(this.drawPosition[0], newPos[1]);
       //     this.rect(this.drawPosition[0], this.drawPosition[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] < 0) { // I
       //     this.rect(this.drawPosition[0], newPos[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
            wallN.moveToPoint(this.drawPosition[0], newPos[1]);
            wallN.drawTemporary(newPos[0], newPos[1]);
            wallE.moveToPoint(newPos[0], newPos[1]);
            wallE.drawTemporary(newPos[0], this.drawPosition[1]);
            wallS.moveToPoint(newPos[0], this.drawPosition[1]);
            wallS.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
            wallW.moveToPoint(this.drawPosition[0], newPos[1]);
            wallW.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] > 0) { // III
       //     this.rect(newPos[0], newPos[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
            wallN.moveToPoint(newPos[0], newPos[1]);
            wallN.drawTemporary(this.drawPosition[0], newPos[1]);
            wallE.moveToPoint(this.drawPosition[0], newPos[1]);
            wallE.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
            wallS.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallS.drawTemporary(newPos[0], this.drawPosition[1]);
            wallW.moveToPoint(newPos[0], newPos[1]);
            wallW.drawTemporary(newPos[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] > 0) { // IV
       //     this.rect(newPos[0], this.drawPosition[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
            wallN.moveToPoint(newPos[0], this.drawPosition[1]);
            wallN.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
            wallE.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallE.drawTemporary(this.drawPosition[0], newPos[1]);
            wallS.moveToPoint(this.drawPosition[0], newPos[1]);
            wallS.drawTemporary(newPos[0], newPos[1]);
            wallW.moveToPoint(newPos[0], this.drawPosition[1]);
            wallW.drawTemporary(newPos[0], newPos[1]);
        }
        
        //this.fill(0xC8BCAC);
        //this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
        this.drawTemporaryGripPoint(this.drawPosition[0], this.drawPosition[1]);
        this.drawTemporaryGripPoint(this.drawPosition[0], newPos[1]);
        this.drawTemporaryGripPoint(newPos[0], this.drawPosition[1]);
        this.drawTemporaryGripPoint(newPos[0], newPos[1]);
        
    }

    drawPermanentRoom(x: number, y: number) {
        this.clear();
        // this.resetWalls();
        // console.log(this.walls);

        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        this.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
        // let wallN = new Wall();
        // let wallS = new Wall();
        // let wallE = new Wall();
        // let wallW = new Wall();
        // wallN.setup(this.model, this.board);
        // wallS.setup(this.model, this.board);
        // wallE.setup(this.model, this.board);
        // wallW.setup(this.model, this.board);
        // this.walls.push(wallN);
        // this.walls.push(wallS);
        // this.walls.push(wallE);
        // this.walls.push(wallW);
        let wallN = this.walls[0];
        let wallS = this.walls[1];
        let wallE = this.walls[2];
        let wallW = this.walls[3];
        console.log(this.walls);
        if(this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] < 0) { // II 
            console.log("2");
            wallN.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallN.drawPermanent(newPos[0], this.drawPosition[1]);
            wallE.moveToPoint(newPos[0], this.drawPosition[1]);
            wallE.drawPermanent(newPos[0], newPos[1]);
            wallS.moveToPoint(newPos[0], newPos[1]);
            wallS.drawPermanent(this.drawPosition[0], newPos[1]);
            wallW.moveToPoint(this.drawPosition[0], newPos[1]);
            wallW.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
       //     this.rect(this.drawPosition[0], this.drawPosition[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] < 0) { // I
       //     this.rect(this.drawPosition[0], newPos[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
            console.log("1");

            wallN.moveToPoint(this.drawPosition[0], newPos[1]);
            wallN.drawPermanent(newPos[0], newPos[1]);
            wallE.moveToPoint(newPos[0], newPos[1]);
            wallE.drawPermanent(newPos[0], this.drawPosition[1]);
            wallS.moveToPoint(newPos[0], this.drawPosition[1]);
            wallS.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
            wallW.moveToPoint(this.drawPosition[0], newPos[1]);
            wallW.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] > 0) { // III
       //     this.rect(newPos[0], newPos[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
            console.log("3");

            wallN.moveToPoint(newPos[0], newPos[1]);
            wallN.drawPermanent(this.drawPosition[0], newPos[1]);
            wallE.moveToPoint(this.drawPosition[0], newPos[1]);
            wallE.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
            wallS.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallS.drawPermanent(newPos[0], this.drawPosition[1]);
            wallW.moveToPoint(newPos[0], newPos[1]);
            wallW.drawPermanent(newPos[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] > 0) { // IV
       //     this.rect(newPos[0], this.drawPosition[1], Math.abs(newPos[0] - this.drawPosition[0]), Math.abs(newPos[1] - this.drawPosition[1]));
            console.log("4");

            wallN.moveToPoint(newPos[0], this.drawPosition[1]);
            wallN.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
            wallE.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallE.drawPermanent(this.drawPosition[0], newPos[1]);
            wallS.moveToPoint(this.drawPosition[0], newPos[1]);
            wallS.drawPermanent(newPos[0], newPos[1]);
            wallW.moveToPoint(newPos[0], this.drawPosition[1]);
            wallW.drawPermanent(newPos[0], newPos[1]);
        }
        //this.export(this.drawPosition[0], this.drawPosition[1], newPos[0], newPos[1], 30);
        this.updateRoomID();
        console.log("RoomID: " + this.roomID)
        this.createRoom(this.model.roomToCoords(this.roomID));
        
        //this.fill(0xC8BCAC);
        //this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
        // this.drawPermanentGripPoint(this.drawPosition[0], this.drawPosition[1]);
        // this.drawTemporaryGripPoint(this.drawPosition[0], newPos[1]);
        // this.drawTemporaryGripPoint(newPos[0], this.drawPosition[1]);
        // this.drawTemporaryGripPoint(newPos[0], newPos[1]);       
    }

    updateRoomID() {
        let roomID : number[] = [];
        this.walls.forEach(wall =>{
            let r :number[] = [];
            r = this.walls[0].partOfRoomID.filter(roomID => wall.partOfRoomID.includes(roomID));
            if(roomID.includes(r[0])){
                this.roomID = r[0];
            } else roomID.push(r[0])
        })
        
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


    createRoom(walls: {startPoint: {coordX: number, coordY:number}; endPoint: {coordX: number, coordY:number};}[]){
         this.clear();  
        this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
        this.moveTo(walls[0].startPoint.coordX, walls[0].startPoint.coordY);
        console.log("aaa");

        walls.forEach(wall => {
           //console.log("wall: " + wall.startPoint.coordX + " " + wall.startPoint.coordY + ", " + wall.endPoint.coordX + " " + wall.endPoint.coordY)
            this.lineTo(wall.startPoint.coordX, wall.startPoint.coordY);
            this.lineTo(wall.endPoint.coordX, wall.endPoint.coordY);
        });
         this.fill(0xC8BCAC);
       //  this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
     }


     export(startPointX: number, startPointY: number, endPointX: number, endPointY: number, wallHeight: number){
        let wallN: number = 0, wallS: number = 0, wallE: number = 0, wallW: number = 0;
        let roomID = -1;
            if(startPointX < endPointX && startPointY > endPointY) { // I
                console.log("1");
                wallN = this.model.addToWalls(startPointX, endPointY, endPointX, endPointY, wallHeight).wall.wallID;
                wallS = this.model.addToWalls(startPointX, startPointY, endPointX, startPointY, wallHeight).wall.wallID;
                wallE = this.model.addToWalls(startPointX, startPointY, startPointX, endPointY, wallHeight).wall.wallID;
                wallW = this.model.addToWalls(endPointX, startPointY, endPointX, endPointY, wallHeight).wall.wallID;

                roomID = this.model.addToRooms([wallN, wallS, wallE, wallW]);
                this.roomID = roomID;
                this.model.updateWall(wallN, {
                    wall: {
                        wallID: wallN,
                        startPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallS, {
                    wall: {
                        wallID: wallS,
                        startPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallE, {
                    wall: {
                        wallID: wallE,
                        startPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallW, {
                    wall: {
                        wallID: wallW,
                        startPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
            } else if(startPointX < endPointX && startPointY < endPointY) { //II
                console.log("2");

                wallN = this.model.addToWalls(startPointX, startPointY, endPointX, startPointY, wallHeight).wall.wallID;
                wallS = this.model.addToWalls(startPointX, endPointY, endPointX, endPointY, wallHeight).wall.wallID;
                wallE = this.model.addToWalls(startPointX, endPointY, startPointX, startPointY, wallHeight).wall.wallID;
                wallW = this.model.addToWalls(endPointX, endPointY, endPointX, startPointY, wallHeight).wall.wallID;

                roomID = this.model.addToRooms([wallN, wallS, wallE, wallW]);
                this.roomID = roomID;
                this.model.updateWall(wallN, {
                    wall: {
                        wallID: wallN,
                        startPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallS, {
                    wall: {
                        wallID: wallS,
                        startPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallE, {
                    wall: {
                        wallID: wallE,
                        startPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallW, {
                    wall: {
                        wallID: wallW,
                        startPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
            } else if(startPointX > endPointX && startPointY > endPointY) { //III
                console.log("3");

                wallN = this.model.addToWalls(endPointX, endPointY, startPointX, endPointY, wallHeight).wall.wallID;
                wallS = this.model.addToWalls(endPointX, startPointY, startPointX, startPointY, wallHeight).wall.wallID;
                wallE = this.model.addToWalls(endPointX, startPointY, endPointX, endPointY, wallHeight).wall.wallID;
                wallW = this.model.addToWalls(startPointX, startPointY, startPointX, endPointY, wallHeight).wall.wallID;
                roomID = this.model.addToRooms([wallN, wallS, wallE, wallW]);
                this.roomID = roomID;
                this.model.updateWall(wallN, {
                    wall: {
                        wallID: wallN,
                        startPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallS, {
                    wall: {
                        wallID: wallS,
                        startPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallE, {
                    wall: {
                        wallID: wallE,
                        startPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallW, {
                    wall: {
                        wallID: wallW,
                        startPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
            } else { //if(startPointX > endPointX && startPointY < endPointY) { //IV
                console.log("4");

                wallN = this.model.addToWalls(endPointX, startPointY, startPointX, startPointY, wallHeight).wall.wallID;
                wallS = this.model.addToWalls(endPointX, endPointY, startPointX, endPointY, wallHeight).wall.wallID;
                wallE = this.model.addToWalls(endPointX, endPointY, endPointX, startPointY, wallHeight).wall.wallID;
                wallW = this.model.addToWalls(startPointX, endPointY, startPointX, startPointY, wallHeight).wall.wallID;
                roomID = this.model.addToRooms([wallN, wallS, wallE, wallW]);
                this.roomID = roomID;
                
                this.model.updateWall(wallN, {
                    wall: {
                        wallID: wallN,
                        startPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallS, {
                    wall: {
                        wallID: wallS,
                        startPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallE,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallW,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallE, {
                    wall: {
                        wallID: wallE,
                        startPoint: {
                            coordX: endPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: endPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
                this.model.updateWall(wallW, {
                    wall: {
                        wallID: wallW,
                        startPoint: {
                            coordX: startPointX,
                            coordY: endPointY
                        },
                        endPoint: {
                            coordX: startPointX,
                            coordY: startPointY
                        },
                        wallHeight: wallHeight,
                        linked: {
                            startPoint: [{
                                wallID: wallS,
                                roomID: this.roomID
                            }],
                            endPoint: [{
                                wallID: wallN,
                                roomID: this.roomID
                            }]
                        },
                        roomID: [roomID]
                    }
                });
            } 
            
            
        }
    }
