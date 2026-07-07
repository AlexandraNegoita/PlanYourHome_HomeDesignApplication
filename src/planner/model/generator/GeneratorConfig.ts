export interface GeneratorConfig {
    houseWidth: number;
    houseHeight: number;
    rooms: number;
    minRoomSize: number;
    maxRoomSize: number;
    wallHeight: number;
    windowProbability: number; 
    doorProbability: number;
    maxRetries: number;

    numBedrooms: number;
    numBathrooms: number;
}