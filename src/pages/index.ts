import '/css/styles.css';
import * as bootstrap from 'bootstrap'; 

import * as Viewer2D from '../planner/viewer2d/Viewer2D';
import * as Viewer3D from '../planner/viewer3d/Viewer3D';
import { TextureManager } from '../planner/viewer3d/TextureManager';
import { SpriteManager } from '../planner/viewer2d/SpriteManager';
import { Parser } from '../planner/model/Parser';
import { Designer } from '../planner/model/Designer';
import './menu';
import './loader';
import './designer';
import { Generator } from '../planner/model/generator/Generator';
import { GeneratorConfig } from '../planner/model/generator/GeneratorConfig';
import { furnitureAssets} from './generated-assets';
import { FurnitureGenerator } from '../planner/model/generator/FurnitureGenerator';
import { textureAssets } from './generated-textures';
import { SnapMode } from '../planner/viewer2d/Coordinates';



// 1. Setup Texture Manager
// const textureManager = new TextureManager(
//     [
//         { id: "0", for: "GROUND", path: "./assets/textures/ground/GroundGrassGreen002_COL_2K.jpg", type: "COL" },
//         { id: "0", for: "GROUND", path: "./assets/textures/ground/GroundGrassGreen002_NRM_2K.jpg", type: "NRM" },

//         { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_THUMB.png", type: "THUMB" },
//         { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_Base_Color.jpg", type: "COL" },
//         { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_Normal.jpg", type: "NRM" },
//         { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_Height.png", type: "HGT" },

//         { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_THUMB.jpg", type: "THUMB" },
//         { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_COLOR.jpg", type: "COL" },
//         { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_NORM.jpg", type: "NRM" },
//         { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_DISP.png", type: "HGT" },

//         { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Material_2050.jpg", type: "THUMB" },
//         { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Concrete_019_BaseColor.jpg", type: "COL" },
//         { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Concrete_019_Normal.jpg", type: "NRM" },
//         { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Concrete_019_Height.png", type: "HGT" },

//         { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Material_2051.jpg", type: "THUMB" },
//         { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Wall_Plaster_002_BaseColor.jpg", type: "COL" },
//         { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Wall_Plaster_002_Normal.jpg", type: "NRM" },
//         { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Wall_Plaster_002_Height.png", type: "HGT" },

//         { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Material_1952.jpg", type: "THUMB" },
//         { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Wall_Plaster_001_basecolor.jpg", type: "COL" },
//         { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Wall_Plaster_001_normal.jpg", type: "NRM" },
//         { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Wall_Plaster_001_height.png", type: "HGT" },

//         { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Material_606.png", type: "THUMB" },
//         { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Concrete_014_4K_COLOR.jpg", type: "COL" },
//         { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Concrete_014_4K_NORM.jpg", type: "NRM" },
//         { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Concrete_014_4K_DISP.png", type: "HGT" },

//         { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Material_1903.jpg", type: "THUMB" },
//         { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Tiles_Stone_001_basecolor.jpg", type: "COL" },
//         { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Tiles_Stone_001_normal.jpg", type: "NRM" },
//         { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Tiles_Stone_001_height.png", type: "HGT" },

//         { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Material_1846.jpg", type: "THUMB" },
//         { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Roof_Tiles_Terracotta_008_basecolor.jpg", type: "COL" },
//         { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Roof_Tiles_Terracotta_008_normal.jpg", type: "NRM" },
//         { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Roof_Tiles_Terracotta_008_height.png", type: "HGT" },

//         { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Material_2025.jpg", type: "THUMB" },
//         { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Plastic_003_basecolor.jpg", type: "COL" },
//         { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Plastic_003_normal.jpg", type: "NRM" },
//         { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Plastic_003_height.jpg", type: "HGT" },

//         { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Material_1504.jpg", type: "THUMB" },
//         { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Granite_Red_001_Base Color.jpg", type: "COL" },
//         { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Granite_Red_001_Height.png", type: "HGT" },
//         { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Granite_Red_001_Normal.jpg", type: "NRM" },

