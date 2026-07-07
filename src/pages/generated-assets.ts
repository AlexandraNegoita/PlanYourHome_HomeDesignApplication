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

export const furnitureAssets: FurnitureItem[] = [
    {
        "id": 0,
        "name": "Bathtub",
        "roomType": "bathroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Bathroom_1_Bathtub.png",
        "menuIconPath": "./assets/icons/Bathroom_1_Bathtub.png",
        "obj": "./assets/furniture/obj/Bathroom_1_Bathtub.obj",
        "mtl": "./assets/furniture/mtl/Bathroom_1_Bathtub.mtl",
        "scale": 20
    },
    {
        "id": 1,
        "name": "Shower1",
        "roomType": "bathroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Bathroom_1_Shower1.png",
        "menuIconPath": "./assets/icons/Bathroom_1_Shower1.png",
        "obj": "./assets/furniture/obj/Bathroom_1_Shower1.obj",
        "mtl": "./assets/furniture/mtl/Bathroom_1_Shower1.mtl",
        "scale": 20
    },
    {
        "id": 2,
        "name": "Sink",
        "roomType": "bathroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Bathroom_2_Sink.png",
        "menuIconPath": "./assets/icons/Bathroom_2_Sink.png",
        "obj": "./assets/furniture/obj/Bathroom_2_Sink.obj",
        "mtl": "./assets/furniture/mtl/Bathroom_2_Sink.mtl",
        "scale": 20
    },
    {
        "id": 3,
        "name": "Toilet",
        "roomType": "bathroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Bathroom_2_Toilet.png",
        "menuIconPath": "./assets/icons/Bathroom_2_Toilet.png",
        "obj": "./assets/furniture/obj/Bathroom_2_Toilet.obj",
        "mtl": "./assets/furniture/mtl/Bathroom_2_Toilet.mtl",
        "scale": 20
    },
    {
        "id": 4,
        "name": "Toilet2",
        "roomType": "bathroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Bathroom_2_Toilet2.png",
        "menuIconPath": "./assets/icons/Bathroom_2_Toilet2.png",
        "obj": "./assets/furniture/obj/Bathroom_2_Toilet2.obj",
        "mtl": "./assets/furniture/mtl/Bathroom_2_Toilet2.mtl",
        "scale": 20
    },
    {
        "id": 5,
        "name": "WashingMachine",
        "roomType": "bathroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Bathroom_2_WashingMachine.png",
        "menuIconPath": "./assets/icons/Bathroom_2_WashingMachine.png",
        "obj": "./assets/furniture/obj/Bathroom_2_WashingMachine.obj",
        "mtl": "./assets/furniture/mtl/Bathroom_2_WashingMachine.mtl",
        "scale": 20
    },
    {
        "id": 6,
        "name": "BedKing",
        "roomType": "bedroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Bedroom_1_BedKing.png",
        "menuIconPath": "./assets/icons/Bedroom_1_BedKing.png",
        "obj": "./assets/furniture/obj/Bedroom_1_BedKing.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_1_BedKing.mtl",
        "scale": 20
    },
    {
        "id": 7,
        "name": "BedSingle",
        "roomType": "bedroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Bedroom_1_BedSingle.png",
        "menuIconPath": "./assets/icons/Bedroom_1_BedSingle.png",
        "obj": "./assets/furniture/obj/Bedroom_1_BedSingle.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_1_BedSingle.mtl",
        "scale": 20
    },
    {
        "id": 8,
        "name": "NightStand1",
        "roomType": "bedroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Bedroom_1_NightStand1.png",
        "menuIconPath": "./assets/icons/Bedroom_1_NightStand1.png",
        "obj": "./assets/furniture/obj/Bedroom_1_NightStand1.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_1_NightStand1.mtl",
        "scale": 20
    },
    {
        "id": 9,
        "name": "NightStand3",
        "roomType": "bedroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Bedroom_1_NightStand3.png",
        "menuIconPath": "./assets/icons/Bedroom_1_NightStand3.png",
        "obj": "./assets/furniture/obj/Bedroom_1_NightStand3.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_1_NightStand3.mtl",
        "scale": 20
    },
    {
        "id": 10,
        "name": "Drawer1",
        "roomType": "bedroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Bedroom_2_Drawer1.png",
        "menuIconPath": "./assets/icons/Bedroom_2_Drawer1.png",
        "obj": "./assets/furniture/obj/Bedroom_2_Drawer1.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_2_Drawer1.mtl",
        "scale": 20
    },
    {
        "id": 11,
        "name": "Drawer2",
        "roomType": "bedroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Bedroom_2_Drawer2.png",
        "menuIconPath": "./assets/icons/Bedroom_2_Drawer2.png",
        "obj": "./assets/furniture/obj/Bedroom_2_Drawer2.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_2_Drawer2.mtl",
        "scale": 20
    },
    {
        "id": 12,
        "name": "LightStand1",
        "roomType": "bedroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Bedroom_2_LightStand1.png",
        "menuIconPath": "./assets/icons/Bedroom_2_LightStand1.png",
        "obj": "./assets/furniture/obj/Bedroom_2_LightStand1.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_2_LightStand1.mtl",
        "scale": 20
    },
    {
        "id": 13,
        "name": "Carpet2",
        "roomType": "bedroom",
        "role": "center",
        "floorplanPath": "./assets/symbols/Bedroom_3_Carpet2.png",
        "menuIconPath": "./assets/icons/Bedroom_3_Carpet2.png",
        "obj": "./assets/furniture/obj/Bedroom_3_Carpet2.obj",
        "mtl": "./assets/furniture/mtl/Bedroom_3_Carpet2.mtl",
        "scale": 20
    },
    {
        "id": 14,
        "name": "Drawers1",
        "roomType": "kitchen",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Kitchen_1_Drawers1.png",
        "menuIconPath": "./assets/icons/Kitchen_1_Drawers1.png",
        "obj": "./assets/furniture/obj/Kitchen_1_Drawers1.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_1_Drawers1.mtl",
        "scale": 30
    },
    {
        "id": 15,
        "name": "Drawers2",
        "roomType": "kitchen",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Kitchen_1_Drawers2.png",
        "menuIconPath": "./assets/icons/Kitchen_1_Drawers2.png",
        "obj": "./assets/furniture/obj/Kitchen_1_Drawers2.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_1_Drawers2.mtl",
        "scale": 30
    },
    {
        "id": 16,
        "name": "Drawers3",
        "roomType": "kitchen",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Kitchen_1_Drawers3.png",
        "menuIconPath": "./assets/icons/Kitchen_1_Drawers3.png",
        "obj": "./assets/furniture/obj/Kitchen_1_Drawers3.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_1_Drawers3.mtl",
        "scale": 30
    },
    {
        "id": 17,
        "name": "Fridge",
        "roomType": "kitchen",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Kitchen_1_Fridge.png",
        "menuIconPath": "./assets/icons/Kitchen_1_Fridge.png",
        "obj": "./assets/furniture/obj/Kitchen_1_Fridge.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_1_Fridge.mtl",
        "scale": 30
    },
    {
        "id": 18,
        "name": "OvenLarge",
        "roomType": "kitchen",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Kitchen_1_OvenLarge.png",
        "menuIconPath": "./assets/icons/Kitchen_1_OvenLarge.png",
        "obj": "./assets/furniture/obj/Kitchen_1_OvenLarge.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_1_OvenLarge.mtl",
        "scale": 30
    },
    {
        "id": 19,
        "name": "Sink",
        "roomType": "kitchen",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/Kitchen_1_Sink.png",
        "menuIconPath": "./assets/icons/Kitchen_1_Sink.png",
        "obj": "./assets/furniture/obj/Kitchen_1_Sink.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_1_Sink.mtl",
        "scale": 30
    },
    {
        "id": 20,
        "name": "TrashcanCylindric",
        "roomType": "kitchen",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/Kitchen_2_TrashcanCylindric.png",
        "menuIconPath": "./assets/icons/Kitchen_2_TrashcanCylindric.png",
        "obj": "./assets/furniture/obj/Kitchen_2_TrashcanCylindric.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_2_TrashcanCylindric.mtl",
        "scale": 20
    },
    {
        "id": 21,
        "name": "TableRoundLarge",
        "roomType": "kitchen",
        "role": "center",
        "floorplanPath": "./assets/symbols/Kitchen_3_TableRoundLarge.png",
        "menuIconPath": "./assets/icons/Kitchen_3_TableRoundLarge.png",
        "obj": "./assets/furniture/obj/Kitchen_3_TableRoundLarge.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_3_TableRoundLarge.mtl",
        "scale": 20
    },
    {
        "id": 22,
        "name": "Chair1",
        "roomType": "kitchen",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Kitchen_4_Chair1.png",
        "menuIconPath": "./assets/icons/Kitchen_4_Chair1.png",
        "obj": "./assets/furniture/obj/Kitchen_4_Chair1.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_4_Chair1.mtl",
        "scale": 20
    },
    {
        "id": 23,
        "name": "Chair2",
        "roomType": "kitchen",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Kitchen_4_Chair2.png",
        "menuIconPath": "./assets/icons/Kitchen_4_Chair2.png",
        "obj": "./assets/furniture/obj/Kitchen_4_Chair2.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_4_Chair2.mtl",
        "scale": 20
    },
    {
        "id": 24,
        "name": "Chair3",
        "roomType": "kitchen",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Kitchen_4_Chair3.png",
        "menuIconPath": "./assets/icons/Kitchen_4_Chair3.png",
        "obj": "./assets/furniture/obj/Kitchen_4_Chair3.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_4_Chair3.mtl",
        "scale": 20
    },
    {
        "id": 25,
        "name": "Chair4",
        "roomType": "kitchen",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Kitchen_4_Chair4.png",
        "menuIconPath": "./assets/icons/Kitchen_4_Chair4.png",
        "obj": "./assets/furniture/obj/Kitchen_4_Chair4.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_4_Chair4.mtl",
        "scale": 20
    },
    {
        "id": 26,
        "name": "Stool",
        "roomType": "kitchen",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Kitchen_4_Stool.png",
        "menuIconPath": "./assets/icons/Kitchen_4_Stool.png",
        "obj": "./assets/furniture/obj/Kitchen_4_Stool.obj",
        "mtl": "./assets/furniture/mtl/Kitchen_4_Stool.mtl",
        "scale": 20
    },
    {
        "id": 27,
        "name": "CouchL",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchL.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchL.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchL.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchL.mtl",
        "scale": 15
    },
    {
        "id": 28,
        "name": "CouchLarge1",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchLarge1.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchLarge1.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchLarge1.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchLarge1.mtl",
        "scale": 15
    },
    {
        "id": 29,
        "name": "CouchLarge2",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchLarge2.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchLarge2.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchLarge2.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchLarge2.mtl",
        "scale": 15
    },
    {
        "id": 30,
        "name": "CouchLarge3",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchLarge3.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchLarge3.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchLarge3.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchLarge3.mtl",
        "scale": 15
    },
    {
        "id": 31,
        "name": "CouchMedium1",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchMedium1.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchMedium1.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchMedium1.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchMedium1.mtl",
        "scale": 15
    },
    {
        "id": 32,
        "name": "CouchMedium2",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchMedium2.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchMedium2.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchMedium2.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchMedium2.mtl",
        "scale": 15
    },
    {
        "id": 33,
        "name": "CouchSmall1",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchSmall1.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchSmall1.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchSmall1.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchSmall1.mtl",
        "scale": 15
    },
    {
        "id": 34,
        "name": "CouchSmall2",
        "roomType": "livingroom",
        "role": "main_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_1_CouchSmall2.png",
        "menuIconPath": "./assets/icons/LivingRoom_1_CouchSmall2.png",
        "obj": "./assets/furniture/obj/LivingRoom_1_CouchSmall2.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_1_CouchSmall2.mtl",
        "scale": 15
    },
    {
        "id": 35,
        "name": "Bookshelf",
        "roomType": "livingroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_2_Bookshelf.png",
        "menuIconPath": "./assets/icons/LivingRoom_2_Bookshelf.png",
        "obj": "./assets/furniture/obj/LivingRoom_2_Bookshelf.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_2_Bookshelf.mtl",
        "scale": 20
    },
    {
        "id": 36,
        "name": "Fireplace",
        "roomType": "livingroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_2_Fireplace.png",
        "menuIconPath": "./assets/icons/LivingRoom_2_Fireplace.png",
        "obj": "./assets/furniture/obj/LivingRoom_2_Fireplace.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_2_Fireplace.mtl",
        "scale": 20
    },
    {
        "id": 37,
        "name": "LightFloor1",
        "roomType": "livingroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_2_LightFloor1.png",
        "menuIconPath": "./assets/icons/LivingRoom_2_LightFloor1.png",
        "obj": "./assets/furniture/obj/LivingRoom_2_LightFloor1.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_2_LightFloor1.mtl",
        "scale": 20
    },
    {
        "id": 38,
        "name": "Shelf1",
        "roomType": "livingroom",
        "role": "second_wall",
        "floorplanPath": "./assets/symbols/LivingRoom_2_Shelf1.png",
        "menuIconPath": "./assets/icons/LivingRoom_2_Shelf1.png",
        "obj": "./assets/furniture/obj/LivingRoom_2_Shelf1.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_2_Shelf1.mtl",
        "scale": 20
    },
    {
        "id": 39,
        "name": "Carpet1",
        "roomType": "livingroom",
        "role": "center",
        "floorplanPath": "./assets/symbols/LivingRoom_3_Carpet1.png",
        "menuIconPath": "./assets/icons/LivingRoom_3_Carpet1.png",
        "obj": "./assets/furniture/obj/LivingRoom_3_Carpet1.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_3_Carpet1.mtl",
        "scale": 20
    },
    {
        "id": 40,
        "name": "TableRoundSmall",
        "roomType": "livingroom",
        "role": "center",
        "floorplanPath": "./assets/symbols/LivingRoom_3_TableRoundSmall.png",
        "menuIconPath": "./assets/icons/LivingRoom_3_TableRoundSmall.png",
        "obj": "./assets/furniture/obj/LivingRoom_3_TableRoundSmall.obj",
        "mtl": "./assets/furniture/mtl/LivingRoom_3_TableRoundSmall.mtl",
        "scale": 20
    },
    {
        "id": 41,
        "name": "CarpetRound",
        "roomType": "other",
        "role": "center",
        "floorplanPath": "./assets/symbols/Other_3_CarpetRound.png",
        "menuIconPath": "./assets/icons/Other_3_CarpetRound.png",
        "obj": "./assets/furniture/obj/Other_3_CarpetRound.obj",
        "mtl": "./assets/furniture/mtl/Other_3_CarpetRound.mtl",
        "scale": 20
    },
    {
        "id": 42,
        "name": "Houseplant1",
        "roomType": "other",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Other_4_Houseplant1.png",
        "menuIconPath": "./assets/icons/Other_4_Houseplant1.png",
        "obj": "./assets/furniture/obj/Other_4_Houseplant1.obj",
        "mtl": "./assets/furniture/mtl/Other_4_Houseplant1.mtl",
        "scale": 20
    },
    {
        "id": 43,
        "name": "Houseplant5",
        "roomType": "other",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Other_4_Houseplant5.png",
        "menuIconPath": "./assets/icons/Other_4_Houseplant5.png",
        "obj": "./assets/furniture/obj/Other_4_Houseplant5.obj",
        "mtl": "./assets/furniture/mtl/Other_4_Houseplant5.mtl",
        "scale": 20
    },
    {
        "id": 44,
        "name": "Houseplant6",
        "roomType": "other",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Other_4_Houseplant6.png",
        "menuIconPath": "./assets/icons/Other_4_Houseplant6.png",
        "obj": "./assets/furniture/obj/Other_4_Houseplant6.obj",
        "mtl": "./assets/furniture/mtl/Other_4_Houseplant6.mtl",
        "scale": 20
    },
    {
        "id": 45,
        "name": "Houseplant7",
        "roomType": "other",
        "role": "center_offset",
        "floorplanPath": "./assets/symbols/Other_4_Houseplant7.png",
        "menuIconPath": "./assets/icons/Other_4_Houseplant7.png",
        "obj": "./assets/furniture/obj/Other_4_Houseplant7.obj",
        "mtl": "./assets/furniture/mtl/Other_4_Houseplant7.mtl",
        "scale": 20
    }
];