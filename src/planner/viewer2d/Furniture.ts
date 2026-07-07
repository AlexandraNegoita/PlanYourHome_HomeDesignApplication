import * as PIXI from "pixi.js";
import { Model } from "../model/Model";
import { SpriteManager } from "./SpriteManager";
import { Object } from "./Object";
import { Room } from "./Room";
import { furnitureAssets } from "../../pages/generated-assets";

export class Furniture extends Object {
    furnitureTypeID: number;
    texturePath: string ='';
    partOfRoom: Room;
    model: Model;
    pieceID: number = 0;

    constructor(partOfRoom: Room, model : Model, spriteManager: SpriteManager, furnitureTypeID: number) {
        const asset = furnitureAssets[furnitureTypeID];
        super(asset?.floorplanTexture);
        this.furnitureTypeID = furnitureTypeID;
        this.partOfRoom = partOfRoom;
        this.model = model;
    }

    setup() {
        this.anchor.set(0.5);
        this.scale.set(0.5); 
    }

    drawTemporary(x: number, y: number) {
        this.alpha = 0.5;
        this.x = x;
        this.y = y;
        this.eventMode = 'none';
    }

    drawPermanent(x: number, y: number) {
        this.alpha = 1;
        this.export();
    }

    export(){
        let pieceID = this.model.addToObjects('furniture', this.x, this.y, this.partOfRoom.roomID, this.furnitureTypeID, this.rotation);
        if(pieceID !== undefined) this.pieceID = pieceID;
    }

    update(){
        this.model.updateFurniture(this.pieceID, {
            piece: {
                pieceID: this.pieceID,
                typeID: this.furnitureTypeID, 
                rotation: this.rotation,      
                centerPoint: {
                    coordX: this.x,
                    coordY: this.y
                },
                partOfRoom: this.partOfRoom.roomID
            }
        });
    }
}