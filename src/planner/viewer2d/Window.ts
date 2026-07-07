import * as PIXI from "pixi.js";
import { Wall } from "./Wall";
import { Model } from "../model/Model";
import { SpriteManager } from "./SpriteManager";
import { Object } from "./Object";

export class Window extends Object {
    texturePath: string ='';
    partOfWall: Wall;
    model: Model;
    windowID: number = 0;
    
    constructor(partOfWall: Wall, model : Model, spriteManager: SpriteManager) {
        super(spriteManager.windowTexture);
        this.texturePath = spriteManager.windowPath;
        this.partOfWall = partOfWall;
        this.model = model;
    }
    
    setup() {
        this.anchor.set(0.5);
        this.height = this.partOfWall.lineWidth;
        this.width = 60;
    }

    checkAngle(wall: Wall) {
        var wall1X = (this.x + 0.5) - (this.x - 0.5);
        var wall1Y = 0; 
        var wall2X = wall.endPosition[0] - wall.startPosition[0];
        var wall2Y = wall.endPosition[1] - wall.startPosition[1];
        var angle = Math.atan2(wall1X * wall2Y - wall1Y * wall2X, wall1X * wall2X + wall1Y * wall2Y);
        return angle;
    }

    // NEW: Vector projection calculates the closest valid point perfectly resting on the wall segment
    projectOnWall(x: number, y: number): {x: number, y: number} {
        const ax = this.partOfWall.startPosition[0];
        const ay = this.partOfWall.startPosition[1];
        const bx = this.partOfWall.endPosition[0];
        const by = this.partOfWall.endPosition[1];

        const atob = { x: bx - ax, y: by - ay };
        const atop = { x: x - ax, y: y - ay };
        
        const lenSq = atob.x * atob.x + atob.y * atob.y;
        if (lenSq === 0) return { x: ax, y: ay };

        const dot = atop.x * atob.x + atop.y * atob.y;
        // Clamp the placement completely between the start (0) and end (1) of the wall
        const t = Math.min(1, Math.max(0, dot / lenSq));

        return {
            x: ax + atob.x * t,
            y: ay + atob.y * t
        };
    }

    drawTemporary(x: number, y: number) {
        this.alpha = 0.5;
        this.rotation = this.checkAngle(this.partOfWall);
        const pt = this.projectOnWall(x, y);
        this.x = pt.x;
        this.y = pt.y;
    }

    drawPermanent(x: number, y: number) {
        this.alpha = 1;
        this.rotation = this.checkAngle(this.partOfWall);
        const pt = this.projectOnWall(x, y);
        this.x = pt.x;
        this.y = pt.y;
        this.export();
    }

    export(){
        let windowID = this.model.addToObjects('window', this.x, this.y, this.partOfWall.wallID);
        if(windowID) this.windowID = windowID;
    }

    update(){
        this.model.updateWindow(this.windowID, {
            window: {
                windowID: this.windowID,
                centerPoint: {
                    coordX: this.x,
                    coordY: this.y
                },
                partOfWall: this.partOfWall.wallID
            }
        });
    }
}