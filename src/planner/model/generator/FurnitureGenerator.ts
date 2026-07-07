import { furnitureAssets, FurnitureItem } from "../../../pages/generated-assets";
import { Plan } from "../Parser";

export class FurnitureGenerator {

    // Cache so we don't download the same OBJ file multiple times per generation
    private dimensionCache: Map<string, { width: number, depth: number }> = new Map();

    public validatePlan(plan: Plan): boolean {
        if (!plan || !plan.rooms || plan.rooms.length === 0) return false;
        for (const roomNode of plan.rooms) {
            // @ts-ignore
            if (!roomNode.room.roomType || roomNode.room.roomType.trim() === "") return false;
        }
        return true;
    }

    // --- NEW: ASYNC GENERATOR ---
    public async generate(plan: Plan): Promise<Plan> {
        let newPlan: Plan = JSON.parse(JSON.stringify(plan));
        
        if (!newPlan.objects) newPlan.objects = { windows: [], doors: [], furniture: [] };
        newPlan.objects.furniture = []; 

        let pieceIDCounter = Math.floor(Math.random() * 100000); 

        for (const roomNode of newPlan.rooms) {
            const room = roomNode.room;
            // @ts-ignore
            const type = (room.roomType || "other").toLowerCase();
            
            let roomPieces = furnitureAssets.filter((f: FurnitureItem) => f.roomType === type);
            if (roomPieces.length === 0) {
                roomPieces = furnitureAssets.filter((f: FurnitureItem) => f.roomType === "other");
            }
            
            const geom = this.analyzeRoomGeometry(room, newPlan);

            const mainWallPieces = roomPieces.filter(p => p.role === "main_wall");
            const secondWallPieces = roomPieces.filter(p => p.role === "second_wall");
            const centerPieces = roomPieces.filter(p => p.role === "center");

            // PLACEMENT
            if (mainWallPieces.length > 0 && geom.walls.length > 0) {
                await this.placeGroupOnGrid(geom.walls[0], mainWallPieces, geom, newPlan, pieceIDCounter, room.roomID);
                pieceIDCounter += mainWallPieces.length;
            }

            if (secondWallPieces.length > 0 && geom.walls.length > 1) {
                await this.placeGroupOnGrid(geom.walls[1], secondWallPieces, geom, newPlan, pieceIDCounter, room.roomID);
                pieceIDCounter += secondWallPieces.length;
            }

            if (centerPieces.length > 0) {
                await this.placeGroupInCenter(centerPieces, geom.centerX, geom.centerY, newPlan, pieceIDCounter, room.roomID);
                pieceIDCounter += centerPieces.length;
            }
        }

        return newPlan;
    }

    // --- 1. FETCH BOUNDING BOX FROM OBJ ON THE FLY ---
    private async getDimensions(piece: FurnitureItem): Promise<{ width: number, depth: number }> {
        if (this.dimensionCache.has(piece.obj)) {
            return this.dimensionCache.get(piece.obj)!;
        }

        try {
            // Fetch the text of the OBJ file
            const response = await fetch(piece.obj);
            const text = await response.text();

            let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
            const lines = text.split('\n');

            for (const line of lines) {
                if (line.startsWith('v ')) {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 4) {
                        const x = parseFloat(parts[1]);
                        const z = parseFloat(parts[3]); // Z is depth in 3D
                        if (!isNaN(x)) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
                        if (!isNaN(z)) { minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); }
                    }
                }
            }

            // Multiply by model scale to get exact grid units
            const dims = { 
                width: (maxX - minX) * piece.scale, 
                depth: (maxZ - minZ) * piece.scale 
            };