//         { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Material_2003.png", type: "THUMB" },
//         { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Wood_Particle_Board_005_basecolor.png", type: "COL" },
//         { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Wood_Particle_Board_005_normal.png", type: "NRM" },
//         { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Wood_Particle_Board_005_height.png", type: "HGT" },

//         { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Material_553.png", type: "THUMB" },
//         { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Wood_007_COLOR.jpg", type: "COL" },
//         { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Wood_007_DISP.png", type: "HGT" },
//         { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Wood_007_NORM.jpg", type: "NRM" },
//     ],
//     './assets/textures/HDRI/lonely_road_afternoon_puresky_4k.hdr'
// );


const textureManager = new TextureManager(
    textureAssets, 
    './assets/textures/HDRI/lonely_road_afternoon_puresky_4k.hdr'
);

document.addEventListener('contextmenu', event => event.preventDefault());

const planner2D = new Viewer2D.Viewer2D();
const planner3D = new Viewer3D.Viewer3D(planner2D.getModel(), planner2D.getBoard(), textureManager);
const designer = new Designer();
let parser = new Parser();

(async () => {
    // Init 2D
    await planner2D.init({
        resizeTo: window,
        backgroundColor: 0xFAEBD7
    });

    let spriteManager = new SpriteManager();
    await spriteManager.setWindowPath('./assets/symbols/window.jpg');
    await spriteManager.setDoorPath('./assets/symbols/door.svg');
    
    await spriteManager.setFurniturePaths(furnitureAssets);

    planner2D.setup(spriteManager);

    const contentDiv = document.getElementById('content');
    const canvas2D = planner2D.canvas;
    canvas2D.setAttribute('id', 'canvas2D');
    
    if (contentDiv) {
        contentDiv.appendChild(canvas2D);
        planner3D.setup(75, window.innerWidth, window.innerHeight, 0.1, 1000, contentDiv);
    }
    
    const canvas3D = planner3D.getRendererCanvas();
    canvas3D.setAttribute('id', 'canvas3D');
    canvas3D.style.display = 'none'; 
    if (contentDiv) contentDiv.appendChild(canvas3D);

})();


// --- UI LOGIC ---

const uiState = {
    drawMode: 'wall', // 'wall' | 'room'
    is3D: false,
    editMode: false,
    materialsOpen: false
};

const configMenu = document.getElementById('configurationMenu');
const optionsMenu = document.getElementById('optionsMenu');
const openMenuBtn = document.getElementById('openMenu');
const closeOptionsBtn = document.getElementById('closeOptionsMenu');

if (openMenuBtn && configMenu) {
    openMenuBtn.addEventListener('click', () => {
        configMenu.classList.toggle('is-active');
        const icon = openMenuBtn.querySelector('i');

        if (configMenu.classList.contains('is-active')) {
            icon?.classList.remove('fa-bars');
            icon?.classList.add('fa-arrow-left');
        } else {
            icon?.classList.remove('fa-arrow-left');
            icon?.classList.add('fa-bars');
            optionsMenu?.classList.remove('is-active');
        }
    });
}

if (closeOptionsBtn && optionsMenu) {
    closeOptionsBtn.addEventListener('click', () => {
        optionsMenu.classList.remove('is-active');
    });
}

