import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Model } from '../model/Model';
import { Renderer } from './Renderer';
import { Board } from "../viewer2d/Board";
import { Ground } from "./objects/Ground";
import { TextureManager } from "./TextureManager";
import { SceneManager } from "./SceneManager";
import { Material } from "./Material";


export class Viewer3D {
    showRoof: boolean = false;
    model: Model;
    renderer: Renderer;
    walls: any;
    controls: OrbitControls | undefined;
    houseCenter: THREE.Vector3 | undefined;
    ground: Ground = new Ground();
    board: Board;
    textures: TextureManager;
    pmremGenerator: THREE.PMREMGenerator;
    loadingManager: THREE.LoadingManager = new THREE.LoadingManager();
    light: THREE.AmbientLight = new THREE.AmbientLight;
    sceneManager: SceneManager;
    isCameraSet: boolean = false;
    isGroundAdded: boolean = false;
    isAnimationStarted: boolean = false;
    isInitialized: boolean = false;
    isUIInitialized: boolean = false;
    materials: Material;
    currentMaterialCategory: string = "WALL";
   
    
    constructor(model: Model, board: Board, textures: TextureManager) {
        this.animate = this.animate.bind(this);
        this.model = model;
        this.textures = textures;
        this.renderer = new Renderer();
        this.materials = new Material(this.textures);
        this.sceneManager = new SceneManager(this.model, this.materials, this.renderer);
        
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer.getRenderer());
        this.board = board;
    }

    getTextures(textureArray: {id: string, for: string, path : string, type: string}[]) {
        const allPromises: Promise<{id: string, for: string, path : string, type: string, texture: THREE.Texture}>[] = [];
        textureArray.forEach( ( jsonMat ) => {

            allPromises.push( new Promise( ( resolve, reject ) => {
        
                new THREE.TextureLoader(this.loadingManager).load(
                   jsonMat.path, 
        
                   function( texture ) {
                    const loadedTexture = {
                        id: jsonMat.id,
                        for: jsonMat.for,
                        path: jsonMat.path,
                        type: jsonMat.type,
                        texture: texture
                    };
                    resolve(loadedTexture);

                   },
        
                   function( xhr ) {
                       // Progress callback of TextureLoader
                       // ...
                   },
        
                   function( xhr ) {
                       // Failure callback of TextureLoader
                       // Reject the promise with the failure
                       reject( new Error( 'Could not load ' + jsonMat.path) );
                   }
                );
        
            }));
        
        });
        return allPromises;
    }

    setupLoading(htmlElement: HTMLElement) {
        this.loadingManager = new THREE.LoadingManager( () => {
	
            let loadingScreen = htmlElement;
            loadingScreen.classList.add( 'fade-out' );
            
            // // optional: remove loader from DOM via event listener
            // loadingScreen?.addEventListener( 'transitionend', onTransitionEnd );
            
        } );
    }

    setup(fov: number, width: number, height: number, near: number, far: number, htmlElement: HTMLElement) {
        this.setupLoading(htmlElement);
        const hdriLoader = new RGBELoader(this.loadingManager);
        hdriLoader.load( this.textures.HDRIPath,  ( hdrMap ) => {
            hdrMap.mapping = THREE.EquirectangularReflectionMapping;

            this.renderer.scene.environment = hdrMap;
            this.renderer.scene.background = hdrMap;
            this.textures.setEnvMap(hdrMap);
        

            Promise.all(this.getTextures(this.textures.readPaths))
                .then(allTextures => {
                    allTextures.forEach( ( texture ) => {
                        if(texture.for == "GROUND") {
                            this.textures.addGroundTexture(texture.type, texture.path, texture.texture);
                        } else if(texture.for == "WALL") {
                            //console.log(texture.id, texture.type, texture.path, texture.texture);
                            this.textures.addWallTexture(texture.id, texture.type, texture.path, texture.texture);
                        } else if(texture.for == "ROOF") {
                            //console.log(texture.id, texture.type, texture.path, texture.texture);
                            this.textures.addRoofTexture(texture.id, texture.type, texture.path, texture.texture);
                        } else if(texture.for == "WINDOW_FRAME") {
                            //console.log(texture.id, texture.type, texture.path, texture.texture);
                            this.textures.addWindowTexture(texture.id, texture.type, texture.path, texture.texture);
                        }else if(texture.for == "FLOOR") {
                            //console.log(texture.id, texture.type, texture.path, texture.texture);
                            this.textures.addFloorTexture(texture.id, texture.type, texture.path, texture.texture);
                        }
                    });

                    Object.keys(this.textures.wallTextureLoaded).forEach(id => {
                        this.materials.registerWallMaterial(id); // width ratio
                    });
                    Object.keys(this.textures.floorTextureLoaded).forEach(id => {
                        this.materials.registerFloorMaterial(id); // width ratio
                    });
                    Object.keys(this.textures.roofTextureLoaded).forEach(id => {
                        this.materials.registerRoofMaterial(id);
                    });

                    this.renderer.setup(fov, width, height, near, far);
                    this.controls = new OrbitControls(this.renderer.getCamera(), this.renderer.getRenderer().domElement);
                    this.controls.update();
                })
            .catch(err => console.error(err))
        } );
        


        this.setupConfigsUI();
    }

    

    setupCamera() {
        if(this.isCameraSet) return;
        const box = new THREE.Box3().setFromObject( this.renderer.house );
        this.houseCenter = box.getCenter( new THREE.Vector3() );
        if(this.houseCenter) {
            this.renderer.camera.position.copy(new THREE.Vector3(this.houseCenter.x, this.houseCenter.y + 5, this.houseCenter.z));
            this.controls?.target.copy(this.houseCenter);
        }
        this.isCameraSet = true;
    }

    setupLighting() {
        if(!this.renderer.scene.children.includes(this.light)) {
            this.light = new THREE.AmbientLight(0xFFFFFF, 1);
            if(this.houseCenter) {
                this.light.position.set(this.houseCenter.x, this.houseCenter.y + 5, this.houseCenter.z);
            }
            this.renderer.scene.add(this.light);
        }
       
    }

    setupConfigsUI() {
        if (this.isUIInitialized) return;
        this.isUIInitialized = true;
        document.getElementById("buttonMatWalls")?.addEventListener("click", () => {
            this.currentMaterialCategory = "WALL";
            this.resetColorPicker();
        });

        document.getElementById("buttonMatFloor")?.addEventListener("click", () => {
            this.currentMaterialCategory = "FLOOR";
            this.resetColorPicker();
        });

        document.getElementById("buttonMatRoof")?.addEventListener("click", () => {
            this.currentMaterialCategory = "ROOF";
            this.resetColorPicker();
        });

        document.getElementById("buttonMatWindowFrames")?.addEventListener("click", () => {
            this.currentMaterialCategory = "WINDOW_FRAME";
            this.resetColorPicker();
        });

        document.getElementById("buttonMatDoorFrames")?.addEventListener("click", () => {
            this.currentMaterialCategory = "DOOR_FRAME";
            this.resetColorPicker();
        });

        document.getElementById("buttonMatDoors")?.addEventListener("click", () => {
            this.currentMaterialCategory = "DOOR";
            this.resetColorPicker();
        });

        const shininess = document.getElementById("shininessSlider");
        const roughness = document.getElementById("roughnessSlider");
        const metalness = document.getElementById("metalnessSlider");
        const colorPicker = document.getElementById("colorPicker");

        if (shininess) {
            shininess.addEventListener("input", (e: any) => {
                this.textures.setShininess(parseInt(e.target.value));

                this.updateCurrentMaterial(this.currentMaterialCategory);
            });
        }

        if (roughness) {
            roughness.addEventListener("input", (e: any) => {
                this.textures.setRoughness(e.target.value / 100);
                this.updateCurrentMaterial(this.currentMaterialCategory);

            });
        }

        if (metalness) {
            metalness.addEventListener("input", (e: any) => {
                this.textures.setMetalness(e.target.value / 100);
                this.updateCurrentMaterial(this.currentMaterialCategory);

            });
        }

        if (colorPicker) {
            colorPicker.addEventListener("input", (e: any) => {
                this.textures.setColorTint(e.target.value);
                this.updateCurrentMaterial(this.currentMaterialCategory);

            });
        }

        //
        // CATEGORY‑SPECIFIC TEXTURE CHANGE EVENTS
        //
        document.addEventListener("wallTextureChanged", () => {
            this.materials.updateWallMaterial();
        });

        document.addEventListener("floorTextureChanged", () => {
            this.materials.updateFloorMaterial();
        });

        document.addEventListener("roofTextureChanged", () => {
            this.materials.updateRoofMaterial();
        });

        document.addEventListener("windowFrameTextureChanged", () => {
            this.materials.updateWindowFrameMaterial();
        });

        document.addEventListener("doorFrameTextureChanged", () => {
            this.materials.updateDoorFrameMaterial();
        });

        document.addEventListener("doorTextureChanged", () => {
            this.materials.updateDoorMaterial();
        });
    }

    updateCurrentMaterial(materialCategory: string) {
        switch (materialCategory) {
            case "WALL":
                this.materials.updateWallMaterial();
                break;
            case "FLOOR":
                this.materials.updateFloorMaterial();
                break;
            case "ROOF":
                this.materials.updateRoofMaterial();
                break;
            case "WINDOW_FRAME":
                this.materials.updateWindowFrameMaterial();
                break;
            case "DOOR_FRAME":
                this.materials.updateDoorFrameMaterial();
                break;
            case "DOOR":
                this.materials.updateDoorMaterial();
                break;
        }
    }




    run() {

        // Ground
        const groundMesh = this.ground.buildGround(this.board, this.textures);
        this.renderer.scene.add(groundMesh);
        this.isGroundAdded = true;

        this.sceneManager.loadWalls();
        this.sceneManager.loadFloors();
        if (this.showRoof) this.sceneManager.loadRoof();

        this.materials.updateWallMaterial();
        this.materials.updateFloorMaterial();
        this.materials.updateRoofMaterial();
        this.materials.updateWindowFrameMaterial();
        this.materials.updateDoorFrameMaterial();
        this.materials.updateDoorMaterial();

        this.setupCamera();
        this.setupLighting();
        this.renderer.getRenderer().setAnimationLoop(this.animate);
    }

    resetColorPicker() {
        const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
        if (colorPicker) {
            colorPicker.value = "#ffffff"; // default tint
        }
    }


    stop() {
        this.sceneManager.reset();
        this.renderer.clear();
       // this.renderer.refresh();
       // this.renderer.scene.remove(this.walls);
        this.renderer.getRenderer().setAnimationLoop(null);
    }

    getRendererCanvas() : HTMLCanvasElement {
        return this.renderer.getRenderer().domElement;
    }

    setShowRoof(showRoof: boolean) {
        this.showRoof = showRoof;
        console.log("3d" + showRoof);
        this.sceneManager.toggleShowRoof(showRoof);
    }

    animate() {
        // this.renderer.mesh.rotation.x += 0.01;
        // this.renderer.mesh.rotation.y += 0.01;
        this.renderer.getRenderer().render( 
            this.renderer.scene, 
            this.renderer.camera 
        );
        if(this.controls) {
            //this.controls.target.copy(this.renderer.houseGroup.position);
            
            this.controls.update();   

            // this.controls.update();
        }
    }
    
}
