import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Points to your script's folder

// Directories to rename files inside
const DIRS = {
    symbols: path.join(__dirname, 'assets/symbols'),
    icons: path.join(__dirname, 'assets/icons'),
    obj: path.join(__dirname, 'assets/furniture/obj'),
    mtl: path.join(__dirname, 'assets/furniture/mtl')
};

// The mapping: "Old_Name" : "Room_Role_Name"
// Roles: 1 (Main Wall), 2 (Second Wall), 3 (Center), 4 (Center Offset)
const renameMap = {
    "Bathroom_Bathtub": "Bathroom_1_Bathtub",
    "Bathroom_Shower1": "Bathroom_1_Shower1",
    "Bathroom_Sink": "Bathroom_2_Sink",
    "Bathroom_Toilet": "Bathroom_2_Toilet",
    "Bathroom_Toilet2": "Bathroom_2_Toilet2",
    "Bathroom_WashingMachine": "Bathroom_2_WashingMachine",
    
    "Bed_King": "Bedroom_1_BedKing",
    "Bed_Single": "Bedroom_1_BedSingle",
    "NightStand_1": "Bedroom_1_NightStand1",
    "NightStand_3": "Bedroom_1_NightStand3",
    "Drawer_1": "Bedroom_2_Drawer1",
    "Drawer_2": "Bedroom_2_Drawer2",
    "Light_Stand1": "Bedroom_2_LightStand1",
    "Carpet_2": "Bedroom_3_Carpet2",

    "Couch_L": "LivingRoom_1_CouchL",
    "Couch_Large1": "LivingRoom_1_CouchLarge1",
    "Couch_Large2": "LivingRoom_1_CouchLarge2",
    "Couch_Large3": "LivingRoom_1_CouchLarge3",
    "Couch_Medium1": "LivingRoom_1_CouchMedium1",
    "Couch_Medium2": "LivingRoom_1_CouchMedium2",
    "Couch_Small1": "LivingRoom_1_CouchSmall1",
    "Couch_Small2": "LivingRoom_1_CouchSmall2",
    "Bookshelf": "LivingRoom_2_Bookshelf",
    "Fireplace": "LivingRoom_2_Fireplace",
    "Shelf_1": "LivingRoom_2_Shelf1",
    "Light_Floor1": "LivingRoom_2_LightFloor1",
    "Carpet_1": "LivingRoom_3_Carpet1",
    "Table_RoundSmall": "LivingRoom_3_TableRoundSmall",

    "Kitchen_1Drawers": "Kitchen_1_Drawers1",
    "Kitchen_2Drawers": "Kitchen_1_Drawers2",
    "Kitchen_3Drawers": "Kitchen_1_Drawers3",
    "Kitchen_Fridge": "Kitchen_1_Fridge",
    "Kitchen_Oven_Large": "Kitchen_1_OvenLarge",
    "Kitchen_Sink": "Kitchen_1_Sink",
    "Trashcan_Cylindric": "Kitchen_2_TrashcanCylindric",
    "Table_RoundLarge": "Kitchen_3_TableRoundLarge",
    "Chair_1": "Kitchen_4_Chair1",
    "Chair_2": "Kitchen_4_Chair2",
    "Chair_3": "Kitchen_4_Chair3",
    "Chair_4": "Kitchen_4_Chair4",
    "Stool": "Kitchen_4_Stool",

    "Carpet_Round": "Other_3_CarpetRound",
    "Houseplant_1": "Other_4_Houseplant1",
    "Houseplant_5": "Other_4_Houseplant5",
    "Houseplant_6": "Other_4_Houseplant6",
    "Houseplant_7": "Other_4_Houseplant7"
};

let successCount = 0;

Object.entries(renameMap).forEach(([oldBaseName, newBaseName]) => {
    // We check all 4 possible file extensions in all 4 folders
    const fileChecks = [
        { dir: DIRS.symbols, ext: '.png' },
        { dir: DIRS.icons, ext: '.png' },
        { dir: DIRS.obj, ext: '.obj' },
        { dir: DIRS.mtl, ext: '.mtl' }
    ];

    fileChecks.forEach(({ dir, ext }) => {
        const oldPath = path.join(dir, `${oldBaseName}${ext}`);
        const newPath = path.join(dir, `${newBaseName}${ext}`);

        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renamed: ${oldBaseName}${ext} ➔ ${newBaseName}${ext}`);
            successCount++;
        }
    });
});

console.log(`\n🎉 Done! Successfully renamed ${successCount} files across all folders.`);
console.log(`You can now re-run your generateAssets() script!`);