const buttonSwitchView = document.getElementById('buttonSwitchView');
if (buttonSwitchView) {
    buttonSwitchView.innerHTML = `Switch 3D View <i class="fa-solid fa-cube fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    
    buttonSwitchView.addEventListener('click', () => {
        uiState.is3D = !uiState.is3D;
        const c2d = document.getElementById('canvas2D');
        const c3d = document.getElementById('canvas3D');

        if (uiState.is3D) {
            buttonSwitchView.innerHTML = `Switch 2D View <i class="fa-solid fa-vector-square fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
            if(c2d) c2d.style.display = 'none';
            if(c3d) c3d.style.display = 'block';
            planner3D.run();
            //planner3D.materials.updateAllMaterials();
        } else {
            buttonSwitchView.innerHTML = `Switch 3D View <i class="fa-solid fa-cube fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
            if(c2d) c2d.style.display = 'block';
            if(c3d) c3d.style.display = 'none';
            planner3D.stop();
        }
    });
}

// 3. Export JSON
const exportJsonBtn = document.getElementById('exportJsonBtn');
if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(planner2D.toJSON());
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            
            const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
            downloadAnchor.setAttribute("download", `floorplan-${timestamp}.json`);
            
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        } catch (error) {
            console.error("Failed to export JSON:", error);
            alert("Could not export JSON.");
        }
    });
}


//snap mode
const snapModeBtn = document.getElementById("snapModeBtn");
if(snapModeBtn) {
    snapModeBtn.innerHTML = `<i class="fa-solid fa-table-cells"></i>`;

    snapModeBtn.addEventListener('click', () => {
        if(planner2D.coords.mode == SnapMode.GRID) {
            planner2D.coords.changeSnapMode(SnapMode.FREESTYLE);
            planner2D.setSnapMode(SnapMode.FREESTYLE);
            snapModeBtn.innerHTML = `<i class="fa-solid fa-bacon"></i>`;
        } else if(planner2D.coords.mode == SnapMode.FREESTYLE) {
            planner2D.coords.changeSnapMode(SnapMode.GRID);
            planner2D.setSnapMode(SnapMode.GRID);
            snapModeBtn.innerHTML = `<i class="fa-solid fa-table-cells"></i>`;
        }
    })
}

// SCREENSHOT LOGIC 
const screenshotBtn = document.getElementById('screenshotBtn');
if (screenshotBtn) {
    screenshotBtn.addEventListener('click', async () => {
        try {
            const renderer = planner2D.renderer as any;
            
            const stageToCapture = planner2D.world;

            if (!renderer || !stageToCapture) {
                console.error("Could not find PixiJS renderer or board to extract.");
                alert("Screenshot tool is not available.");
                return;
            }

            let base64Image: string;

            if (renderer.extract) {
                base64Image = await renderer.extract.base64(stageToCapture);
            } else if (renderer.plugins && renderer.plugins.extract) {
                base64Image = renderer.plugins.extract.base64(stageToCapture);
            } else {
                console.error("Extract plugin not found.");
                return;
            }

            const link = document.createElement('a');
            link.href = base64Image;
            
            const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
            link.download = `floorplan-${timestamp}.png`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Failed to take screenshot:", error);
            alert("Could not take screenshot. Check console for details.");
        }
    });
}

// 4. Import JSON
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const buttonImportFile = document.getElementById('buttonImportFile');
if (buttonImportFile && fileInput) {
    buttonImportFile.innerHTML = `Import File <i class="fa-solid fa-file-import fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    buttonImportFile.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonString = e.target?.result as string;
                parser.readJSON(jsonString);
                parser.buildModel(planner2D);
            } catch (err) {
                console.error("Error parsing JSON", err);
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    });
}

