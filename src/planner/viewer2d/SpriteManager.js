import * as PIXI from "pixi.js";
export class SpriteManager {
    windowPath = '';
    windowTexture;
    doorPath = '';
    doorTexture;
    constructor() {
    }
    async setWindowPath(windowPath) {
        this.windowPath = windowPath;
        let texture = await PIXI.Assets.load(windowPath);
        this.windowTexture = texture;
    }
    getWindowTexture() {
        return this.windowTexture;
    }
    async setDoorPath(doorPath) {
        this.doorPath = doorPath;
        let texture = await PIXI.Assets.load(doorPath);
        this.doorTexture = texture;
    }
    getDoorTexture() {
        return this.doorTexture;
    }
    async createFurnitureTexture(furnitureAsset) {
        let texture = await PIXI.Assets.load(furnitureAsset.floorplanPath);
        furnitureAsset.floorplanTexture = texture;
    }
    async setFurniturePaths(furnitureAssets) {
        for (let asset of furnitureAssets) {
            this.createFurnitureTexture(asset);
        }
    }
}
