import * as THREE from 'three';

export class TextureManager {
    loader: THREE.TextureLoader = new THREE.TextureLoader();
    idWall: number = 0;
    materialShininess: number = 50;
    materialColor: THREE.Color = new THREE.Color(0xffffff);
    materialRoughness: number = 0.5;
    materialMetalness: number = 0.0;
    floorRepeat: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);


    public readPaths: {
        id: string,
        for: string,
        path: string,
        type: string,
    }[] = [];

    wallTexturePath: { [id: string]: {
        wallCOL: string,
        wallNRM: string,
        wallHGT: string
    }} = {};

    roofTexturePath: { [id: string]: {
        roofCOL: string,
        roofNRM: string,
        roofHGT: string
    }} = {};

    // ⭐ FIX: window textures per ID
    windowTexturePath: { [id: string]: {
        winCOL: string,
        winNRM: string,
        winHGT: string
    }} = {};

    // ⭐ FIX: door frame textures per ID
    doorFrameTexturePath: { [id: string]: {
        dfCOL: string,
        dfNRM: string,
        dfHGT: string
    }} = {};

    // ⭐ FIX: door textures per ID
    doorTexturePath: { [id: string]: {
        doorCOL: string,
        doorNRM: string,
        doorHGT: string
    }} = {};

    groundTexturePath = {
        groundCOL: '',
        groundNRM: ''
    };

    floorTexturePath: { [id: string]: {
        floorCOL: string,
        floorNRM: string,
        floorHGT: string
    }} = {};

    HDRIPath: string;
    envMap: THREE.Texture = new THREE.Texture();

    wallTextureLoaded: { [id: string]: {
        wallCOL: THREE.Texture,
        wallNRM: THREE.Texture,
        wallHGT: THREE.Texture
    }} = {};

    roofTextureLoaded: { [id: string]: {
        roofCOL: THREE.Texture,
        roofNRM: THREE.Texture,
        roofHGT: THREE.Texture
    }} = {};

    // ⭐ FIX: window textures per ID
    windowTextureLoaded: { [id: string]: {
        winCOL: THREE.Texture,
        winNRM: THREE.Texture,
        winHGT: THREE.Texture
    }} = {};

    // ⭐ FIX: door frame textures per ID
    doorFrameTextureLoaded: { [id: string]: {
        dfCOL: THREE.Texture,
        dfNRM: THREE.Texture,
        dfHGT: THREE.Texture
    }} = {};

    // ⭐ FIX: door textures per ID
    doorTextureLoaded: { [id: string]: {
        doorCOL: THREE.Texture,
        doorNRM: THREE.Texture,
        doorHGT: THREE.Texture
    }} = {};

    floorTextureLoaded: { [id: string]: {
        floorCOL: THREE.Texture,
        floorNRM: THREE.Texture,
        floorHGT: THREE.Texture
    }} = {};

    groundTextureLoaded = {
        groundCOL: new THREE.Texture(),
        groundNRM: new THREE.Texture()
    };

    wallTextureSelected: string = "1634";
    floorTextureSelected: string = "8696";
    roofTextureSelected: string = "4683";
    windowTextureSelected: string = "2734";
    doorTextureSelected: string = "2734";
    doorFrameTextureSelected: string = "2734";

    constructor(readPaths: any[], HDRI: string) {
        this.readPaths = readPaths;
        this.HDRIPath = HDRI;
    }

    setEnvMap(texture: THREE.Texture) {
        this.envMap = texture;
    }

    setShininess(value: number) {
        this.materialShininess = value;
    }

    setColorTint(hexColor: string) {
        this.materialColor = new THREE.Color(hexColor);
    }

    setRoughness(value: number) {
        this.materialRoughness = value;
    }

    setMetalness(value: number) {
        this.materialMetalness = value;
    }

    // ---------------------------------------------------------
    // FLOOR / WALL / ROOF (unchanged)
    // ---------------------------------------------------------

    addFloorTexture(id: string, type: string, path: string, texture: THREE.Texture) {
        if (!this.floorTexturePath[id]) {
            this.floorTexturePath[id] = { floorCOL: '', floorNRM: '', floorHGT: '' };
            this.floorTextureLoaded[id] = {
                floorCOL: new THREE.Texture(),
                floorNRM: new THREE.Texture(),
                floorHGT: new THREE.Texture()
            };
        }

        switch (type) {
            case "COL": this.floorTexturePath[id].floorCOL = path; this.floorTextureLoaded[id].floorCOL = texture; break;
            case "NRM": this.floorTexturePath[id].floorNRM = path; this.floorTextureLoaded[id].floorNRM = texture; break;
            case "HGT": this.floorTexturePath[id].floorHGT = path; this.floorTextureLoaded[id].floorHGT = texture; break;
        }
    }

    addWallTexture(id: string, type: string, path: string, texture: THREE.Texture) {
        if (!this.wallTexturePath[id]) {
            this.wallTexturePath[id] = { wallCOL: '', wallNRM: '', wallHGT: '' };
            this.wallTextureLoaded[id] = {
                wallCOL: new THREE.Texture(),
                wallNRM: new THREE.Texture(),
                wallHGT: new THREE.Texture()
            };
        }

        switch (type) {
            case "COL": this.wallTexturePath[id].wallCOL = path; this.wallTextureLoaded[id].wallCOL = texture; break;
            case "NRM": this.wallTexturePath[id].wallNRM = path; this.wallTextureLoaded[id].wallNRM = texture; break;
            case "HGT": this.wallTexturePath[id].wallHGT = path; this.wallTextureLoaded[id].wallHGT = texture; break;
        }
    }

    addRoofTexture(id: string, type: string, path: string, texture: THREE.Texture) {
        if (!this.roofTexturePath[id]) {
            this.roofTexturePath[id] = { roofCOL: '', roofNRM: '', roofHGT: '' };
            this.roofTextureLoaded[id] = {
                roofCOL: new THREE.Texture(),
                roofNRM: new THREE.Texture(),
                roofHGT: new THREE.Texture()
            };
        }

        switch (type) {
            case "COL": this.roofTexturePath[id].roofCOL = path; this.roofTextureLoaded[id].roofCOL = texture; break;
            case "NRM": this.roofTexturePath[id].roofNRM = path; this.roofTextureLoaded[id].roofNRM = texture; break;
            case "HGT": this.roofTexturePath[id].roofHGT = path; this.roofTextureLoaded[id].roofHGT = texture; break;
        }
    }

    // ---------------------------------------------------------
    // ⭐ FIXED WINDOW TEXTURES (per ID)
    // ---------------------------------------------------------

    addWindowTexture(id: string, type: string, path: string, texture: THREE.Texture) {
        if (!this.windowTexturePath[id]) {
            this.windowTexturePath[id] = { winCOL: '', winNRM: '', winHGT: '' };
            this.windowTextureLoaded[id] = {
                winCOL: new THREE.Texture(),
                winNRM: new THREE.Texture(),
                winHGT: new THREE.Texture()
            };
        }

        switch (type) {
            case "COL": this.windowTexturePath[id].winCOL = path; this.windowTextureLoaded[id].winCOL = texture; break;
            case "NRM": this.windowTexturePath[id].winNRM = path; this.windowTextureLoaded[id].winNRM = texture; break;
            case "HGT": this.windowTexturePath[id].winHGT = path; this.windowTextureLoaded[id].winHGT = texture; break;
        }
    }

    // ---------------------------------------------------------
    // ⭐ FIXED DOOR FRAME TEXTURES (per ID)
    // ---------------------------------------------------------

    addDoorFrameTexture(id: string, type: string, path: string, texture: THREE.Texture) {
        if (!this.doorFrameTexturePath[id]) {
            this.doorFrameTexturePath[id] = { dfCOL: '', dfNRM: '', dfHGT: '' };
            this.doorFrameTextureLoaded[id] = {
                dfCOL: new THREE.Texture(),
                dfNRM: new THREE.Texture(),
                dfHGT: new THREE.Texture()
            };
        }

        switch (type) {
            case "COL": this.doorFrameTexturePath[id].dfCOL = path; this.doorFrameTextureLoaded[id].dfCOL = texture; break;
            case "NRM": this.doorFrameTexturePath[id].dfNRM = path; this.doorFrameTextureLoaded[id].dfNRM = texture; break;
            case "HGT": this.doorFrameTexturePath[id].dfHGT = path; this.doorFrameTextureLoaded[id].dfHGT = texture; break;
        }
    }

    // ---------------------------------------------------------
    // ⭐ FIXED DOOR TEXTURES (per ID)
    // ---------------------------------------------------------

    addDoorTexture(id: string, type: string, path: string, texture: THREE.Texture) {
        if (!this.doorTexturePath[id]) {
            this.doorTexturePath[id] = { doorCOL: '', doorNRM: '', doorHGT: '' };
            this.doorTextureLoaded[id] = {
                doorCOL: new THREE.Texture(),
                doorNRM: new THREE.Texture(),
                doorHGT: new THREE.Texture()
            };
        }

        switch (type) {
            case "COL": this.doorTexturePath[id].doorCOL = path; this.doorTextureLoaded[id].doorCOL = texture; break;
            case "NRM": this.doorTexturePath[id].doorNRM = path; this.doorTextureLoaded[id].doorNRM = texture; break;
            case "HGT": this.doorTexturePath[id].doorHGT = path; this.doorTextureLoaded[id].doorHGT = texture; break;
        }
    }

    addGroundTexture(type: string, path: string, texture: THREE.Texture) {
        switch(type) {
            case "COL": {
                this.groundTexturePath = {
                    groundCOL: path,
                    groundNRM: this.groundTexturePath.groundNRM
                };
        
                this.groundTextureLoaded = {
                    groundCOL: texture,
                    groundNRM: this.groundTextureLoaded.groundNRM,
                }
                break;
            }
            case "NRM": {
                this.groundTexturePath = {
                    groundCOL: this.groundTexturePath.groundCOL,
                    groundNRM: path
                };
        
                this.groundTextureLoaded = {
                    groundCOL: this.groundTextureLoaded.groundCOL,
                    groundNRM: texture,
                }
                break;
            }
        }
        
    }

    // ---------------------------------------------------------
    // SELECTORS
    // ---------------------------------------------------------

    selectWallTexture(id: string) { this.wallTextureSelected = id; }
    selectRoofTexture(id: string) { this.roofTextureSelected = id; }
    selectWindowTexture(id: string) { this.windowTextureSelected = id; }
    selectDoorFrameTexture(id: string) { this.doorFrameTextureSelected = id; }
    selectDoorTexture(id: string) { this.doorTextureSelected = id; }

    getGroundTexture() {
        return this.groundTextureLoaded;
    }
}
