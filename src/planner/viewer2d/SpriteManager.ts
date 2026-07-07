import * as PIXI from "pixi.js";
import { FurnitureItem } from "../../pages/generated-assets";


export class SpriteManager {
    windowPath: string = '';
    windowTexture: PIXI.Texture | undefined;
    doorPath: string = '';
    doorTexture: PIXI.Texture | undefined;
    constructor() {

    }
    async setWindowPath(windowPath: string) {
        this.windowPath = windowPath;
        let texture = await PIXI.Assets.load(windowPath);
        this.windowTexture = texture;
    }
    getWindowTexture() {
        return this.windowTexture;
    }

    async setDoorPath(doorPath: string) {
        this.doorPath = doorPath;
        let texture = await PIXI.Assets.load(doorPath);
        this.doorTexture = texture;
    }
    getDoorTexture() {
        return this.doorTexture;
    }

    async createFurnitureTexture(furnitureAsset: FurnitureItem) {
        let texture = await PIXI.Assets.load(furnitureAsset.floorplanPath);
        furnitureAsset.floorplanTexture = texture;
    }

    async setFurniturePaths(furnitureAssets: FurnitureItem[]) {
        for (let asset of furnitureAssets) {
            this.createFurnitureTexture(asset);
        }
    }

    

}