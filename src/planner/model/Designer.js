export class Designer {
    plan;
    createHousePlan(length, width, numRooms) {
        const rooms = [];
        const walls = [];
        const roof = [];
        const startX = 400;
        const startY = 200;
        length *= 60;
        width *= 60;
        const sqrtRooms = Math.ceil(Math.sqrt(numRooms));
        const rows = Math.ceil(numRooms / sqrtRooms);
        const cols = sqrtRooms;
        //const roomWidth = width / cols;
        //const roomLength = length / rows;
        let wUsed = 0;
        let lUsed = Array(cols).fill(0);
        let roomWidth = 0;
        let roomLength = 0;
        let wallID = 0;
        let roomID = 0;
        let currentX = startX;
        let currentY = startY;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let wMax = (width) / cols;
                let lMax = (length) / rows;
                roomWidth = Math.random() * (wMax - 30) + 30;
                //roomLength =  Math.random() * (lMax - 30) + 30; 
                //if(j == cols - 1) roomWidth = wMax;
                roomLength = lMax;
                if (j == cols - 1 || roomID == numRooms) {
                    roomWidth = width - wUsed;
                    console.log("used : " + wUsed + " , width: " + width);
                    wUsed = 0;
                }
                console.log("roomWidth : " + roomWidth);
                if (i == rows - 1) {
                    roomLength = length - lUsed[j];
                    console.log("L used : " + lUsed[j] + " , length: " + length);
                    lUsed[j] = 0;
                }
                console.log("roomLength : " + roomLength);
                wUsed += roomWidth;
                lUsed[j] += roomLength;
                if (roomID > numRooms)
                    break;
                // Create the four walls of each room
                const roomWallsID = [];
                // Wall 1 (top)
                const wall1 = {
                    wallID: wallID++,
                    startPoint: { coordX: currentX, coordY: currentY },
                    endPoint: { coordX: currentX + roomWidth, coordY: currentY },
                    wallHeight: 10,
                    linked: { startPoint: [], endPoint: [] },
                    roomID: [roomID]
                };
                roomWallsID.push(wall1.wallID);
                walls.push({ wall: wall1 });
                // Wall 2 (right)
                const wall2 = {
                    wallID: wallID++,
                    startPoint: { coordX: currentX + roomWidth, coordY: currentY },
                    endPoint: { coordX: currentX + roomWidth, coordY: currentY + roomLength },
                    wallHeight: 10,
                    linked: { startPoint: [], endPoint: [] },
                    roomID: [roomID]
                };
                roomWallsID.push(wall2.wallID);
                walls.push({ wall: wall2 });
                // Wall 3 (bottom)
                const wall3 = {
                    wallID: wallID++,
                    startPoint: { coordX: currentX + roomWidth, coordY: currentY + roomLength },
                    endPoint: { coordX: currentX, coordY: currentY + roomLength },
                    wallHeight: 10,
                    linked: { startPoint: [], endPoint: [] },
                    roomID: [roomID]
                };
                roomWallsID.push(wall3.wallID);
                walls.push({ wall: wall3 });
                // Wall 4 (left)
                const wall4 = {
                    wallID: wallID++,
                    startPoint: { coordX: currentX, coordY: currentY + roomLength },
                    endPoint: { coordX: currentX, coordY: currentY },
                    wallHeight: 10,
                    linked: { startPoint: [], endPoint: [] },
                    roomID: [roomID]
                };
                roomWallsID.push(wall4.wallID);
                walls.push({ wall: wall4 });
                // Create room
                rooms.push({
                    room: {
                        roomID: roomID++,
                        wallsID: roomWallsID
                    }
                });
                // Update currentX to place the next room
                currentX += roomWidth;
            }
            currentX = startX;
            currentY += roomLength;
            wUsed = 0;
        }
        currentX = 370;
        currentY = 170;
        // Create roof walls (same as floor walls in this simple model)
        // Wall 1 (top)
        const roof1 = {
            wallID: wallID++,
            startPoint: { coordX: currentX, coordY: currentY },
            endPoint: { coordX: currentX + width + 60, coordY: currentY },
            wallHeight: 10,
            linked: { startPoint: [], endPoint: [] },
            roomID: [roomID]
        };
        // roomWallsID.push(roof1.wallID);
        roof.push({ wall: roof1 });
        // Wall 2 (right)
        const roof2 = {
            wallID: wallID++,
            startPoint: { coordX: currentX + width + 60, coordY: currentY },
            endPoint: { coordX: currentX + width + 60, coordY: currentY + length + 60 },
            wallHeight: 10,
            linked: { startPoint: [], endPoint: [] },
            roomID: [roomID]
        };
        // roomWallsID.push(roof2.wallID);
        roof.push({ wall: roof2 });
        // Wall 3 (bottom)
        console.log("de ce nu face nimic!!!!!!!!!!!!!!!!!!" + currentX + width + 60);
        const roof3 = {
            wallID: wallID++,
            startPoint: { coordX: currentX + width + 60, coordY: currentY + length + 60 },
            endPoint: { coordX: currentX, coordY: currentY + length + 60 },
            wallHeight: 10,
            linked: { startPoint: [], endPoint: [] },
            roomID: [roomID]
        };
        // roomWallsID.push(roof3.wallID);
        roof.push({ wall: roof3 });
        // Wall 4 (left)
        const roof4 = {
            wallID: wallID++,
            startPoint: { coordX: currentX, coordY: currentY + length + 60 },
            endPoint: { coordX: currentX, coordY: currentY },
            wallHeight: 10,
            linked: { startPoint: [], endPoint: [] },
            roomID: [roomID]
        };
        // roomWallsID.push(roof4.wallID);
        roof.push({ wall: roof4 });
        let p = {
            rooms: rooms,
            walls: walls,
            roof: roof,
            objects: {
                doors: [],
                windows: [],
                furniture: []
            }
        };
        console.log(p);
        this.plan = p;
        return p;
    }
    buildModel(planner2D) {
        // planner2D.clearBoard();
        if (this.plan)
            planner2D.buildModel(this.plan);
    }
}
