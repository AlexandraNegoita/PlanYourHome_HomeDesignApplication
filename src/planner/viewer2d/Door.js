import { Object } from "./Object";
export class Door extends Object {
    texturePath = '';
    partOfWall;
    model;
    doorID = 0;
    constructor(partOfWall, model, spriteManager) {
        super(spriteManager.doorTexture);
        this.texturePath = spriteManager.doorPath;
        this.partOfWall = partOfWall;
        this.model = model;
    }
    setup() {
        this.partOfWall.objects.push(this);
        this.anchor.set(this.partOfWall.lineWidth / this.width);
        this.scale = 0.1;
    }
    checkAngle(wall) {
        var wall1X = (this.x + 0.5) - (this.x - 0.5);
        var wall1Y = 0;
        var wall2X = wall.endPosition[0] - wall.startPosition[0];
        var wall2Y = wall.endPosition[1] - wall.startPosition[1];
        var angle = Math.atan2(wall1X * wall2Y - wall1Y * wall2X, wall1X * wall2X + wall1Y * wall2Y);
        return angle;
    }
    projectOnWall(x, y) {
        const ax = this.partOfWall.startPosition[0];
        const ay = this.partOfWall.startPosition[1];
        const bx = this.partOfWall.endPosition[0];
        const by = this.partOfWall.endPosition[1];
        const atob = { x: bx - ax, y: by - ay };
        const atop = { x: x - ax, y: y - ay };
        const lenSq = atob.x * atob.x + atob.y * atob.y;
        if (lenSq === 0)
            return { x: ax, y: ay };
        const dot = atop.x * atob.x + atop.y * atob.y;
        const t = Math.min(1, Math.max(0, dot / lenSq));
        return {
            x: ax + atob.x * t,
            y: ay + atob.y * t
        };
    }
    drawTemporary(x, y) {
        this.alpha = 0.5;
        this.rotation = this.checkAngle(this.partOfWall);
        const pt = this.projectOnWall(x, y);
        this.x = pt.x;
        this.y = pt.y - this.partOfWall.lineWidth / 2;
    }
    drawPermanent(x, y) {
        this.alpha = 1;
        this.rotation = this.checkAngle(this.partOfWall);
        const pt = this.projectOnWall(x, y);
        this.x = pt.x;
        this.y = pt.y - this.partOfWall.lineWidth / 2;
        this.export();
    }
    export() {
        let doorID = this.model.addToObjects('door', this.x, this.y, this.partOfWall.wallID);
        if (doorID)
            this.doorID = doorID;
    }
    update() {
        this.model.updateDoor(this.doorID, {
            door: {
                doorID: this.doorID,
                centerPoint: {
                    coordX: this.x,
                    coordY: this.y
                },
                partOfWall: this.partOfWall.wallID
            }
        });
    }
}
