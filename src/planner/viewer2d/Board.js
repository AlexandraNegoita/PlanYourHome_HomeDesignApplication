import * as PIXI from "pixi.js";
export class Board extends PIXI.Graphics {
    points = [];
    gridSprite;
    constructor(geometry) {
        super(geometry);
    }
    async drawBoard(app, backgroundLayer) {
        app.renderer.events.cursorStyles.default = 'crosshair';
        let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        bg.width = app.screen.width;
        bg.height = app.screen.height;
        bg.tint = 0xE0FFFF;
        backgroundLayer.addChild(bg);
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 30;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#4682B4';
        const radius = 1.5;
        const drawDot = (x, y) => {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        };
        drawDot(0, 0);
        drawDot(30, 0);
        drawDot(0, 30);
        drawDot(30, 30);
        const gridTexture = PIXI.Texture.from(canvas);
        this.gridSprite = new PIXI.TilingSprite({
            texture: gridTexture,
            width: app.screen.width,
            height: app.screen.height,
        });
        backgroundLayer.addChild(this.gridSprite);
    }
    syncGridToCamera(x, y, scale) {
        if (this.gridSprite) {
            this.gridSprite.tilePosition.x = x;
            this.gridSprite.tilePosition.y = y;
            this.gridSprite.tileScale.set(scale);
        }
    }
}