// 5. Edit Modes & Accordions
const setupAccordion = (btnId: string, menuId: string, label: string, iconClass: string) => {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    btn.innerHTML = `${label} <i class="${iconClass} fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    
    btn.addEventListener('click', () => {
        const isHidden = getComputedStyle(menu).display === 'none';
        menu.style.display = isHidden ? 'block' : 'none';
        btn.parentElement?.style.setProperty('background', isHidden ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)');
        
        if (btnId === 'buttonEditMode') {
            uiState.editMode = isHidden; 
            planner2D.setEditMode(isHidden ? Viewer2D.editMode.EDIT : Viewer2D.editMode.NONE);
        }
    });
};

setupAccordion('buttonEditMode', 'editMenu', 'Edit Mode', 'fa-solid fa-draw-polygon');
setupAccordion('buttonMaterials', 'materialMenu', 'Materials', 'fa-solid fa-palette');

const setupToolBtn = (id: string, label: string, icon: string, mode: Viewer2D.editMode) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.innerHTML = `${label} <i class="${icon} fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    
    btn.addEventListener('click', () => {
        document.querySelectorAll('#editMenu .confButton a').forEach(el => {
            (el as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
        });
        btn.style.background = 'rgba(255, 255, 255, 0.25)';
        planner2D.setEditMode(mode);
    });
};

setupToolBtn('buttonEditGripPoint', 'Grip Point', 'fa-solid fa-circle-dot', Viewer2D.editMode.GRIPPOINT);
setupToolBtn('buttonEditRoof', 'Roof', 'fa-solid fa-people-roof', Viewer2D.editMode.ROOF);
setupToolBtn('buttonEditWindow', 'Window', 'fa-solid fa-border-all', Viewer2D.editMode.WINDOW);
setupToolBtn('buttonEditFurniture', 'Furniture', 'fa-solid fa-bed', Viewer2D.editMode.FURNITURE);
setupToolBtn('buttonEditDoor', 'Door', 'fa-solid fa-door-open', Viewer2D.editMode.DOOR);

function populateFurnitureMenu() {
    const panel = document.getElementById("furnitureMenuPanel");
    const container = document.getElementById("furnitureContainer");
    if (!panel || !container) return;

    panel.classList.add("is-active");
    container.innerHTML = "";

    furnitureAssets.forEach(item => {
        const div = document.createElement("div");
        div.className = "furniture-item";

        div.innerHTML = `<img src="${item.menuIconPath}">`;

        div.addEventListener("click", () => {
            planner2D.setEditMode(Viewer2D.editMode.FURNITURE);

            planner2D.rooms.forEach(room => {
                room.currentFurnitureType = item.id;
            });

            document.querySelectorAll(".furniture-item")
                .forEach(el => el.classList.remove("active"));

            div.classList.add("active");
        });

        container.appendChild(div);
    });
}


const btnEditFurniture = document.getElementById("buttonEditFurniture");
if (btnEditFurniture) {
    btnEditFurniture.addEventListener("click", () => {
        populateFurnitureMenu();
    });
}

const closeFurnitureBtn = document.getElementById("closeFurnitureMenu");
if (closeFurnitureBtn) {
    closeFurnitureBtn.addEventListener("click", () => {
        document.getElementById("furnitureMenuPanel")?.classList.remove("is-active");
    });
}


// 7. Materials System (Secondary Sidebar)
const populateOptionsMenu = (type: string) => {
    if (!optionsMenu) return;
    optionsMenu.classList.add('is-active');

    let container = document.getElementById('textureContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'textureContainer';
        optionsMenu.appendChild(container);
    }
    container.innerHTML = '';

    // --- TITLE ---
    const title = document.createElement('h4');
    title.textContent = `${type} Materials`;
    title.className = 'mb-3';
    container.appendChild(title);

    // --- SLIDERS ---
    const sliderBlock = document.createElement('div');
    sliderBlock.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Roughness</label>
            <input type="range" class="form-range" id="roughnessSliderLocal" min="0" max="100" value="${textureManager.materialRoughness * 100}">
        </div>

        <div class="mb-3">
            <label class="form-label">Metalness</label>
            <input type="range" class="form-range" id="metalnessSliderLocal" min="0" max="100" value="${textureManager.materialMetalness * 100}">
        </div>

        <div class="mb-4">
            <label class="form-label">Color Tint</label>
            <input type="color" class="form-control form-control-color w-100" id="colorPickerLocal" value="#ffffff">
        </div>
    `;
    container.appendChild(sliderBlock);

    // --- TEXTURE GRID ---
    let row: HTMLDivElement | null = null;
    let index = 0;

    const eventMap: { [key: string]: string } = {
        "WALL": "wallTextureChanged",
        "FLOOR": "floorTextureChanged",
        "ROOF": "roofTextureChanged",
        "WINDOW_FRAME": "windowFrameTextureChanged",
        "DOOR_FRAME": "doorFrameTextureChanged",
        "DOOR": "doorTextureChanged"
    };

    textureManager.readPaths.forEach((photo) => {
        if (photo.for === type && photo.type === "THUMB") {
            if (index % 2 === 0) {
                row = document.createElement('div');
                row.className = 'row mb-4';
                container!.appendChild(row);
            }

            const col = document.createElement('div');
            col.className = 'col-6 photo-wrapper';

            const img = document.createElement('img');
            img.src = photo.path;
            img.className = 'img-fluid photo';
            img.style.cursor = 'pointer';

            img.addEventListener('click', () => {
                switch (type) {
                    case "WALL": textureManager.wallTextureSelected = photo.id; break;
                    case "FLOOR": textureManager.floorTextureSelected = photo.id; break;
                    case "ROOF": textureManager.roofTextureSelected = photo.id; break;
                    case "WINDOW_FRAME": textureManager.windowTextureSelected = photo.id; break;
                    case "DOOR_FRAME": textureManager.doorTextureSelected = photo.id; break;
                    case "DOOR": textureManager.doorTextureSelected = photo.id; break;
                }
                document.dispatchEvent(new CustomEvent(eventMap[type]));
            });

            col.appendChild(img);
            row!.appendChild(col);
            index++;
        }
    });
    
    if(type === 'ROOF') {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'd-grid gap-2 mb-3';
        const roofBtn = document.createElement('button');
        roofBtn.className = 'btn btn-outline-light';
        roofBtn.textContent = 'Toggle Roof Visibility';
        roofBtn.onclick = () => {
            const current = roofBtn.getAttribute('data-active') === 'true';
            planner3D.setShowRoof(!current);
            roofBtn.setAttribute('data-active', (!current).toString());
            roofBtn.classList.toggle('active');
        };
        btnContainer.appendChild(roofBtn);
        container.prepend(btnContainer);
    }

    // ---  SLIDER  ---

    document.getElementById("roughnessSliderLocal")?.addEventListener("input", e => {
        textureManager.setRoughness(parseInt((e.target as HTMLInputElement).value) / 100);
        document.dispatchEvent(new CustomEvent(`${type}_materialUpdated`));
        document.dispatchEvent(new CustomEvent(eventMap[type])); 
    });

    document.getElementById("metalnessSliderLocal")?.addEventListener("input", e => {
        textureManager.setMetalness(parseInt((e.target as HTMLInputElement).value) / 100);
        document.dispatchEvent(new CustomEvent(`${type}_materialUpdated`));
        document.dispatchEvent(new CustomEvent(eventMap[type])); 
    });

    document.getElementById("colorPickerLocal")?.addEventListener("input", e => {
        textureManager.setColorTint((e.target as HTMLInputElement).value);
        document.dispatchEvent(new CustomEvent(`${type}_materialUpdated`));
        document.dispatchEvent(new CustomEvent(eventMap[type]));
    });
};


// WALLS
const btnMatWalls = document.getElementById('buttonMatWalls');
if (btnMatWalls) {
    btnMatWalls.addEventListener('click', () => populateOptionsMenu("WALL"));
}

// FLOORS
const btnMatFloor = document.getElementById('buttonMatFloor');
if (btnMatFloor) {
    btnMatFloor.addEventListener('click', () => populateOptionsMenu("FLOOR"));
}

// ROOF
const btnMatRoof = document.getElementById('buttonMatRoof');
if (btnMatRoof) {
    btnMatRoof.addEventListener('click', () => populateOptionsMenu("ROOF"));
}

// WINDOW FRAMES
const btnMatWindowFrames = document.getElementById('buttonMatWindowFrames');
if (btnMatWindowFrames) {
    btnMatWindowFrames.addEventListener('click', () => populateOptionsMenu("WINDOW_FRAME"));
}

// DOOR FRAMES
const btnMatDoorFrames = document.getElementById('buttonMatDoorFrames');
if (btnMatDoorFrames) {
    btnMatDoorFrames.addEventListener('click', () => populateOptionsMenu("DOOR_FRAME"));
}

// DOORS
const btnMatDoors = document.getElementById('buttonMatDoors');
if (btnMatDoors) {
    btnMatDoors.addEventListener('click', () => populateOptionsMenu("DOOR"));
}



// // --- HOUSE DESIGNER LOGIC (MODAL) ---

// let designState = {
//     openSpace: false,
//     hallway: false,
//     bedrooms: 1,
//     bathrooms: 1
// };

// // Open Modal
// const openDesignerBtn = document.getElementById('openDesignerButton');
// if (openDesignerBtn) {
//     openDesignerBtn.innerHTML = `House Designer <i class="fa-solid fa-pencil fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
//     openDesignerBtn.addEventListener('click', () => {
//         const modalEl = document.getElementById('designerModal');
//         if (modalEl) {
//             const modal = new bootstrap.Modal(modalEl);
//             modal.show();
//         }
//     });
// }

// const generationConfig: GeneratorConfig = {
//     houseWidth: 800,
//     houseHeight: 600,
//     rooms: 6,               
//     minRoomSize: 80,       
//     maxRoomSize: 400,
//     wallHeight: 100,
//     windowProbability: 0.8, 
//     doorProbability: 0.2,
//     maxRetries: 10          
// };
// // Generate Button
// const generateBtn = document.getElementById('gb');
// if (generateBtn) {
//     generateBtn.addEventListener('click', () => {
//         console.log("Generating random house...");

//         // 1. Create generator
//         const generator = new Generator(generationConfig, planner2D.getBoard());

//         // 2. Generate plan object
//         const plan = generator.generate();

//         // 3. Convert to JSON string
//         const json = JSON.stringify(plan);

//         // 4. Feed into your existing parser
//         const parser = new Parser();
//         parser.readJSON(json);

//         // 5. Build the 2D model
//         parser.buildModel(planner2D);

//         console.log("Random house generated.");
//     });
// }

// // Design Logic - Toggle Helpers
// const updateToggleBtn = (btnId: string, stateKey: 'openSpace' | 'hallway', labelOn: string, labelOff: string) => {
//     const btn = document.getElementById(btnId);
//     if (!btn) return;

//     btn.addEventListener('click', () => {
//         // Toggle State
//         designState[stateKey] = !designState[stateKey];
//         const isActive = designState[stateKey];

//         // Update Text
//         btn.textContent = isActive ? labelOn : labelOff;

//         // Update Visuals (Bootstrap classes)
//         if (isActive) {
//             btn.classList.remove('btn-outline-dark');
//             btn.classList.add('btn-dark');
//         } else {
//             btn.classList.remove('btn-dark');
//             btn.classList.add('btn-outline-dark');
//         }
//     });
// };

// updateToggleBtn('buttonOpenSpace', 'openSpace', 'Open Space: ON', 'Open Space: OFF');
// updateToggleBtn('buttonHallway', 'hallway', 'Add Hallway: ON', 'Add Hallway: OFF');
// // Design Logic - Room Counts
// const setupGroupSelect = (groupIdPrefix: string, count: number, stateKey: 'bedrooms' | 'bathrooms') => {
//     // Determine the suffix based on key (Bed vs Bath)
//     const suffix = stateKey === 'bedrooms' ? 'Bed' : 'Bath';

//     for (let i = 1; i <= count; i++) {
//         const btnId = `${groupIdPrefix}${i}${suffix}`; // e.g., button1Bed
//         const btn = document.getElementById(btnId);
        
//         if (btn) {
//             btn.addEventListener('click', () => {
//                 // Update State
//                 designState[stateKey] = i;

//                 // Update Visuals: Loop through all siblings in this group
//                 for (let j = 1; j <= count; j++) {
//                     const siblingId = `${groupIdPrefix}${j}${suffix}`;
//                     const sibling = document.getElementById(siblingId);
                    
//                     if (sibling) {
//                         if (j === i) {
//                             // Active State
//                             sibling.classList.add('active'); 
//                             sibling.classList.remove('btn-outline-primary');
//                             sibling.classList.add('btn-primary');
//                         } else {
//                             // Inactive State
//                             sibling.classList.remove('active');
//                             sibling.classList.remove('btn-primary');
//                             sibling.classList.add('btn-outline-primary');
//                         }
//                     }
//                 }
//             });
//         }
//     }
// };

// setupGroupSelect('button', 4, 'bedrooms');
// setupGroupSelect('button', 2, 'bathrooms');

// // Generate Plan
// const btnGenerate = document.getElementById('buttonGenerate');
// if (btnGenerate) {
//     btnGenerate.addEventListener('click', () => {
//         planner2D.clearBoard();
        
//         const lenInput = document.getElementById("designerLength") as HTMLInputElement;
//         const widInput = document.getElementById("designerWidth") as HTMLInputElement;
        
//         const length = parseInt(lenInput?.value) || 1500; // Default fallback
//         const width = parseInt(widInput?.value) || 1000;

//         let totalRooms = designState.bedrooms + designState.bathrooms;
//         if (designState.hallway) totalRooms += 1;
//         if (designState.openSpace) totalRooms += 1; else totalRooms += 2;

//         console.log(`Generating: ${length}x${width}, Rooms: ${totalRooms}`);
        
//         designer.createHousePlan(length, width, totalRooms);
//         designer.buildModel(planner2D);
// //     });
// }


// --- PROCEDURAL GENERATOR LOGIC (MODAL) ---
const presetGenerationConfig: GeneratorConfig = {
    houseWidth: 800,
    houseHeight: 600,
    rooms: 6,               
    minRoomSize: 80,       
    maxRoomSize: 400,
    wallHeight: 100,
    windowProbability: 0.8, 
    doorProbability: 0.2,
    maxRetries: 10,
    numBedrooms: 1,
    numBathrooms: 1          
};
const openDesignerBtn = document.getElementById('openDesignerButton');
if (openDesignerBtn) {
    openDesignerBtn.innerHTML = `House Generator <i class="fa-solid fa-wand-magic-sparkles fa-xl fa-fw" style="margin-left: 1em;"></i>`;
    openDesignerBtn.addEventListener('click', () => {
        const modalEl = document.getElementById('designerModal');
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
    });
}

const btnGenerate = document.getElementById('buttonGenerate');
if (btnGenerate) {
    btnGenerate.addEventListener('click', async () => {
        console.log("Generating random house from Modal...");
        
        await planner2D.clearBoard();
        
        const widthInput = document.getElementById("genWidth") as HTMLInputElement;
        const heightInput = document.getElementById("genHeight") as HTMLInputElement;
        const roomsInput = document.getElementById("genRooms") as HTMLInputElement;
        
        const bedroomsInput = document.getElementById("genBedrooms") as HTMLInputElement;
        const bathroomsInput = document.getElementById("genBathrooms") as HTMLInputElement;

        const minSizeInput = document.getElementById("genMinRoomSize") as HTMLInputElement;
        const maxSizeInput = document.getElementById("genMaxRoomSize") as HTMLInputElement;
        const windowProbInput = document.getElementById("genWindowProb") as HTMLInputElement;
        const doorProbInput = document.getElementById("genDoorProb") as HTMLInputElement;

        const requestedBedrooms = parseInt(bedroomsInput?.value) || 1;
        const requestedBathrooms = parseInt(bathroomsInput?.value) || 1;
        const requestedTotalRooms = parseInt(roomsInput?.value) || 6;
        const minRequiredRooms = requestedBedrooms + requestedBathrooms + 2;

        const generationConfig = {
            houseWidth: parseInt(widthInput?.value) || 800,
            houseHeight: parseInt(heightInput?.value) || 600,
            rooms: Math.max(requestedTotalRooms, minRequiredRooms), 
            minRoomSize: parseInt(minSizeInput?.value) || 80,
            maxRoomSize: parseInt(maxSizeInput?.value) || 400, 
            windowProbability: parseFloat(windowProbInput?.value) || 0.8,
            doorProbability: parseFloat(doorProbInput?.value) || 0.2,
            wallHeight: 100,
            maxRetries: 10,
            numBedrooms: requestedBedrooms || 1,
            numBathrooms: requestedBathrooms || 1
        };

        try {
            const generator = new Generator(generationConfig, planner2D.getBoard());
            const plan = generator.generate();

            const json = JSON.stringify(plan);

            parser = new Parser();
            parser.readJSON(json);

            parser.buildModel(planner2D);

            console.log("Random house generated successfully.");
            
        } catch (error: any) {
            console.error("Generator failed:", error);
            alert("Failed to generate a layout with these settings. Try adjusting the dimensions or lowering the room count.");
        }
    });
}

// Furniture generator
const btnAutoFurniture = document.getElementById('btnAutoFurniture');

if (btnAutoFurniture) {
    btnAutoFurniture.addEventListener('click', async () => {
        
        const liveJson = planner2D.toJSON();
        const currentPlan = JSON.parse(liveJson);
        
        if (!currentPlan || !currentPlan.rooms || currentPlan.rooms.length === 0) {
            alert("No floor plan found! Please generate or draw one first.");
            return;
        }

        const fGenerator = new FurnitureGenerator();

        if (!fGenerator.validatePlan(currentPlan)) {
            alert("Error: One or more rooms are missing a Room Type label. Please ensure all rooms are generated/labeled before adding furniture.");
            return;
        }

        try {
            console.log("Generating furniture...");
            
            const populatedPlan = await fGenerator.generate(currentPlan);

            const updatedJson = JSON.stringify(populatedPlan);
            
            await planner2D.clearBoard();
            parser.readJSON(updatedJson);
            parser.buildModel(planner2D);

            console.log("Furniture added successfully!");

        } catch (error) {
            console.error("Furniture Generation Failed:", error);
            alert("An error occurred while placing furniture.");
        }
    });
}


type PlacementRole = "main_wall" | "second_wall" | "center" | "center_offset";

const btnImportFurniture = document.getElementById('buttonImportFurniture');
const blendFileInput = document.getElementById('blendFileInput') as HTMLInputElement;

if (btnImportFurniture && blendFileInput) {
    btnImportFurniture.innerHTML = `Import Furniture <i class="fa-solid fa-couch fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    
    btnImportFurniture.addEventListener('click', () => blendFileInput.click());

    blendFileInput.addEventListener('change', async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        
        const loadingModalEl = document.getElementById('blenderLoadingModal');
        if (loadingModalEl) {
            const loadingModal = new bootstrap.Modal(loadingModalEl);
            loadingModal.show();
        }

        const formData = new FormData();
        formData.append('blendFile', file);

        try {
            //console.log(`Sending ${file.name} to Blender backend...`);
            
            const response = await fetch('/api/import-furniture', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();

            if (data.success) {
                console.log("Furniture generated successfully:", data.paths);
                
                const baseName = file.name.replace('.blend', '');
                const parts = baseName.split('_');

                let parsedRoomType = "other";
                let roleCode = "3";
                let cleanName = baseName;

                if (parts.length >= 3 && !isNaN(parseInt(parts[1]))) {
                    parsedRoomType = parts[0].toLowerCase();
                    roleCode = parts[1];
                    cleanName = parts.slice(2).join(' ').replace(/\b\w/g, l => l.toUpperCase());
                } else {
                    cleanName = baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                }

                let placementRole: PlacementRole = "center";
                if (roleCode === "1") placementRole = "main_wall";
                if (roleCode === "2") placementRole = "second_wall";
                if (roleCode === "3") placementRole = "center";
                if (roleCode === "4") placementRole = "center_offset";

                const img = new Image();
                img.src = data.paths.symbol;
                
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; 
                });

                const objWidth = img.naturalWidth || 100;
                const objDepth = img.naturalHeight || 100;

                const newId = furnitureAssets.length > 0 
                    ? Math.max(...furnitureAssets.map(f => f.id)) + 1 
                    : 0;

            
                const furnitureAsset = {
                    id: newId,
                    name: cleanName,
                    roomType: parsedRoomType,
                    role: placementRole,
                    width: objWidth,
                    depth: objDepth,
                    offsetX: objWidth, 
                    floorplanPath: data.paths.symbol, 
                    menuIconPath: data.paths.icon,   
                    obj: data.paths.obj,              
                    mtl: data.paths.mtl,              
                    scale: 30
                };

                furnitureAssets.push(furnitureAsset);
                await planner2D.createFurnitureTexture(furnitureAsset);
                
                populateFurnitureMenu();
                
            } else {
                alert('Blender processing failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert('Failed to connect to the server to process the model.');
        } finally {
            if (loadingModalEl) {
                // @ts-ignore
                const bootstrapModal = bootstrap.Modal.getInstance(loadingModalEl);
                if (bootstrapModal) bootstrapModal.hide();
            }
            input.value = ''; 
        }
    });
}

