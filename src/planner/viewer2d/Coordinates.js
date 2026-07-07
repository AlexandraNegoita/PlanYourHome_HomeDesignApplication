export var SnapMode;
(function (SnapMode) {
    SnapMode[SnapMode["GRID"] = 0] = "GRID";
    SnapMode[SnapMode["FREESTYLE"] = 1] = "FREESTYLE";
})(SnapMode || (SnapMode = {}));
export class Coordinates {
    x = 0;
    y = 0;
    mode = SnapMode.GRID;
    constructor(x, y, mode) {
        if (x)
            this.x = x;
        if (y)
            this.y = y;
        if (mode)
            this.mode = mode;
    }
    changeSnapMode(mode) {
        this.mode = mode;
    }
    snapToPoint(board, x, y) {
        const GRID_SIZE = 30;
        let snapX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        let snapY = Math.round(y / GRID_SIZE) * GRID_SIZE;
        return [snapX, snapY];
    }
    snapToExisting(model, x, y) {
        let positions = [x, y];
        const SNAP_DIST = 15;
        model.walls.forEach(function (wall) {
            if (Math.abs(x - wall.wall.startPoint.coordX) <= SNAP_DIST)
                positions[0] = wall.wall.startPoint.coordX;
            if (Math.abs(x - wall.wall.endPoint.coordX) <= SNAP_DIST)
                positions[0] = wall.wall.endPoint.coordX;
            if (Math.abs(y - wall.wall.startPoint.coordY) <= SNAP_DIST)
                positions[1] = wall.wall.startPoint.coordY;
            if (Math.abs(y - wall.wall.endPoint.coordY) <= SNAP_DIST)
                positions[1] = wall.wall.endPoint.coordY;
        });
        return positions;
    }
}
