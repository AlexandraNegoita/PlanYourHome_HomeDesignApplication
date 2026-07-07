import * as THREE from 'three';
export class TextureManager {
    loader = new THREE.TextureLoader();
    idWall = 0;
    materialShininess = 50;
    materialColor = new THREE.Color(0xffffff);
    materialRoughness = 0.5;
    materialMetalness = 0.0;
    floorRepeat = new THREE.Vector2(0.5, 0.5);
    readPaths = [];
    wallTexturePath = {};
    roofTexturePath = {};
    windowTexturePath = {};
    doorFrameTexturePath = {};
    doorTexturePath = {};
    groundTexturePath = {
        groundCOL: '',
        groundNRM: ''
    };
    floorTexturePath = {};
    HDRIPath;
    envMap = new THREE.Texture();
    wallTextureLoaded = {};
    roofTextureLoaded = {};
    windowTextureLoaded = {};
    doorFrameTextureLoaded = {};
    doorTextureLoaded = {};
    floorTextureLoaded = {};
    groundTextureLoaded = {
        groundCOL: new THREE.Texture(),
        groundNRM: new THREE.Texture()
    };
    wallTextureSelected = "1634";
    floorTextureSelected = "8696";
    roofTextureSelected = "4683";
    windowTextureSelected = "2734";
    doorTextureSelected = "2734";
    doorFrameTextureSelected = "2734";
    constructor(readPaths, HDRI) {
        this.readPaths = readPaths;
        this.HDRIPath = HDRI;
    }
    setEnvMap(texture) {
        this.envMap = texture;
    }
    setShininess(value) {
        this.materialShininess = value;
    }
    setColorTint(hexColor) {
        this.materialColor = new THREE.Color(hexColor);
    }
    setRoughness(value) {
        this.materialRoughness = value;
    }
    setMetalness(value) {
        this.materialMetalness = value;
    }
    addFloorTexture(id, type, path, texture) {
        if (!this.floorTexturePath[id]) {
            this.floorTexturePath[id] = { floorCOL: '', floorNRM: '', floorHGT: '' };
            this.floorTextureLoaded[id] = {
                floorCOL: new THREE.Texture(),
                floorNRM: new THREE.Texture(),
                floorHGT: new THREE.Texture()
            };
        }
        switch (type) {
            case "COL":
                this.floorTexturePath[id].floorCOL = path;
                this.floorTextureLoaded[id].floorCOL = texture;
                break;
            case "NRM":
                this.floorTexturePath[id].floorNRM = path;
                this.floorTextureLoaded[id].floorNRM = texture;
                break;
            case "HGT":
                this.floorTexturePath[id].floorHGT = path;
                this.floorTextureLoaded[id].floorHGT = texture;
                break;
        }
    }
    addWallTexture(id, type, path, texture) {
        if (!this.wallTexturePath[id]) {
            this.wallTexturePath[id] = { wallCOL: '', wallNRM: '', wallHGT: '' };
            this.wallTextureLoaded[id] = {
                wallCOL: new THREE.Texture(),
                wallNRM: new THREE.Texture(),
                wallHGT: new THREE.Texture()
            };
        }
        switch (type) {
            case "COL":
                this.wallTexturePath[id].wallCOL = path;
                this.wallTextureLoaded[id].wallCOL = texture;
                break;
            case "NRM":
                this.wallTexturePath[id].wallNRM = path;
                this.wallTextureLoaded[id].wallNRM = texture;
                break;
            case "HGT":
                this.wallTexturePath[id].wallHGT = path;
                this.wallTextureLoaded[id].wallHGT = texture;
                break;
        }
    }
    addRoofTexture(id, type, path, texture) {
        if (!this.roofTexturePath[id]) {
            this.roofTexturePath[id] = { roofCOL: '', roofNRM: '', roofHGT: '' };
            this.roofTextureLoaded[id] = {
                roofCOL: new THREE.Texture(),
                roofNRM: new THREE.Texture(),
                roofHGT: new THREE.Texture()
            };
        }
        switch (type) {
            case "COL":
                this.roofTexturePath[id].roofCOL = path;
                this.roofTextureLoaded[id].roofCOL = texture;
                break;
            case "NRM":
                this.roofTexturePath[id].roofNRM = path;
                this.roofTextureLoaded[id].roofNRM = texture;
                break;
            case "HGT":
                this.roofTexturePath[id].roofHGT = path;
                this.roofTextureLoaded[id].roofHGT = texture;
                break;
        }
    }
    addWindowTexture(id, type, path, texture) {
        if (!this.windowTexturePath[id]) {
            this.windowTexturePath[id] = { winCOL: '', winNRM: '', winHGT: '' };
            this.windowTextureLoaded[id] = {
                winCOL: new THREE.Texture(),
                winNRM: new THREE.Texture(),
                winHGT: new THREE.Texture()
            };
        }
        switch (type) {
            case "COL":
                this.windowTexturePath[id].winCOL = path;
                this.windowTextureLoaded[id].winCOL = texture;
                break;
            case "NRM":
                this.windowTexturePath[id].winNRM = path;
                this.windowTextureLoaded[id].winNRM = texture;
                break;
            case "HGT":
                this.windowTexturePath[id].winHGT = path;
                this.windowTextureLoaded[id].winHGT = texture;
                break;
        }
    }
    addDoorFrameTexture(id, type, path, texture) {
        if (!this.doorFrameTexturePath[id]) {
            this.doorFrameTexturePath[id] = { dfCOL: '', dfNRM: '', dfHGT: '' };
            this.doorFrameTextureLoaded[id] = {
                dfCOL: new THREE.Texture(),
                dfNRM: new THREE.Texture(),
                dfHGT: new THREE.Texture()
            };
        }
        switch (type) {
            case "COL":
                this.doorFrameTexturePath[id].dfCOL = path;
                this.doorFrameTextureLoaded[id].dfCOL = texture;
                break;
            case "NRM":
                this.doorFrameTexturePath[id].dfNRM = path;
                this.doorFrameTextureLoaded[id].dfNRM = texture;
                break;
            case "HGT":
                this.doorFrameTexturePath[id].dfHGT = path;
                this.doorFrameTextureLoaded[id].dfHGT = texture;
                break;
        }
    }
    addDoorTexture(id, type, path, texture) {
        if (!this.doorTexturePath[id]) {
            this.doorTexturePath[id] = { doorCOL: '', doorNRM: '', doorHGT: '' };
            this.doorTextureLoaded[id] = {
                doorCOL: new THREE.Texture(),
                doorNRM: new THREE.Texture(),
                doorHGT: new THREE.Texture()
            };
        }
        switch (type) {
            case "COL":
                this.doorTexturePath[id].doorCOL = path;
                this.doorTextureLoaded[id].doorCOL = texture;
                break;
            case "NRM":
                this.doorTexturePath[id].doorNRM = path;
                this.doorTextureLoaded[id].doorNRM = texture;
                break;
            case "HGT":
                this.doorTexturePath[id].doorHGT = path;
                this.doorTextureLoaded[id].doorHGT = texture;
                break;
        }
    }
    addGroundTexture(type, path, texture) {
        switch (type) {
            case "COL": {
                this.groundTexturePath = {
                    groundCOL: path,
                    groundNRM: this.groundTexturePath.groundNRM
                };
                this.groundTextureLoaded = {
                    groundCOL: texture,
                    groundNRM: this.groundTextureLoaded.groundNRM,
                };
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
                };
                break;
            }
        }
    }
    selectWallTexture(id) { this.wallTextureSelected = id; }
    selectRoofTexture(id) { this.roofTextureSelected = id; }
    selectWindowTexture(id) { this.windowTextureSelected = id; }
    selectDoorFrameTexture(id) { this.doorFrameTextureSelected = id; }
    selectDoorTexture(id) { this.doorTextureSelected = id; }
    getGroundTexture() {
        return this.groundTextureLoaded;
    }
}
