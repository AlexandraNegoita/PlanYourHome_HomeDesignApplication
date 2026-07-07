import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

export type PlacementRole = "main_wall" | "second_wall" | "center" | "center_offset";

interface FurnitureItem {
    id: number;
    name: string;
    roomType: string;         
    role: PlacementRole;      
    floorplanPath: string;
    menuIconPath: string;
    obj: string;
    mtl: string;
    scale: number;
}

const SYMBOLS_DIR = path.join(__dirname, 'assets/symbols');
const OBJ_DIR = path.join(__dirname, 'assets/furniture/obj');
const MTL_DIR = path.join(__dirname, 'assets/furniture/mtl');
const ICONS_DIR = path.join(__dirname, 'assets/icons');
const OUTPUT_FILE = path.join(__dirname, 'generated-assets.ts');






const DEFAULT_SCALE = 20;

const scaleOverrides: { [filename: string]: number } = {
    "LivingRoom_1_CouchL": 15,
    "LivingRoom_1_CouchLarge1": 15,
    "LivingRoom_1_CouchLarge2": 15,
    "LivingRoom_1_CouchLarge3": 15,
    "LivingRoom_1_CouchMedium1": 15,
    "LivingRoom_1_CouchMedium2": 15,
    "LivingRoom_1_CouchSmall1": 15,
    "LivingRoom_1_CouchSmall2": 15,
    "Bedroom_1_BedKing": 20,
    "Bedroom_1_BedSingle": 20,
    "Kitchen_1_Drawers1": 30,
    "Kitchen_1_Drawers2": 30,
    "Kitchen_1_Drawers3": 30,
    "Kitchen_1_Fridge": 30,
    "Kitchen_1_OvenLarge": 30,
    "Kitchen_1_Sink": 30

};


function generateAssets(): void {
    const furnitureAssets: FurnitureItem[] = [];
    let currentId = 0;

    let symbolFiles: string[];
    try {
        symbolFiles = fs.readdirSync(SYMBOLS_DIR);
    } catch (error) {
        console.error(`❌ Could not read symbols directory at ${SYMBOLS_DIR}`);
        return;
    }

    symbolFiles.forEach((file: string) => {
        if (!file.endsWith('.png')) return;

        const baseName = path.parse(file).name;
        const parts = baseName.split('_');
        
        let roomType = "other";
        let roleCode = "3"; 
        let displayName = baseName;

        if (parts.length >= 3 && !isNaN(parseInt(parts[1]))) {
            roomType = parts[0].toLowerCase();
            roleCode = parts[1];
            displayName = parts.slice(2).join(' '); 
        } else {
            displayName = baseName.replace(/_/g, ' ');
        }

        let placementRole: PlacementRole = "center";
        if (roleCode === "1") placementRole = "main_wall";
        if (roleCode === "2") placementRole = "second_wall";
        if (roleCode === "3") placementRole = "center";
        if (roleCode === "4") placementRole = "center_offset";

        const objFileName = `${baseName}.obj`;
        const mtlFileName = `${baseName}.mtl`;
        const iconFileName = `${baseName}.png`;

        const objPath = path.join(OBJ_DIR, objFileName);
        const objExists = fs.existsSync(objPath);
        const mtlExists = fs.existsSync(path.join(MTL_DIR, mtlFileName));

        if (objExists && mtlExists) {
            
            
            
            
            const finalScale = scaleOverrides[baseName] !== undefined 
                ? scaleOverrides[baseName] 
                : DEFAULT_SCALE;

            const hasIcon = fs.existsSync(path.join(ICONS_DIR, iconFileName));
            const menuIconPath = hasIcon ? `./assets/icons/${iconFileName}` : `./assets/symbols/${file}`;

            furnitureAssets.push({
                id: currentId,
                name: displayName,
                roomType: roomType,
                role: placementRole,
                floorplanPath: `./assets/symbols/${file}`,
                menuIconPath: menuIconPath,
                obj: `./assets/furniture/obj/${objFileName}`,
                mtl: `./assets/furniture/mtl/${mtlFileName}`,
                scale: finalScale
            });

            currentId++;
        }
    });

    const fileContent = `
import * as PIXI from "pixi.js";

export type PlacementRole = "main_wall" | "second_wall" | "center" | "center_offset";

export interface FurnitureItem {
    id: number;
    name: string;
    roomType: string;
    role: PlacementRole;
    floorplanPath: string;
    floorplanTexture?: PIXI.Texture;
    menuIconPath: string;
    obj: string;
    mtl: string;
    scale: number;
}

export const furnitureAssets: FurnitureItem[] = ${JSON.stringify(furnitureAssets, null, 4)};
    `;

    fs.writeFileSync(OUTPUT_FILE, fileContent.trim());
    console.log(`Successfully generated ${furnitureAssets.length} merged assets.`);
}

generateAssets();