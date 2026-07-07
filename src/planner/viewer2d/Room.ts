import * as PIXI from "pixi.js";
import { Wall } from "./Wall";
import { Coordinates, SnapMode } from "./Coordinates";
import { Object } from "./Object";
import { Board } from "./Board";
import { Model } from "../model/Model";
import { GripPoint } from "./GripPoint";
import { Furniture } from "./Furniture";
import { SpriteManager } from "./SpriteManager";
import { editMode } from "./Viewer2D";

export class Room extends PIXI.Graphics {
    lineTempWidth: number;
    lineWidth: number;
    lineColor: string;
    strokeColor: string;
    roomID: number = -1;
    roomType: string = "";
    roomLabel?: PIXI.Text;
    walls: Wall[] = []
    coords =  new Coordinates();
    editMode: editMode = editMode.NONE;
    drawPosition: number[] = [0,0];
    startPosition: number[] = [0,0];
    endPosition: number[] = [0,0];
    model: Model = new Model();
    board: Board = new Board();
    lineTempColor: string;
    gripPoints: GripPoint[] = [];
    spriteManager: SpriteManager = new SpriteManager();
    objects: Object[] = [];
    objectsContainer: PIXI.Container = new PIXI.Container;
    currentFurnitureType: number = 1;
    furniturePiece: Furniture = new Furniture(this, this.model, this.spriteManager, this.currentFurnitureType);
    currentFurnitureRotation: number = 0;

    
    constructor(roomID?: number, lineSize?: number, lineColor?: string, snapMode?: SnapMode) {
        super();
        this.roomID = roomID || -1;
        this.lineTempWidth = 2;
        this.lineWidth = lineSize || 5;
        this.lineTempColor = "0xFF0000";
        this.lineColor = lineColor || "0x530000";
        this.strokeColor = "0xC8BCAC";
        if(snapMode) this.coords.changeSnapMode(snapMode);
    }
    setup(model: Model, board: Board, spriteManager: SpriteManager, snapMode: SnapMode) {
        this.model = model;
        this.board = board;
        this.spriteManager = spriteManager;
        this.coords.changeSnapMode(snapMode);
    }

    setRoomType(type: string) {
        this.roomType = type;
    }

    private formatRoomType(type: string): string {
        if (!type) return "";
        return type.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    setEditMode(em: editMode) {
        this.editMode = em;
        if(this.editMode == editMode.FURNITURE) {
            this.removeAllListeners();
            this.interactive = true;
            this.eventMode = 'dynamic';
            window.addEventListener('keydown', this.handleKeyDown);
            this.on('click', (e) => {
                if(this.parent){
                    let localPos = e.data.getLocalPosition(this.parent);
                    this.drawPermanentFurniture(localPos.x, localPos.y);
                }
            });
            this.on('mouseout', this.clearFurniture);
            this.on('mousemove', (e) => {
                if(this.parent) {
                    let localPos = e.data.getLocalPosition(this.parent);
                    this.drawTemporaryFurniture(localPos.x, localPos.y);
                }
            });
        } 
        else {
            this.interactive = false;
            this.eventMode = "passive";
             window.removeEventListener('keydown', this.handleKeyDown);
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
        
        
        
        
        this.walls.push(wallN);
        this.walls.push(wallS);
        this.walls.push(wallE);
        this.walls.push(wallW);
        if(this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] < 0) { 
            wallN.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallN.drawTemporary(newPos[0], this.drawPosition[1]);
            wallE.moveToPoint(newPos[0], this.drawPosition[1]);
            wallE.drawTemporary(newPos[0], newPos[1]);
            wallS.moveToPoint(newPos[0], newPos[1]);
            wallS.drawTemporary(this.drawPosition[0], newPos[1]);
            wallW.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallW.drawTemporary(this.drawPosition[0], newPos[1]);
       
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] < 0) { 
       
            wallN.moveToPoint(this.drawPosition[0], newPos[1]);
            wallN.drawTemporary(newPos[0], newPos[1]);
            wallE.moveToPoint(newPos[0], newPos[1]);
            wallE.drawTemporary(newPos[0], this.drawPosition[1]);
            wallS.moveToPoint(newPos[0], this.drawPosition[1]);
            wallS.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
            wallW.moveToPoint(this.drawPosition[0], newPos[1]);
            wallW.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] > 0) { 
       
            wallN.moveToPoint(newPos[0], newPos[1]);
            wallN.drawTemporary(this.drawPosition[0], newPos[1]);
            wallE.moveToPoint(this.drawPosition[0], newPos[1]);
            wallE.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
            wallS.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallS.drawTemporary(newPos[0], this.drawPosition[1]);
            wallW.moveToPoint(newPos[0], newPos[1]);
            wallW.drawTemporary(newPos[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] > 0) { 
       
            wallN.moveToPoint(newPos[0], this.drawPosition[1]);
            wallN.drawTemporary(this.drawPosition[0], this.drawPosition[1]);
            wallE.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallE.drawTemporary(this.drawPosition[0], newPos[1]);
            wallS.moveToPoint(this.drawPosition[0], newPos[1]);
            wallS.drawTemporary(newPos[0], newPos[1]);
            wallW.moveToPoint(newPos[0], this.drawPosition[1]);
            wallW.drawTemporary(newPos[0], newPos[1]);
        }
        
        
        
        this.drawTemporaryGripPoint(this.drawPosition[0], this.drawPosition[1]);
        this.drawTemporaryGripPoint(this.drawPosition[0], newPos[1]);
        this.drawTemporaryGripPoint(newPos[0], this.drawPosition[1]);
        this.drawTemporaryGripPoint(newPos[0], newPos[1]);
        
    }

