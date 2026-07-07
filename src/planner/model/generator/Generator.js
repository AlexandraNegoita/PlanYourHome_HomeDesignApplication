import { Coordinates } from "../../viewer2d/Coordinates";
export class Generator {
    config;
    board;
    coords;
    constructor(config, board) {
        this.config = config;
        this.board = board;
        this.coords = new Coordinates();
    }
    generate() {
        let attempts = 0;
        while (attempts < (this.config.maxRetries || 10)) {
            try {
                return this.attemptGeneration();
            }
            catch (error) {
                console.warn(`Generation attempt ${attempts + 1} failed: ${error.message}`);
                attempts++;
            }
        }
        throw new Error("Failed to generate house. The layout could not be resolved.");
    }
    attemptGeneration() {
        // 1. Snap the starting top-left corner
        const snappedStart = this.coords.snapToPoint(this.board, 390, 90);
        const startX = snappedStart[0];
        const startY = snappedStart[1];
        // 2. Snap the bottom-right corner to get a perfectly aligned width/height
        const endX = startX + this.config.houseWidth;
        const endY = startY + this.config.houseHeight;
        const snappedEnd = this.coords.snapToPoint(this.board, endX, endY);
        const footprint = {
            x: startX,
            y: startY,
            width: snappedEnd[0] - startX,
            height: snappedEnd[1] - startY
        };
        const rooms = this.divideSpace(footprint);
        this.assignRoomTypes(rooms);
        const walls = this.generateAtomicWalls(rooms);
        this.linkWalls(walls);
        const { doors, windows } = this.generateDoorsAndWindows(walls, rooms);
        const roofWalls = this.generateRoof(walls, rooms);
        return {
            rooms: rooms.map(r => ({
                room: { roomID: r.id, wallsID: r.wallIDs, roomType: r.roomType }
            })),
            walls: walls.map(w => ({ wall: w })),
            roof: roofWalls.map(w => ({ wall: w })),
            objects: {
                windows: windows,
                doors: doors,
                furniture: []
            }
        };
    }
    // -----------------------------
    // SPACE DIVISION (SNAPPED TO BOARD)
    // -----------------------------
    divideSpace(initialSpace) {
        let idCounter = 1;
        const initialRoom = { id: idCounter++, ...initialSpace, wallIDs: [] };
        let rooms = [initialRoom];
        let splitting = true;
        while (splitting && rooms.length < this.config.rooms) {
            splitting = false;
            const nextRooms = [];
            for (const room of rooms) {
                const canSplitV = room.width >= this.config.minRoomSize * 2;
                const canSplitH = room.height >= this.config.minRoomSize * 2;
                if (!canSplitV && !canSplitH) {
                    nextRooms.push(room);
                    continue;
                }
                splitting = true;
                const aspectRatio = room.width / room.height;
                let splitVertically = Math.random() > 0.5;
                if (aspectRatio > 1.5)
                    splitVertically = true;
                if (aspectRatio < 0.66)
                    splitVertically = false;
                if (splitVertically && canSplitV) {
                    // Calculate absolute World X coordinate of the cut & Snap it
                    const rawWorldX = room.x + this.randomRange(this.config.minRoomSize, room.width - this.config.minRoomSize);
                    const snappedX = this.coords.snapToPoint(this.board, rawWorldX, room.y)[0];
                    const splitWidth = snappedX - room.x;
                    nextRooms.push({ ...room, id: idCounter++, width: splitWidth, wallIDs: [] }, { ...room, id: idCounter++, x: snappedX, width: room.width - splitWidth, wallIDs: [] });
                }
                else if (!splitVertically && canSplitH) {
                    // Calculate absolute World Y coordinate of the cut & Snap it
                    const rawWorldY = room.y + this.randomRange(this.config.minRoomSize, room.height - this.config.minRoomSize);
                    const snappedY = this.coords.snapToPoint(this.board, room.x, rawWorldY)[1];
                    const splitHeight = snappedY - room.y;
                    nextRooms.push({ ...room, id: idCounter++, height: splitHeight, wallIDs: [] }, { ...room, id: idCounter++, y: snappedY, height: room.height - splitHeight, wallIDs: [] });
                }
                else {
                    nextRooms.push(room);
                }
            }
            rooms = nextRooms;
        }
        return rooms;
    }
    // -----------------------------
    // ATOMIC WALLS & SORTING
    // -----------------------------
    generateAtomicWalls(rooms) {
        const xs = Array.from(new Set(rooms.flatMap(r => [r.x, r.x + r.width]))).sort((a, b) => a - b);
        const ys = Array.from(new Set(rooms.flatMap(r => [r.y, r.y + r.height]))).sort((a, b) => a - b);
        let wallIDCounter = 1;
        const wallMap = new Map();
        const addSegment = (x1, y1, x2, y2, roomID) => {
            const sx = Math.min(x1, x2);
            const ex = Math.max(x1, x2);
            const sy = Math.min(y1, y2);
            const ey = Math.max(y1, y2);
            const key = `${sx},${sy}-${ex},${ey}`;
            if (wallMap.has(key)) {
                const existing = wallMap.get(key);
                if (!existing.roomID.includes(roomID))
                    existing.roomID.push(roomID);
            }
            else {
                wallMap.set(key, {
                    wallID: wallIDCounter++,
                    startPoint: { coordX: sx, coordY: sy },
                    endPoint: { coordX: ex, coordY: ey },
                    wallHeight: this.config.wallHeight,
                    linked: { startPoint: [], endPoint: [] },
                    roomID: [roomID]
                });
            }
        };
        for (const r of rooms) {
            for (let i = 0; i < xs.length - 1; i++) {
                if (xs[i] >= r.x && xs[i + 1] <= r.x + r.width)
                    addSegment(xs[i], r.y, xs[i + 1], r.y, r.id);
                if (xs[i] >= r.x && xs[i + 1] <= r.x + r.width)
                    addSegment(xs[i], r.y + r.height, xs[i + 1], r.y + r.height, r.id);
            }
            for (let i = 0; i < ys.length - 1; i++) {
                if (ys[i] >= r.y && ys[i + 1] <= r.y + r.height)
                    addSegment(r.x, ys[i], r.x, ys[i + 1], r.id);
                if (ys[i] >= r.y && ys[i + 1] <= r.y + r.height)
                    addSegment(r.x + r.width, ys[i], r.x + r.width, ys[i + 1], r.id);
            }
        }
        const finalWalls = Array.from(wallMap.values());
        for (const room of rooms) {
            const roomWalls = finalWalls.filter(w => w.roomID.includes(room.id));
            const top = roomWalls.filter(w => w.startPoint.coordY === room.y && w.endPoint.coordY === room.y)
                .sort((a, b) => Math.min(a.startPoint.coordX, a.endPoint.coordX) - Math.min(b.startPoint.coordX, b.endPoint.coordX));
            const right = roomWalls.filter(w => w.startPoint.coordX === room.x + room.width && w.endPoint.coordX === room.x + room.width)
                .sort((a, b) => Math.min(a.startPoint.coordY, a.endPoint.coordY) - Math.min(b.startPoint.coordY, b.endPoint.coordY));
            const bottom = roomWalls.filter(w => w.startPoint.coordY === room.y + room.height && w.endPoint.coordY === room.y + room.height)
                .sort((a, b) => Math.max(b.startPoint.coordX, b.endPoint.coordX) - Math.max(a.startPoint.coordX, a.endPoint.coordX));
            const left = roomWalls.filter(w => w.startPoint.coordX === room.x && w.endPoint.coordX === room.x)
                .sort((a, b) => Math.max(b.startPoint.coordY, b.endPoint.coordY) - Math.max(a.startPoint.coordY, a.endPoint.coordY));
            room.wallIDs = [...top, ...right, ...bottom, ...left].map(w => w.wallID);
        }
        return finalWalls;
    }
    linkWalls(walls) {
        const isSame = (p1, p2) => p1.coordX === p2.coordX && p1.coordY === p2.coordY;
        for (const wall of walls) {
            for (const other of walls) {
                if (wall.wallID === other.wallID)
                    continue;
                const refRoom = other.roomID[0];
                if (isSame(wall.startPoint, other.startPoint) || isSame(wall.startPoint, other.endPoint)) {
                    wall.linked.startPoint.push({ wallID: other.wallID, roomID: refRoom });
                }
                if (isSame(wall.endPoint, other.startPoint) || isSame(wall.endPoint, other.endPoint)) {
                    wall.linked.endPoint.push({ wallID: other.wallID, roomID: refRoom });
                }
            }
        }
    }
    // -----------------------------
    // ROOF EXPANSION ALGORITHM (4 CORNERS ONLY - 3D CONTINUOUS LOOP)
    // -----------------------------
    generateRoof(walls, rooms) {
        // Locked to exactly 1 grid space on your board
        const ROOF_OFFSET = 30;
        let roofIDCounter = 10000;
        // 1. Find the absolute outer boundaries of the entire house
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        rooms.forEach(r => {
            if (r.x < minX)
                minX = r.x;
            if (r.y < minY)
                minY = r.y;
            if (r.x + r.width > maxX)
                maxX = r.x + r.width;
            if (r.y + r.height > maxY)
                maxY = r.y + r.height;
        });
        // 2. Map which rooms touch each side
        const topRooms = rooms.filter(r => r.y === minY).map(r => r.id);
        const bottomRooms = rooms.filter(r => r.y + r.height === maxY).map(r => r.id);
        const leftRooms = rooms.filter(r => r.x === minX).map(r => r.id);
        const rightRooms = rooms.filter(r => r.x + r.width === maxX).map(r => r.id);
        // 3. Push the boundaries outwards by the ROOF_OFFSET
        const rMinX = minX - ROOF_OFFSET;
        const rMinY = minY - ROOF_OFFSET;
        const rMaxX = maxX + ROOF_OFFSET;
        const rMaxY = maxY + ROOF_OFFSET;
        // 4. Create exactly 4 roof walls in a PERFECT CLOCKWISE LOOP 
        // This prevents the 3D Roof renderer from twisting the geometry!
        const roofWalls = [
            {
                wallID: roofIDCounter++,
                startPoint: { coordX: rMinX, coordY: rMinY },
                endPoint: { coordX: rMaxX, coordY: rMinY },
                wallHeight: this.config.wallHeight,
                linked: { startPoint: [], endPoint: [] },
                roomID: topRooms
            },
            {
                wallID: roofIDCounter++,
                startPoint: { coordX: rMaxX, coordY: rMinY },
                endPoint: { coordX: rMaxX, coordY: rMaxY },
                wallHeight: this.config.wallHeight,
                linked: { startPoint: [], endPoint: [] },
                roomID: rightRooms
            },
            {
                wallID: roofIDCounter++,
                startPoint: { coordX: rMaxX, coordY: rMaxY },
                endPoint: { coordX: rMinX, coordY: rMaxY },
                wallHeight: this.config.wallHeight,
                linked: { startPoint: [], endPoint: [] },
                roomID: bottomRooms
            },
            {
                wallID: roofIDCounter++,
                startPoint: { coordX: rMinX, coordY: rMaxY },
                endPoint: { coordX: rMinX, coordY: rMinY },
                wallHeight: this.config.wallHeight,
                linked: { startPoint: [], endPoint: [] },
                roomID: leftRooms
            }
        ];
        // 5. Link only these 4 corners together
        this.linkWalls(roofWalls);
        return roofWalls;
    }
    // -----------------------------
    // GRAPH-BASED DOOR & WINDOW LOGIC (WITH COLLISION PADDING)
    // -----------------------------
    generateDoorsAndWindows(walls, rooms) {
        const doors = [];
        const windows = [];
        let doorID = 1;
        let windowID = 1;
        // --- SCALED TO MATCH YOUR PIXI GRID & THICKNESS ---
        const DOOR_SIZE = 16;
        const WINDOW_SIZE = 60;
        const CORNER_PAD = 30; // Requires exactly 1 grid square from the corner
        const ITEM_PAD = 15; // Minimum distance between two items
        const occupiedSpaces = new Map();
        const getWallLength = (w) => Math.hypot(w.endPoint.coordX - w.startPoint.coordX, w.endPoint.coordY - w.startPoint.coordY);
        const interiorWalls = walls.filter(w => w.roomID.length === 2);
        const exteriorWalls = walls.filter(w => w.roomID.length === 1);
        const connections = new Map();
        interiorWalls.forEach(w => {
            const r1 = Math.min(w.roomID[0], w.roomID[1]);
            const r2 = Math.max(w.roomID[0], w.roomID[1]);
            const key = `${r1}-${r2}`;
            if (!connections.has(key))
                connections.set(key, []);
            connections.get(key).push(w);
        });
        const potentialInternalConnections = [];
        connections.forEach((sharedSegments, key) => {
            const [r1, r2] = key.split('-').map(Number);
            const validWalls = sharedSegments.filter(w => getWallLength(w) >= (CORNER_PAD * 2 + DOOR_SIZE));
            if (validWalls.length > 0) {
                potentialInternalConnections.push({ r1, r2, walls: validWalls.sort((a, b) => getWallLength(b) - getWallLength(a)) });
            }
        });
        const parent = new Map();
        rooms.forEach(r => parent.set(r.id, r.id));
        const find = (i) => {
            if (parent.get(i) === i)
                return i;
            const root = find(parent.get(i));
            parent.set(i, root);
            return root;
        };
        const union = (i, j) => parent.set(find(i), find(j));
        this.shuffleArray(potentialInternalConnections);
        // 1. PLACE INTERNAL DOORS
        for (const conn of potentialInternalConnections) {
            const root1 = find(conn.r1);
            const root2 = find(conn.r2);
            const isMandatory = root1 !== root2;
            const isRandomExtra = Math.random() < this.config.doorProbability;
            if (isMandatory || isRandomExtra) {
                let placed = false;
                for (const w of conn.walls) {
                    const pos = this.findPlacementOnWall(w, DOOR_SIZE, CORNER_PAD, ITEM_PAD, occupiedSpaces);
                    if (pos !== null) {
                        doors.push(this.createObjectNode("door", doorID++, w, pos.coordX, pos.coordY));
                        this.markWallOccupied(w.wallID, pos.distanceAlongWall, DOOR_SIZE, occupiedSpaces);
                        if (isMandatory)
                            union(root1, root2);
                        placed = true;
                        break;
                    }
                }
                if (!placed && isMandatory) {
                    const fallbackWall = conn.walls[0];
                    const midX = Math.round((fallbackWall.startPoint.coordX + fallbackWall.endPoint.coordX) / 2);
                    const midY = Math.round((fallbackWall.startPoint.coordY + fallbackWall.endPoint.coordY) / 2);
                    doors.push(this.createObjectNode("door", doorID++, fallbackWall, midX, midY));
                    union(root1, root2);
                }
            }
        }
        // 2. PLACE FRONT DOOR (Exterior)
        const validFrontWalls = exteriorWalls.filter(w => getWallLength(w) >= (CORNER_PAD * 2 + DOOR_SIZE));
        this.shuffleArray(validFrontWalls);
        for (const w of validFrontWalls) {
            const pos = this.findPlacementOnWall(w, DOOR_SIZE, CORNER_PAD, ITEM_PAD, occupiedSpaces);
            if (pos !== null) {
                doors.push(this.createObjectNode("door", doorID++, w, pos.coordX, pos.coordY));
                this.markWallOccupied(w.wallID, pos.distanceAlongWall, DOOR_SIZE, occupiedSpaces);
                break;
            }
        }
        // 3. PLACE WINDOWS
        for (const w of exteriorWalls) {
            if (Math.random() < this.config.windowProbability) {
                const maxWindowsToTry = getWallLength(w) > 150 ? 2 : 1;
                for (let i = 0; i < maxWindowsToTry; i++) {
                    const pos = this.findPlacementOnWall(w, WINDOW_SIZE, CORNER_PAD, ITEM_PAD, occupiedSpaces);
                    if (pos !== null) {
                        windows.push(this.createObjectNode("window", windowID++, w, pos.coordX, pos.coordY));
                        this.markWallOccupied(w.wallID, pos.distanceAlongWall, WINDOW_SIZE, occupiedSpaces);
                    }
                }
            }
        }
        return { doors, windows };
    }
    // -----------------------------
    // ROOM TYPE ASSIGNMENT HEURISTICS
    // -----------------------------
    assignRoomTypes(rooms) {
        // Sort rooms by Area (Ascending: Smallest first, Largest last)
        const sortedRooms = [...rooms].sort((a, b) => (a.width * a.height) - (b.width * b.height));
        let bathCount = this.config.numBathrooms;
        let bedCount = this.config.numBedrooms;
        let needsLiving = true;
        let needsKitchen = true;
        // 1. Assign Bathrooms to the SMALLEST rooms
        for (let i = 0; i < sortedRooms.length; i++) {
            if (bathCount > 0 && !sortedRooms[i].roomType) {
                sortedRooms[i].roomType = "bathroom";
                bathCount--;
            }
        }
        // 2. Assign remaining rooms from LARGEST to SMALLEST
        for (let i = sortedRooms.length - 1; i >= 0; i--) {
            if (sortedRooms[i].roomType)
                continue; // Skip if already a bathroom
            if (needsLiving) {
                // The absolute biggest available room is the living room
                sortedRooms[i].roomType = "living_room";
                needsLiving = false;
            }
            else if (bedCount > 0) {
                // Next biggest rooms are bedrooms
                sortedRooms[i].roomType = "bedroom";
                bedCount--;
            }
            else if (needsKitchen) {
                // Next reasonably sized room is the kitchen
                sortedRooms[i].roomType = "kitchen";
                needsKitchen = false;
            }
            else {
                // Everything else gets labeled "other" (hallways, closets, dining, etc)
                sortedRooms[i].roomType = "other";
            }
        }
        // Failsafe: Ensure all rooms have a label
        rooms.forEach(r => {
            if (!r.roomType)
                r.roomType = "other";
        });
    }
    // --- HELPER: FINDS A RANDOM, UNOCCUPIED GAP ON A WALL ---
    findPlacementOnWall(wall, objSize, cornerPad, itemPad, occupiedSpaces) {
        const dx = wall.endPoint.coordX - wall.startPoint.coordX;
        const dy = wall.endPoint.coordY - wall.startPoint.coordY;
        const wallLength = Math.hypot(dx, dy);
        let validRanges = [{ min: cornerPad + objSize / 2, max: wallLength - cornerPad - objSize / 2 }];
        const existingObjects = occupiedSpaces.get(wall.wallID) || [];
        for (const occ of existingObjects) {
            const blockMin = occ.center - occ.size / 2 - itemPad - objSize / 2;
            const blockMax = occ.center + occ.size / 2 + itemPad + objSize / 2;
            const nextRanges = [];
            for (const r of validRanges) {
                if (blockMax <= r.min || blockMin >= r.max) {
                    nextRanges.push(r);
                }
                else {
                    if (blockMin > r.min)
                        nextRanges.push({ min: r.min, max: blockMin });
                    if (blockMax < r.max)
                        nextRanges.push({ min: blockMax, max: r.max });
                }
            }
            validRanges = nextRanges;
        }
        validRanges = validRanges.filter(r => r.max >= r.min);
        if (validRanges.length === 0)
            return null;
        const chosenRange = validRanges[Math.floor(Math.random() * validRanges.length)];
        const randomDistance = Math.random() * (chosenRange.max - chosenRange.min) + chosenRange.min;
        const t = randomDistance / wallLength;
        return {
            coordX: Math.round(wall.startPoint.coordX + t * dx),
            coordY: Math.round(wall.startPoint.coordY + t * dy),
            distanceAlongWall: randomDistance
        };
    }
    markWallOccupied(wallID, centerDist, size, occupiedSpaces) {
        if (!occupiedSpaces.has(wallID))
            occupiedSpaces.set(wallID, []);
        occupiedSpaces.get(wallID).push({ center: centerDist, size: size });
    }
    createObjectNode(type, id, wall, x, y) {
        if (type === "door") {
            return { door: { doorID: id, centerPoint: { coordX: x, coordY: y }, partOfWall: wall.wallID } };
        }
        else {
            return { window: { windowID: id, centerPoint: { coordX: x, coordY: y }, partOfWall: wall.wallID } };
        }
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
