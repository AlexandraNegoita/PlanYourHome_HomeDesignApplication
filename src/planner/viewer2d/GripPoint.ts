import * as PIXI from "pixi.js";
import { Coordinates, SnapMode } from "./Coordinates";
import { Board } from "./Board";
import { Model } from "../model/Model";
import { Wall } from "./Wall";

export class GripPoint extends PIXI.Graphics {
    center : Coordinates = new Coordinates();
    lineTempWidth: number;
    lineWidth: number;
    lineTempColor: string;
    lineColor: string;
    lineWidthSelected: number;
    fillSelected: string;
    fillStandard: string;
    editMode: boolean = false;
    isGrabbing: boolean = false;
    partOfRoomID: number = -1;
    board: Board;
    model: Model;
    walls: {
        wall: Wall,
        position: string
    }[] = [];
    constructor(walls: {wall: Wall, position: string}[], board: Board, model: Model, lineSize?: number, lineColor?: string, snapMode?:SnapMode) {
        super();
        this.walls = walls;
        this.board = board;
        this.model = model;
        this.lineTempWidth = 2;
        this.lineWidth = lineSize || 2;
        this.lineWidthSelected = 4;
        this.fillSelected = "0x530000";
        this.fillStandard = "0xC8BCAC";
        this.lineTempColor = "0xFF0000";
        this.lineColor = lineColor || "0x530000";
        if(snapMode) this.center.changeSnapMode(snapMode);
    }
    setup(stage: PIXI.Container, editMode: boolean){
        this.editMode = editMode;
        if(editMode) {
            this.interactive = true;
            this.eventMode = 'dynamic';
            this.on('mouseover', this.hover);
            this.on('mousedown', this.grab);
            this.on('mouseup', this.cancelGrabbing);
            this.on('mouseout', this.standard);
            //this.on('pointerupoutside', this.hover);
            stage.on('mousemove', (e) => {
                this.grabbing(e.data.global.x, e.data.global.y);
            });
        } else {
            this.interactive = false;
            this.eventMode = "passive";
        }
    }
    setCenter (x: number, y: number) {
        this.center.x = x;
        this.center.y = y;
    }
    checkCoords(x: number, y: number) {
        return this.center.snapToPoint(this.board, x, y);
    }
    drawTemporary(x: number, y: number) {
        let newPos : number[] = this.center.snapToPoint(this.board, x, y);
        this.setCenter(newPos[0], newPos[1]);
        this.circle(newPos[0], newPos[1], 7);
        this.fill(this.fillStandard);        
        this.stroke({ width: this.lineTempWidth, color: this.lineTempColor });
    }
    drawPermanent(x: number, y: number) {
        this.clear();
        let newPos : number[] = this.center.snapToPoint(this.board, x, y);
        this.setCenter(newPos[0], newPos[1]);
        this.moveTo(newPos[0], newPos[1]);
        this.circle(newPos[0], newPos[1], 7);
        this.fill(this.fillStandard);        
        this.stroke({ width: this.lineWidth, color: this.lineColor });
    }
    hover() {
        if(!this.isGrabbing) {
            this.clear();
            this.circle(this.center.x, this.center.y, 9);
            this.fill(this.fillStandard);        
            this.stroke({ width: this.lineWidthSelected, color: this.lineColor });
        }
    }
    standard() {
        if(!this.isGrabbing) {
            this.clear();
            this.circle(this.center.x, this.center.y, 7);
            this.fill(this.fillStandard);        
            this.stroke({ width: this.lineWidth, color: this.lineColor });
        }
    }
    grab() {
        this.clear();
        this.circle(this.center.x, this.center.y, 9);
        this.fill(this.fillSelected);        
        this.stroke({ width: this.lineWidthSelected, color: this.lineColor });
        this.repositionWalls(this.center.x, this.center.y);

        if(!this.isGrabbing) this.isGrabbing = true;
    }
    cancelGrabbing() {
        //console.log("heeellloo");
        this.isGrabbing = false;
        this.repositionWalls(this.center.x, this.center.y);

    }
    grabbing(x: number, y: number) {
        //console.log(this.isGrabbing + " --- ");
        if(this.isGrabbing) {
            this.clear();
            let newPos : number[] = this.center.snapToPoint(this.board, x, y);
            this.setCenter(newPos[0], newPos[1]);
            this.moveTo(newPos[0], newPos[1]);
            this.circle(newPos[0], newPos[1], 9);
            this.repositionWalls(newPos[0], newPos[1]);
            this.fill(this.fillSelected);
            this.stroke({ width: this.lineWidthSelected, color: this.lineColor });
            //let newPos : number[] = this.coords.snapToPoint(this.board, x, y);console.log(newPos[0] + " ------- " + newPos[1]);
            // this.setCenter(newPos[0], newPos[1]);
            // //this.moveTo(newPos[0], newPos[1]);
            // this.circle(newPos[0], newPos[1], 9);
            // this.fill(this.fillSelected);        
            // this.stroke({ width: this.lineWidthSelected, color: this.lineColor });
        }
    }

    repositionWalls(x: number, y: number) {
        // let modifiedWallsModel = this.model.getLinkage([this.center.x, this.center.y]);
        // console.log("linked:  " + modifiedWallsModel)
        // modifiedWallsModel.forEach(wall => {
        //     // wall.wall.wall.graphics.clear();
        //     // wall.wall.wall.graphics.redraw(x, y);
        //     if(wall.linkedPoint == "start") {
        //         this.model.updateWallEndPoint(wall.wall.wall.wallID, x, y);
        //     } else {
        //         this.model.updateWallStartPoint(wall.wall.wall.wallID, x, y);
        //     }
        //     //new Wall().drawPermanent(x, y);
        // })
        this.walls.forEach(wall => {
            wall.wall.clear();
            wall.wall.room?.clear();
            wall.wall.redraw(x, y, wall.position);
        });
        
    }

}