    drawPermanentRoom(x: number, y: number) {
        this.clear();
        
        

        let newPos : number[] = this.coords.snapToPoint(this.board, x, y);
        this.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
        
        
        
        
        
        
        
        
        
        
        
        
        let wallN = this.walls[0];
        let wallS = this.walls[1];
        let wallE = this.walls[2];
        let wallW = this.walls[3];
        console.log(this.walls);
        if(this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] < 0) { 
            console.log("2");
            wallN.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallN.drawPermanent(newPos[0], this.drawPosition[1]);
            wallE.moveToPoint(newPos[0], this.drawPosition[1]);
            wallE.drawPermanent(newPos[0], newPos[1]);
            wallS.moveToPoint(newPos[0], newPos[1]);
            wallS.drawPermanent(this.drawPosition[0], newPos[1]);
            wallW.moveToPoint(this.drawPosition[0], newPos[1]);
            wallW.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
       
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] < 0) { 
       
            console.log("1");

            wallN.moveToPoint(this.drawPosition[0], newPos[1]);
            wallN.drawPermanent(newPos[0], newPos[1]);
            wallE.moveToPoint(newPos[0], newPos[1]);
            wallE.drawPermanent(newPos[0], this.drawPosition[1]);
            wallS.moveToPoint(newPos[0], this.drawPosition[1]);
            wallS.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
            wallW.moveToPoint(this.drawPosition[0], newPos[1]);
            wallW.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] > 0 && this.drawPosition[0] - newPos[0] > 0) { 
       
            console.log("3");

            wallN.moveToPoint(newPos[0], newPos[1]);
            wallN.drawPermanent(this.drawPosition[0], newPos[1]);
            wallE.moveToPoint(this.drawPosition[0], newPos[1]);
            wallE.drawPermanent(this.drawPosition[0], this.drawPosition[1]);
            wallS.moveToPoint(this.drawPosition[0], this.drawPosition[1]);
            wallS.drawPermanent(newPos[0], this.drawPosition[1]);
            wallW.moveToPoint(newPos[0], newPos[1]);
            wallW.drawPermanent(newPos[0], this.drawPosition[1]);
        } else if (this.drawPosition[1] - newPos[1] < 0 && this.drawPosition[0] - newPos[0] > 0) { 
       
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
        
        this.updateRoomID();
        console.log("RoomID: " + this.roomID)
        this.createRoom(this.model.roomToCoords(this.roomID));
        
        
        
        
        
        
        
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
        
        gp.drawPermanent(newPos[0], newPos[1]);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'r' || e.key === 'R') {
            
            if(this.coords.mode == SnapMode.GRID) {
                if(this.currentFurnitureRotation % 8 == 0) this.currentFurnitureRotation = 0;
                this.currentFurnitureRotation += Math.PI / 2; 
            }
            else this.currentFurnitureRotation += Math.PI / 8;
            
            
            if (this.objectsContainer.children.includes(this.furniturePiece)) {
                this.furniturePiece.rotation = this.currentFurnitureRotation;
            }
        }
    }

    drawTemporaryFurniture(x: number, y: number) {
        if(this.objectsContainer.children.includes(this.furniturePiece)) this.objectsContainer.removeChild(this.furniturePiece);
        let newPos : number[];
        if(this.coords.mode == SnapMode.GRID) {
            newPos = this.coords.snapToPoint(this.board, x, y);
            console.log(this.coords.mode + " grid");
        }
        else newPos = [x, y];
        this.furniturePiece = new Furniture(this, this.model, this.spriteManager, this.currentFurnitureType);
        this.furniturePiece.setup();
        
        this.furniturePiece.rotation = this.currentFurnitureRotation;
        
        this.objectsContainer.addChild(this.furniturePiece);
        this.furniturePiece.drawTemporary(newPos[0], newPos[1]);
    }
    
    drawPermanentFurniture(x: number, y: number) {
        let newPos : number[];
        if(this.coords.mode == SnapMode.GRID) newPos = this.coords.snapToPoint(this.board, x, y);
            else newPos = [x, y];
        
        this.furniturePiece.rotation = this.currentFurnitureRotation;

        this.objects.push(this.furniturePiece);
        this.objectsContainer.addChild(this.furniturePiece);
        this.furniturePiece.drawPermanent(newPos[0], newPos[1]);

        this.furniturePiece = new Furniture(this, this.model, this.spriteManager, this.currentFurnitureType);
    }
    clearFurniture() {
        if(this.objectsContainer.children.includes(this.furniturePiece)) this.objectsContainer.removeChild(this.furniturePiece);
    }


    createRoom(walls: {startPoint: {coordX: number, coordY:number}; endPoint: {coordX: number, coordY:number};}[]){
        if (!walls || walls.length === 0 || !walls[0]) return; 
        this.clear();  
        this.stroke({ width: this.lineTempWidth, color: this.lineTempColor});
        this.moveTo(walls[0].startPoint.coordX, walls[0].startPoint.coordY);
        console.log("aaa");
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        walls.forEach(wall => {
           
            this.lineTo(wall.startPoint.coordX, wall.startPoint.coordY);
            this.lineTo(wall.endPoint.coordX, wall.endPoint.coordY);

            minX = Math.min(minX, wall.startPoint.coordX, wall.endPoint.coordX);
            maxX = Math.max(maxX, wall.startPoint.coordX, wall.endPoint.coordX);
            minY = Math.min(minY, wall.startPoint.coordY, wall.endPoint.coordY);
            maxY = Math.max(maxY, wall.startPoint.coordY, wall.endPoint.coordY);
        });
         this.fill(0xC8BCAC, 1);
       
        
       if (this.roomType && this.roomType !== "") {
            let centerX = minX + (maxX - minX) / 2;
            let centerY = minY + (maxY - minY) / 2;

            if (!this.roomLabel) {
                this.roomLabel = new PIXI.Text(this.formatRoomType(this.roomType), {
                    fontFamily: 'Arial',
                    fontSize: 18,
                    fill: 0x4A4A4A, 
                    align: 'center',
                    fontWeight: 'bold'
                });
                
                this.roomLabel.anchor.set(0.5);
                this.addChild(this.roomLabel);
            } else {
               
                this.roomLabel.text = this.formatRoomType(this.roomType);
            }
            this.roomLabel.position.set(centerX, centerY);
        }
    }


    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
                
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
            
            
    
    
   export(startPointX: number, startPointY: number, endPointX: number, endPointY: number, wallHeight: number){
        let minX = Math.min(startPointX, endPointX);
        let maxX = Math.max(startPointX, endPointX);
        let minY = Math.min(startPointY, endPointY);
        let maxY = Math.max(startPointY, endPointY);

        
        this.model.addToWalls(minX, minY, maxX, minY, wallHeight);
        this.model.addToWalls(minX, maxY, maxX, maxY, wallHeight);
        this.model.addToWalls(minX, minY, minX, maxY, wallHeight);
        this.model.addToWalls(maxX, minY, maxX, maxY, wallHeight);

        
        this.model.detectRoomsFromGraph();

        
        this.roomID = this.model.roomIndex > 0 ? (this.model.roomIndex - 1) : -1;
    }
}
