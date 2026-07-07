import { Viewer2D } from "../viewer2d/Viewer2D";
import { Wall } from "../viewer2d/Wall";

 export interface Plan {
    rooms: {
        room: {
            roomID: number,
            wallsID: number[],
            roomType?: string
        }
    }[];
    walls: { 
        wall: {
            wallID: number,
            startPoint: {
                coordX: number,
                coordY:number
            }; 
            endPoint: {
                coordX: number, 
                coordY:number
            }; 
            wallHeight: number,
            linked: {
                startPoint: {
                    wallID: number,
                    roomID: number
                }[],
                endPoint: {
                    wallID: number,
                    roomID: number
                }[]
            },
            roomID: number[]
        }
    }[];
    roof: { 
        wall: {
            wallID: number,
            startPoint: {
                coordX: number,
                coordY:number
            }; 
            endPoint: {
                coordX: number, 
                coordY:number
            }; 
            wallHeight: number,
            linked: {
                startPoint: {
                    wallID: number,
                    roomID: number
                }[],
                endPoint: {
                    wallID: number,
                    roomID: number
                }[]
            },
            roomID: number[]
        }
    }[];
    objects : {
        windows: {
            window: {
                windowID: number,
                centerPoint: {
                    coordX: number,
                    coordY: number
                },
                partOfWall: number
            }
        }[],
        doors: {
            door: {
                doorID: number,
                centerPoint: {
                    coordX: number,
                    coordY: number
                },
                partOfWall: number
            }
        }[],
        furniture: {
            piece: {
                pieceID: number,
                typeID: number,
                rotation: number,
                centerPoint: {
                    coordX: number,
                    coordY: number
                },
                partOfRoom: number
            }
        }[]
    }
 }
 
 
 export class Parser {
    json:string | undefined;
    plan:Plan | undefined;
    public readJSON(json: string) {
        this.json = json;
        console.log("json: " + json)
        this.plan = JSON.parse(json);
        console.log("plan: " + this.plan)

    }

    buildModel(planner2D: Viewer2D) {
       // planner2D.clearBoard();
        if(this.plan) planner2D.buildModel(this.plan);
    }

    public printJSON() {
        //console.log("this function right here");
        console.log(this.plan);
    }
 }