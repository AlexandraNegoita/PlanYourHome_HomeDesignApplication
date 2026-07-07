export class Model {
    wallIndex = 0;
    roofIndex = 0;
    roomIndex = 0;
    windowIndex = 0;
    doorIndex = 0;
    furnitureIndex = 0;
    rooms = [];
    walls = [];
    roof = [];
    objects = {
        windows: [],
        doors: [],
        furniture: []
    };
    polygonWalls = [];
    perimeter = [];
    perimeter1 = [];
    addToWalls(startPointX, startPointY, endPointX, endPointY, wallHeight) {
        // CHANGED: Prevent Duplicates (shared boundaries are reused instead of stacking)
        let existingWall = this.walls.find(w => (w.wall.startPoint.coordX === startPointX && w.wall.startPoint.coordY === startPointY &&
            w.wall.endPoint.coordX === endPointX && w.wall.endPoint.coordY === endPointY) ||
            (w.wall.startPoint.coordX === endPointX && w.wall.startPoint.coordY === endPointY &&
                w.wall.endPoint.coordX === startPointX && w.wall.endPoint.coordY === startPointY));
        if (existingWall) {
            return existingWall;
        }
        let newWall = {
            wall: {
                wallID: this.wallIndex,
                startPoint: {
                    coordX: startPointX,
                    coordY: startPointY
                },
                endPoint: {
                    coordX: endPointX,
                    coordY: endPointY
                },
                wallHeight: wallHeight,
                linked: {
                    startPoint: [],
                    endPoint: []
                },
                roomID: [this.roomIndex]
            }
        };
        this.walls.push(newWall);
        this.wallIndex++;
        return newWall;
    }
    addToRoof(startPointX, startPointY, endPointX, endPointY, wallHeight) {
        let newWall = {
            wall: {
                wallID: this.wallIndex,
                startPoint: {
                    coordX: startPointX,
                    coordY: startPointY
                },
                endPoint: {
                    coordX: endPointX,
                    coordY: endPointY
                },
                wallHeight: wallHeight,
                linked: {
                    startPoint: [],
                    endPoint: []
                },
                roomID: [this.roomIndex]
            }
        };
        this.roof.push(newWall);
        this.roofIndex++;
        return newWall;
    }
    addToRooms(wallsID) {
        this.rooms.push({
            room: {
                roomID: this.roomIndex,
                wallsID: wallsID,
            }
        });
        return this.roomIndex++;
    }
    importPlan(plan) {
        this.walls = plan.walls;
        this.rooms = plan.rooms;
        this.roof = plan.roof;
        this.objects = plan.objects;
        this.roomIndex = plan.rooms.length;
        this.wallIndex = plan.walls.length;
        this.doorIndex = plan.objects.doors.length;
        this.windowIndex = plan.objects.windows.length;
        this.furnitureIndex = plan.objects.furniture.length;
    }
    clearModel() {
        this.walls = [];
        this.rooms = [];
        this.roof = [];
        this.objects = {
            windows: [],
            doors: [],
            furniture: []
        };
        this.roomIndex = 0;
        this.wallIndex = 0;
        this.doorIndex = 0;
        this.windowIndex = 0;
        this.furnitureIndex = 0;
    }
    calculateWallLength(wallID) {
        let wall = this.findWallByID(wallID);
        if (wall)
            return Math.sqrt(Math.pow(wall.wall.endPoint.coordX - wall.wall.startPoint.coordX, 2) + Math.pow(wall.wall.endPoint.coordY - wall.wall.startPoint.coordY, 2));
    }
    calculateWallLengthRatio(wallID) {
        let wall = this.findWallByID(wallID);
        if (wall)
            return Math.sqrt(Math.pow(wall.wall.endPoint.coordX / 30 - wall.wall.startPoint.coordX / 30, 2) + Math.pow(wall.wall.endPoint.coordY / 30 - wall.wall.startPoint.coordY / 30, 2));
    }
    calculateMiddle(wallID) {
        let wall = this.findWallByID(wallID);
        if (wall)
            return {
                coordX: (wall.wall.endPoint.coordX + wall.wall.startPoint.coordX) / 2,
                coordY: (wall.wall.endPoint.coordY + wall.wall.startPoint.coordY) / 2
            };
    }
    calculateMiddleRatio(wallID) {
        let wall = this.findWallByID(wallID);
        if (wall)
            return {
                coordX: (wall.wall.endPoint.coordX / 30 + wall.wall.startPoint.coordX / 30) / 2,
                coordY: (wall.wall.endPoint.coordY / 30 + wall.wall.startPoint.coordY / 30) / 2
            };
    }
    addToObjects(type, centerPointX, centerPointY, partOfWall, typeID, rotation) {
        if (type == 'window' && partOfWall != undefined) {
            this.objects.windows.push({
                window: {
                    windowID: this.windowIndex,
                    centerPoint: {
                        coordX: centerPointX,
                        coordY: centerPointY
                    },
                    partOfWall: partOfWall
                }
            });
            return this.windowIndex++;
        }
        else if (type == 'door' && partOfWall != undefined) {
            this.objects.doors.push({
                door: {
                    doorID: this.doorIndex,
                    centerPoint: {
                        coordX: centerPointX,
                        coordY: centerPointY
                    },
                    partOfWall: partOfWall
                }
            });
            return this.doorIndex++;
        }
        else if (type == 'furniture' && partOfWall != undefined && typeID != undefined && rotation != undefined) {
            this.objects.furniture.push({
                piece: {
                    pieceID: this.furnitureIndex,
                    typeID: typeID,
                    rotation: rotation,
                    centerPoint: {
                        coordX: centerPointX,
                        coordY: centerPointY
                    },
                    partOfRoom: partOfWall
                }
            });
            return this.furnitureIndex++;
        }
    }
    findWindowByID(windowID) {
        for (var window of this.objects.windows) {
            if (window.window.windowID == windowID) {
                return window;
            }
        }
        return undefined;
    }
    findPieceByID(pieceID) {
        for (var piece of this.objects.furniture) {
            if (piece.piece.pieceID == pieceID) {
                return piece;
            }
        }
        return undefined;
    }
    findDoorByID(doorID) {
        for (var door of this.objects.doors) {
            if (door.door.doorID == doorID) {
                return door;
            }
        }
        return undefined;
    }
    updateWindow(windowID, window) {
        let oldWindow = this.findWindowByID(windowID);
        if (oldWindow) {
            oldWindow = window;
        }
    }
    updateDoor(doorID, door) {
        let oldDoor = this.findDoorByID(doorID);
        if (oldDoor) {
            oldDoor = door;
        }
    }
    updateFurniture(pieceID, piece) {
        let oldPiece = this.findPieceByID(pieceID);
        if (oldPiece) {
            oldPiece = piece;
        }
    }
    getWallsFromRoom(roomID) {
        let walls = [];
        for (var room of this.rooms) {
            if (room.room.roomID == roomID) {
                for (var id of room.room.wallsID) {
                    let wall = this.findWallByID(id);
                    if (wall)
                        walls.push(wall);
                }
            }
        }
        return walls;
    }
    findWallByID(wallID) {
        for (var wall of this.walls) {
            if (wall.wall.wallID == wallID) {
                return wall;
            }
        }
        return undefined;
    }
    checkWallInRooms(wallID) {
        let ids = [];
        for (var room of this.rooms) {
            for (var id of room.room.wallsID) {
                if (id == wallID) {
                    ids.push(room.room.roomID);
                }
            }
        }
        return ids;
    }
    updateWall(wallID, newWall) {
        let wall = this.findWallByID(wallID);
        if (wall) {
            // CHANGED: Prevent destructively overwriting shared room IDs and links
            let existingRooms = wall.wall.roomID || [];
            let incomingRooms = newWall.wall.roomID || [];
            // Merge valid room IDs safely to avoid null/undefined
            let mergedRooms = Array.from(new Set([...existingRooms, ...incomingRooms])).filter(id => id != null);
            newWall.wall.roomID = mergedRooms;
            const mergeLinks = (existingLinks, incomingLinks) => {
                let merged = [...existingLinks];
                incomingLinks.forEach(nl => {
                    if (nl && nl.wallID != null && !merged.find(el => el.wallID === nl.wallID && el.roomID === nl.roomID)) {
                        merged.push(nl);
                    }
                });
                return merged;
            };
            newWall.wall.linked.startPoint = mergeLinks(wall.wall.linked.startPoint, newWall.wall.linked.startPoint);
            newWall.wall.linked.endPoint = mergeLinks(wall.wall.linked.endPoint, newWall.wall.linked.endPoint);
            this.walls[this.walls.indexOf(wall)] = newWall;
        }
    }
    checkLinkage(coords) {
        for (var wall of this.walls) {
            if (wall.wall.startPoint.coordX == coords[0] && wall.wall.startPoint.coordY == coords[1]
                || wall.wall.endPoint.coordX == coords[0] && wall.wall.endPoint.coordY == coords[1]) {
                return true;
            }
        }
        return false;
    }
    getLinkage(coords) {
        let linkedWalls = [];
        for (var wall of this.walls) {
            if (wall.wall.startPoint.coordX == coords[0] && wall.wall.startPoint.coordY == coords[1]) {
                linkedWalls.push({
                    linkedPoint: "start",
                    wall: wall
                });
            }
            else if (wall.wall.endPoint.coordX == coords[0] && wall.wall.endPoint.coordY == coords[1]) {
                linkedWalls.push({
                    linkedPoint: "end",
                    wall: wall
                });
            }
        }
        return linkedWalls;
    }
    wallsToCoords(wallsToConvert) {
        let walls = [];
        wallsToConvert.map(function (wall) {
            walls.push({
                startPoint: { coordX: wall.wall.startPoint.coordX, coordY: wall.wall.startPoint.coordY },
                endPoint: { coordX: wall.wall.endPoint.coordX, coordY: wall.wall.endPoint.coordY }
            });
        });
        return walls;
    }
    roomToCoords(roomID) {
        let walls = [];
        let roomWalls = this.getWallsFromRoom(roomID);
        let rawSegments = roomWalls.map(wall => {
            if (wall && wall.wall)
                return {
                    startPoint: { coordX: wall.wall.startPoint.coordX, coordY: wall.wall.startPoint.coordY },
                    endPoint: { coordX: wall.wall.endPoint.coordX, coordY: wall.wall.endPoint.coordY }
                };
            return null;
        }).filter(w => w !== null);
        // CHANGED: Array boundary/undefined crash protection
        if (rawSegments.length === 0)
            return walls;
        let current = rawSegments.shift();
        if (!current)
            return walls;
        walls.push(current);
        while (rawSegments.length > 0) {
            let targetPoint = current.endPoint;
            let nextIndex = rawSegments.findIndex(s => (s.startPoint.coordX === targetPoint.coordX && s.startPoint.coordY === targetPoint.coordY) ||
                (s.endPoint.coordX === targetPoint.coordX && s.endPoint.coordY === targetPoint.coordY));
            if (nextIndex !== -1) {
                let nextWall = rawSegments.splice(nextIndex, 1)[0];
                if (nextWall.endPoint.coordX === targetPoint.coordX && nextWall.endPoint.coordY === targetPoint.coordY) {
                    let temp = nextWall.startPoint;
                    nextWall.startPoint = nextWall.endPoint;
                    nextWall.endPoint = temp;
                }
                walls.push(nextWall);
                current = nextWall;
            }
            else {
                let nextWall = rawSegments.shift();
                if (nextWall) {
                    walls.push(nextWall);
                    current = nextWall;
                }
            }
        }
        return walls;
    }
    createRoom(polygonWalls) {
        let wallsID = [];
        polygonWalls.map(function (wall) {
            wallsID.push(wall.wall.wallID);
        });
        this.walls.forEach(wall => {
            if (wall.wall.roomID.indexOf(this.roomIndex) > -1) {
                if (wallsID.indexOf(wall.wall.wallID) == -1)
                    wallsID.push(wall.wall.wallID);
            }
        });
        let id = this.addToRooms(wallsID);
        this.walls.forEach(w1 => {
            polygonWalls.forEach(w2 => {
                if (w1.wall.wallID == w2.wall.wallID) {
                    if (w1.wall.roomID.indexOf(id) == -1) {
                        w1.wall.roomID.push(id);
                    }
                }
            });
        });
        this.polygonWalls = [];
        return id;
    }
    getCoordsFromWall(wallID) {
        let wall = this.findWallByID(wallID);
        if (wall)
            return {
                startPoint: {
                    coordX: wall?.wall.startPoint.coordX,
                    coordY: wall?.wall.startPoint.coordY
                },
                endPoint: {
                    coordX: wall?.wall.endPoint.coordX,
                    coordY: wall?.wall.endPoint.coordY
                },
            };
    }
    getPerimeter() {
        const edgeMap = new Map();
        const normalizeWall = (wall) => {
            const { startPoint, endPoint } = wall;
            const key = [
                [Math.min(startPoint.coordX, endPoint.coordX), Math.min(startPoint.coordY, endPoint.coordY)],
                [Math.max(startPoint.coordX, endPoint.coordX), Math.max(startPoint.coordY, endPoint.coordY)]
            ].join(',');
            return key;
        };
        for (const wallObj of this.roof) {
            const wall = wallObj.wall;
            const key = normalizeWall(wall);
            if (edgeMap.has(key)) {
                edgeMap.set(key, edgeMap.get(key) + 1);
            }
            else {
                edgeMap.set(key, 1);
            }
        }
        const perimeterWalls = [];
        for (const wallObj of this.roof) {
            const wall = wallObj.wall;
            const key = normalizeWall(wall);
            if (edgeMap.get(key) === 1) {
                perimeterWalls.push(wall);
            }
        }
        return perimeterWalls;
    }
    getHousePerimeter() {
        this.perimeter = this.getPerimeter();
        this.perimeter1 = [];
        this.perimeter.forEach(wall1 => {
            this.perimeter.forEach(wall2 => {
                wall1.linked.startPoint.forEach((wallLinkedS) => {
                    if (this.findWallByID(wallLinkedS.wallID)?.wall == wall2) {
                        if (this.perimeter1.indexOf(wall2) == -1)
                            this.perimeter1.push(wall2);
                        return wallLinkedS;
                    }
                });
            });
            if (this.perimeter1.indexOf(wall1) == -1)
                this.perimeter1.push(wall1);
            this.perimeter.forEach(wall2 => {
                wall1.linked.endPoint.forEach((wallLinkedE) => {
                    if (this.findWallByID(wallLinkedE.wallID)?.wall == wall2) {
                        if (this.perimeter1.indexOf(wall2) == -1)
                            this.perimeter1.push(wall2);
                        return wallLinkedE;
                    }
                });
            });
        });
        return this.perimeter1;
    }
    fillPerimeter(wall) {
        if (this.perimeter1.length == this.perimeter.length)
            return this.perimeter1;
        else {
            this.perimeter.forEach(wall2 => {
                wall.linked.startPoint.forEach(wallLinkedS => {
                    if (this.findWallByID(wallLinkedS.wallID)?.wall == wall2) {
                        if (this.perimeter1.indexOf(wall2) == -1) {
                            this.perimeter1.push(wall2);
                            this.fillPerimeter(wall2);
                            return wall2;
                        }
                    }
                });
            });
            if (this.perimeter1.indexOf(wall) == -1)
                this.perimeter1.push(wall);
            this.perimeter.forEach(wall2 => {
                wall.linked.endPoint.forEach(wallLinkedE => {
                    if (this.findWallByID(wallLinkedE.wallID)?.wall == wall2) {
                        if (this.perimeter1.indexOf(wall2) == -1) {
                            this.perimeter1.push(wall2);
                            this.fillPerimeter(wall2);
                            return wall2;
                        }
                    }
                });
            });
        }
    }
    // Add this to Model.ts
    splitAndDeduplicateWalls() {
        let changed = true;
        // 1. Split walls wherever a corner touches the middle of a line
        while (changed) {
            changed = false;
            let points = new Set();
            this.walls.forEach(w => {
                points.add(`${Math.round(w.wall.startPoint.coordX)},${Math.round(w.wall.startPoint.coordY)}`);
                points.add(`${Math.round(w.wall.endPoint.coordX)},${Math.round(w.wall.endPoint.coordY)}`);
            });
            for (let i = 0; i < this.walls.length; i++) {
                let w = this.walls[i];
                let p1 = w.wall.startPoint;
                let p2 = w.wall.endPoint;
                for (let ptStr of points) {
                    let [x, y] = ptStr.split(',').map(Number);
                    if (this.isPointOnSegment(x, y, p1.coordX, p1.coordY, p2.coordX, p2.coordY)) {
                        // We found a T-Junction! Split the wall into two pieces.
                        let newWall = {
                            wall: {
                                wallID: this.wallIndex++,
                                startPoint: { coordX: x, coordY: y },
                                endPoint: { coordX: p2.coordX, coordY: p2.coordY },
                                wallHeight: w.wall.wallHeight,
                                linked: { startPoint: [], endPoint: [] },
                                roomID: []
                            }
                        };
                        w.wall.endPoint = { coordX: x, coordY: y };
                        this.walls.push(newWall);
                        changed = true;
                        break;
                    }
                }
                if (changed)
                    break;
            }
        }
        // 2. Remove identical duplicates (cleans up shared walls)
        let uniqueWalls = [];
        let seen = new Set();
        for (let w of this.walls) {
            let p1 = w.wall.startPoint;
            let p2 = w.wall.endPoint;
            if (p1.coordX === p2.coordX && p1.coordY === p2.coordY)
                continue; // Ignore zero-length walls
            let key = [
                [Math.min(p1.coordX, p2.coordX), Math.min(p1.coordY, p2.coordY)].join(','),
                [Math.max(p1.coordX, p2.coordX), Math.max(p1.coordY, p2.coordY)].join(',')
            ].join('|');
            if (!seen.has(key)) {
                seen.add(key);
                uniqueWalls.push(w);
            }
        }
        this.walls = uniqueWalls;
    }
    // Math helper to check if a point lies on a line
    isPointOnSegment(px, py, x1, y1, x2, y2) {
        let distP1_pt = Math.hypot(px - x1, py - y1);
        let distPt_P2 = Math.hypot(x2 - px, y2 - py);
        let distP1_P2 = Math.hypot(x2 - x1, y2 - y1);
        // Use a 0.1 tolerance for floating point rounding errors
        if (Math.abs((distP1_pt + distPt_P2) - distP1_P2) < 0.1) {
            if (distP1_pt > 0.1 && distPt_P2 > 0.1)
                return true; // Exclude actual endpoints
        }
        return false;
    }
    // CHANGED: Replacing buggy recursion with an efficient planar graph traversal.
    // This perfectly calculates room formations without crashing.
    checkClosedPolygon(firstWall) {
        if (!firstWall)
            return -1;
        this.detectRoomsFromGraph();
        let wallData = this.findWallByID(firstWall.wall.wallID);
        if (wallData && wallData.wall.roomID.length > 0) {
            return wallData.wall.roomID[wallData.wall.roomID.length - 1]; // Return most recently assigned room
        }
        return -1;
    }
    detectRoomsFromGraph() {
        // --- ADD THIS HERE! ---
        // Clean up T-Junctions and Overlaps before running graph math
        this.splitAndDeduplicateWalls();
        this.rooms = [];
        this.roomIndex = 0;
        this.walls.forEach(w => { w.wall.roomID = []; });
        let edges = [];
        let adjacencyList = new Map();
        const getPointKey = (x, y) => `${Math.round(x)},${Math.round(y)}`;
        this.walls.forEach(w => {
            let p1 = w.wall.startPoint;
            let p2 = w.wall.endPoint;
            if (p1.coordX === p2.coordX && p1.coordY === p2.coordY)
                return;
            let e1 = { wallID: w.wall.wallID, start: p1, end: p2, angle: Math.atan2(p2.coordY - p1.coordY, p2.coordX - p1.coordX), visited: false };
            let e2 = { wallID: w.wall.wallID, start: p2, end: p1, angle: Math.atan2(p1.coordY - p2.coordY, p1.coordX - p2.coordX), visited: false };
            edges.push(e1, e2);
            let k1 = getPointKey(p1.coordX, p1.coordY);
            let k2 = getPointKey(p2.coordX, p2.coordY);
            if (!adjacencyList.has(k1))
                adjacencyList.set(k1, []);
            if (!adjacencyList.has(k2))
                adjacencyList.set(k2, []);
            adjacencyList.get(k1).push(e1);
            adjacencyList.get(k2).push(e2);
        });
        adjacencyList.forEach(outgoing => outgoing.sort((a, b) => a.angle - b.angle));
        let foundRooms = [];
        for (let edge of edges) {
            if (edge.visited)
                continue;
            let cycleEdges = [];
            let currentEdge = edge;
            while (!currentEdge.visited) {
                currentEdge.visited = true;
                cycleEdges.push(currentEdge);
                let nextKey = getPointKey(currentEdge.end.coordX, currentEdge.end.coordY);
                let outgoing = adjacencyList.get(nextKey);
                let reverseIndex = outgoing.findIndex((o) => o.end.coordX === currentEdge.start.coordX && o.end.coordY === currentEdge.start.coordY);
                let nextIndex = (reverseIndex + 1) % outgoing.length;
                currentEdge = outgoing[nextIndex];
            }
            if (currentEdge === edge) {
                let area = 0;
                for (let e of cycleEdges) {
                    area += (e.start.coordX * e.end.coordY) - (e.end.coordX * e.start.coordY);
                }
                area = area / 2;
                if (area > 0)
                    foundRooms.push(cycleEdges.map(e => e.wallID));
            }
        }
        foundRooms.forEach(wallIDs => {
            let newRoomID = this.addToRooms(wallIDs);
            wallIDs.forEach(id => {
                let w = this.findWallByID(id);
                if (w && !w.wall.roomID.includes(newRoomID)) {
                    w.wall.roomID.push(newRoomID);
                }
            });
        });
        // --- ADD THIS HERE! ---
        // Dynamically rebuild the user's `linked` arrays to support legacy perimeter methods
        this.walls.forEach(w => {
            w.wall.linked = { startPoint: [], endPoint: [] };
            let sKey = getPointKey(w.wall.startPoint.coordX, w.wall.startPoint.coordY);
            let eKey = getPointKey(w.wall.endPoint.coordX, w.wall.endPoint.coordY);
            const buildLinks = (key, arr) => {
                (adjacencyList.get(key) || []).forEach((adjE) => {
                    if (adjE.wallID !== w.wall.wallID) {
                        let w2 = this.findWallByID(adjE.wallID);
                        if (w2) {
                            let sharedRoom = w.wall.roomID.find(id => w2.wall.roomID.includes(id));
                            arr.push({ wallID: adjE.wallID, roomID: sharedRoom !== undefined ? sharedRoom : -1 });
                        }
                    }
                });
            };
            buildLinks(sKey, w.wall.linked.startPoint);
            buildLinks(eKey, w.wall.linked.endPoint);
        });
    }
    toJSON() {
        let model = {
            rooms: this.rooms,
            walls: this.walls,
            roof: this.roof,
            objects: this.objects
        };
        return JSON.stringify(model);
    }
}
