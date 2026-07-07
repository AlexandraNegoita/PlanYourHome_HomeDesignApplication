import { Model } from "../model/Model";
import { Board } from "./Board";

export enum SnapMode{
    GRID,
    FREESTYLE
}

export class Coordinates {
    public x: number = 0;
    public y: number = 0;
    public mode: SnapMode = SnapMode.GRID;
    
    constructor(x?: number, y?:number, mode? :SnapMode) {
        if(x) this.x = x;
        if(y) this.y = y;
        if(mode) this.mode = mode;
    }

    changeSnapMode(mode: SnapMode) {
        this.mode = mode;
    }

    snapToPoint(board: Board, x: number, y: number): number[] {
        const GRID_SIZE = 30; 
        
        let snapX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        let snapY = Math.round(y / GRID_SIZE) * GRID_SIZE;
        
        return [snapX, snapY];
    }

    snapToExisting(model: Model, x: number, y: number): number[] {
        let positions: number[] = [x, y];
        const SNAP_DIST = 15;

        model.walls.forEach(function (wall) {
            if(Math.abs(x - wall.wall.startPoint.coordX) <= SNAP_DIST) positions[0] = wall.wall.startPoint.coordX;
            if(Math.abs(x - wall.wall.endPoint.coordX) <= SNAP_DIST) positions[0] = wall.wall.endPoint.coordX;
            if(Math.abs(y - wall.wall.startPoint.coordY) <= SNAP_DIST) positions[1] = wall.wall.startPoint.coordY;
            if(Math.abs(y - wall.wall.endPoint.coordY) <= SNAP_DIST) positions[1] = wall.wall.endPoint.coordY;
        });
        
        return positions;
    }
}