            this.dimensionCache.set(piece.obj, dims);
            return dims;

        } catch (e) {
            console.error(`Failed to load dimensions for ${piece.name}`, e);
            return { width: 50, depth: 50 }; // Fallback
        }
    }

    // --- 2. STRICT GRID-AXIS PLACEMENT ---
    private async placeGroupOnGrid(wall: any, pieces: FurnitureItem[], geom: any, plan: Plan, startId: number, roomID: number) {
        const midX = (wall.startPoint.coordX + wall.endPoint.coordX) / 2;
        const midY = (wall.startPoint.coordY + wall.endPoint.coordY) / 2;
        
        // Determine if this wall should be treated as Horizontal (X-Axis) or Vertical (Y-Axis)
        const isHorizontal = Math.abs(wall.endPoint.coordX - wall.startPoint.coordX) > Math.abs(wall.endPoint.coordY - wall.startPoint.coordY);

        let moveX = 0, moveY = 0; // The axis we slide along to place items side-by-side
        let nx = 0, ny = 0;       // The normal pointing into the room
        let rotation = 0;

        if (isHorizontal) {
            moveX = 1; // Slide along X axis
            // Does room center sit below or above the wall?
            ny = geom.centerY > midY ? 1 : -1; 
            // Strict 90 degree orientations
            rotation = ny === 1 ? Math.PI : 0; 
        } else {
            moveY = 1; // Slide along Y axis
            // Does room center sit right or left of the wall?
            nx = geom.centerX > midX ? 1 : -1;
            // Strict 90 degree orientations
            rotation = nx === 1 ? -(Math.PI / 2) : (Math.PI / 2);
        }

        // Get dimensions dynamically
        const pieceData = [];
        let totalWidth = 0;

        for (const piece of pieces) {
            const dims = await this.getDimensions(piece);
            pieceData.push({ piece, width: dims.width, depth: dims.depth });
            totalWidth += dims.width;
        }

        // Start Cursor at the exact edge of where the group begins
        let cursorX = midX - (moveX * (totalWidth / 2));
        let cursorY = midY - (moveY * (totalWidth / 2));

        for (const data of pieceData) {
            // 1. Move cursor forward by HALF of this piece's width to find its center
            cursorX += moveX * (data.width / 2);
            cursorY += moveY * (data.width / 2);

            // 2. Final position = Cursor Position + Push inwards off the wall by half its depth
            const finalX = cursorX + (nx * (data.depth / 2));
            const finalY = cursorY + (ny * (data.depth / 2));

            plan.objects.furniture!.push({
                piece: {
                    pieceID: startId++,
                    typeID: data.piece.id,
                    rotation: rotation,
                    centerPoint: {
                        coordX: Math.round(finalX),
                        coordY: Math.round(finalY)
                    },
                    partOfRoom: roomID
                }
            });

            // 3. Move cursor forward by the OTHER HALF of this piece's width so the next item touches its edge perfectly
            cursorX += moveX * (data.width / 2);
            cursorY += moveY * (data.width / 2);
        }
    }

    private async placeGroupInCenter(pieces: FurnitureItem[], centerX: number, centerY: number, plan: Plan, startId: number, roomID: number) {
        const pieceData = [];
        let totalWidth = 0;

        for (const piece of pieces) {
            const dims = await this.getDimensions(piece);
            pieceData.push({ piece, width: dims.width, depth: dims.depth });
            totalWidth += dims.width;
            // Add a small 20-unit gap between center items so they don't visually merge
            totalWidth += 20; 
        }

        totalWidth -= 20; // remove trailing gap

        let cursorX = centerX - (totalWidth / 2);

        for (const data of pieceData) {
            cursorX += (data.width / 2);

            plan.objects.furniture!.push({
                piece: {
                    pieceID: startId++,
                    typeID: data.piece.id,
                    rotation: 0,
                    centerPoint: {
                        coordX: Math.round(cursorX),
                        coordY: Math.round(centerY)
                    },
                    partOfRoom: roomID
                }
            });

            cursorX += (data.width / 2) + 20;
        }
    }

    private analyzeRoomGeometry(room: any, plan: Plan) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        const roomWalls = plan.walls
            .map(w => w.wall)
            .filter(w => room.wallsID.includes(w.wallID));

        roomWalls.forEach(w => {
            minX = Math.min(minX, w.startPoint.coordX, w.endPoint.coordX);
            maxX = Math.max(maxX, w.startPoint.coordX, w.endPoint.coordX);
            minY = Math.min(minY, w.startPoint.coordY, w.endPoint.coordY);
            maxY = Math.max(maxY, w.startPoint.coordY, w.endPoint.coordY);
        });

        const sortedWalls = roomWalls.filter(w => {
            const hasDoor = plan.objects.doors?.some(d => d.door.partOfWall === w.wallID);
            return !hasDoor;
        }).sort((a, b) => {
            const lenA = Math.hypot(a.endPoint.coordX - a.startPoint.coordX, a.endPoint.coordY - a.startPoint.coordY);
            const lenB = Math.hypot(b.endPoint.coordX - b.startPoint.coordX, b.endPoint.coordY - b.startPoint.coordY);
            return lenB - lenA; 
        });

        const finalWalls = sortedWalls.length >= 2 ? sortedWalls : roomWalls.sort((a, b) => {
            const lenA = Math.hypot(a.endPoint.coordX - a.startPoint.coordX, a.endPoint.coordY - a.startPoint.coordY);
            const lenB = Math.hypot(b.endPoint.coordX - b.startPoint.coordX, b.endPoint.coordY - b.startPoint.coordY);
            return lenB - lenA; 
        });

        return {
            centerX: minX + (maxX - minX) / 2,
            centerY: minY + (maxY - minY) / 2,
            walls: finalWalls 
        };
    }
}