import { Object } from "./Object";
import { furnitureAssets } from "../../pages/generated-assets";
export class Furniture extends Object {
    furnitureTypeID;
    texturePath = '';
    partOfRoom;
    model;
    pieceID = 0;
    constructor(partOfRoom, model, spriteManager, furnitureTypeID) {
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
    drawTemporary(x, y) {
        this.alpha = 0.5;
        this.x = x;
        this.y = y;
        this.eventMode = 'none';
    }
    drawPermanent(x, y) {
        this.alpha = 1;
        this.export();
    }
    export() {
        let pieceID = this.model.addToObjects('furniture', this.x, this.y, this.partOfRoom.roomID, this.furnitureTypeID, this.rotation);
        if (pieceID !== undefined)
            this.pieceID = pieceID;
    }
    update() {
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
