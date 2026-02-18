// --- IMPORTS ---
import '/css/styles.css';
import * as bootstrap from 'bootstrap'; // Ensure Bootstrap is installed via npm

import * as Viewer2D from '../planner/viewer2d/Viewer2D';
import * as Viewer3D from '../planner/viewer3d/Viewer3D';
import { TextureManager } from '../planner/viewer3d/TextureManager';
import { SpriteManager } from '../planner/viewer2d/SpriteManager';
import { Parser } from '../planner/model/Parser';
import { Designer } from '../planner/model/Designer';
import './menu';
import './loader';
import './designer';

// --- INITIALIZATION ---

// 1. Setup Texture Manager
const textureManager = new TextureManager(
    [
        { id: "0", for: "GROUND", path: "./assets/textures/ground/GroundGrassGreen002_COL_2K.jpg", type: "COL" },
        { id: "0", for: "GROUND", path: "./assets/textures/ground/GroundGrassGreen002_NRM_2K.jpg", type: "NRM" },

        { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_THUMB.png", type: "THUMB" },
        { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_Base_Color.jpg", type: "COL" },
        { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_Normal.jpg", type: "NRM" },
        { id: "1634", for: "WALL", path: "./assets/textures/walls/wall_1634/Terracotta_Tiles_002_Height.png", type: "HGT" },

        { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_THUMB.jpg", type: "THUMB" },
        { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_COLOR.jpg", type: "COL" },
        { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_NORM.jpg", type: "NRM" },
        { id: "4954", for: "WALL", path: "./assets/textures/walls/wall_4954/Plaster_Rough_001_DISP.png", type: "HGT" },

        { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Material_2050.jpg", type: "THUMB" },
        { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Concrete_019_BaseColor.jpg", type: "COL" },
        { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Concrete_019_Normal.jpg", type: "NRM" },
        { id: "2050", for: "WALL", path: "./assets/textures/walls/wall_2050/Concrete_019_Height.png", type: "HGT" },

        { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Material_2051.jpg", type: "THUMB" },
        { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Wall_Plaster_002_BaseColor.jpg", type: "COL" },
        { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Wall_Plaster_002_Normal.jpg", type: "NRM" },
        { id: "3959", for: "WALL", path: "./assets/textures/walls/wall_3959/Wall_Plaster_002_Height.png", type: "HGT" },

        { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Material_1952.jpg", type: "THUMB" },
        { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Wall_Plaster_001_basecolor.jpg", type: "COL" },
        { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Wall_Plaster_001_normal.jpg", type: "NRM" },
        { id: "4359", for: "WALL", path: "./assets/textures/walls/wall_4359/Wall_Plaster_001_height.png", type: "HGT" },

        { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Material_606.png", type: "THUMB" },
        { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Concrete_014_4K_COLOR.jpg", type: "COL" },
        { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Concrete_014_4K_NORM.jpg", type: "NRM" },
        { id: "6060", for: "WALL", path: "./assets/textures/walls/wall_6060/Concrete_014_4K_DISP.png", type: "HGT" },

        { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Material_1903.jpg", type: "THUMB" },
        { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Tiles_Stone_001_basecolor.jpg", type: "COL" },
        { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Tiles_Stone_001_normal.jpg", type: "NRM" },
        { id: "4683", for: "ROOF", path: "./assets/textures/roof/roof_4683/Tiles_Stone_001_height.png", type: "HGT" },

        { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Material_1846.jpg", type: "THUMB" },
        { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Roof_Tiles_Terracotta_008_basecolor.jpg", type: "COL" },
        { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Roof_Tiles_Terracotta_008_normal.jpg", type: "NRM" },
        { id: "2283", for: "ROOF", path: "./assets/textures/roof/roof_2283/Roof_Tiles_Terracotta_008_height.png", type: "HGT" },

        { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Material_2025.jpg", type: "THUMB" },
        { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Plastic_003_basecolor.jpg", type: "COL" },
        { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Plastic_003_normal.jpg", type: "NRM" },
        { id: "2734", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_2734/Plastic_003_height.jpg", type: "HGT" },

        { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Material_1504.jpg", type: "THUMB" },
        { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Granite_Red_001_Base Color.jpg", type: "COL" },
        { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Granite_Red_001_Height.png", type: "HGT" },
        { id: "9304", for: "WINDOW_FRAME", path: "./assets/textures/windows/window_9304/Granite_Red_001_Normal.jpg", type: "NRM" },

        { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Material_2003.png", type: "THUMB" },
        { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Wood_Particle_Board_005_basecolor.png", type: "COL" },
        { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Wood_Particle_Board_005_normal.png", type: "NRM" },
        { id: "8696", for: "FLOOR", path: "./assets/textures/floors/floor_8696/Wood_Particle_Board_005_height.png", type: "HGT" },

        { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Material_553.png", type: "THUMB" },
        { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Wood_007_COLOR.jpg", type: "COL" },
        { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Wood_007_DISP.png", type: "HGT" },
        { id: "2843", for: "FLOOR", path: "./assets/textures/floors/floor_2843/Wood_007_NORM.jpg", type: "NRM" },
    ],
    './assets/textures/HDRI/lonely_road_afternoon_puresky_4k.hdr'
);

document.addEventListener('contextmenu', event => event.preventDefault());

// 2. Setup Core Classes
const planner2D = new Viewer2D.Viewer2D();
const planner3D = new Viewer3D.Viewer3D(planner2D.getModel(), planner2D.getBoard(), textureManager);
const designer = new Designer();
const parser = new Parser();

// 3. Initialize App
(async () => {
    // Init 2D
    await planner2D.init({
        resizeTo: window,
        backgroundColor: 0xFAEBD7
    });

    let spriteManager = new SpriteManager();
    await spriteManager.setWindowPath('./assets/symbols/window.jpg');
    await spriteManager.setDoorPath('./assets/symbols/door.svg');
    planner2D.setup(spriteManager);

    // DOM Attachments for 2D
    const contentDiv = document.getElementById('content');
    const canvas2D = planner2D.canvas;
    canvas2D.setAttribute('id', 'canvas2D');
    
    // Init 3D (Hidden by default)
    if (contentDiv) {
        contentDiv.appendChild(canvas2D);
        planner3D.setup(75, window.innerWidth, window.innerHeight, 0.1, 1000, contentDiv);
    }
    
    const canvas3D = planner3D.getRendererCanvas();
    canvas3D.setAttribute('id', 'canvas3D');
    canvas3D.style.display = 'none'; // Start hidden
    if (contentDiv) contentDiv.appendChild(canvas3D);

})();


// --- UI LOGIC ---

// Globals for UI State
const uiState = {
    drawMode: 'wall', // 'wall' | 'room'
    is3D: false,
    editMode: false,
    materialsOpen: false
};

// DOM Elements
const configMenu = document.getElementById('configurationMenu');
const optionsMenu = document.getElementById('optionsMenu');
const openMenuBtn = document.getElementById('openMenu');
const closeOptionsBtn = document.getElementById('closeOptionsMenu');

// 1. Sidebar Toggle Logic
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
            // Close secondary menu when main menu closes
            optionsMenu?.classList.remove('is-active');
        }
    });
}

if (closeOptionsBtn && optionsMenu) {
    closeOptionsBtn.addEventListener('click', () => {
        optionsMenu.classList.remove('is-active');
    });
}

// 2. View Switcher (2D <-> 3D)
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
const buttonExportJSON = document.getElementById('buttonExportJSON');
if (buttonExportJSON) {
    buttonExportJSON.innerHTML = `Export to JSON <i class="fa-solid fa-file-export fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    buttonExportJSON.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(planner2D.toJSON());
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "house_plan.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
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
        // Visual feedback
        btn.parentElement?.style.setProperty('background', isHidden ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)');
        
        // Logic for Edit Mode specifically
        if (btnId === 'buttonEditMode') {
            uiState.editMode = isHidden; // Toggle logic
            planner2D.setEditMode(isHidden ? Viewer2D.editMode.EDIT : Viewer2D.editMode.NONE);
        }
    });
};

setupAccordion('buttonEditMode', 'editMenu', 'Edit Mode', 'fa-solid fa-draw-polygon');
setupAccordion('buttonMaterials', 'materialMenu', 'Materials', 'fa-solid fa-palette');

// 6. Sub-Edit Tools
const setupToolBtn = (id: string, label: string, icon: string, mode: Viewer2D.editMode) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.innerHTML = `${label} <i class="${icon} fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    
    btn.addEventListener('click', () => {
        // Reset others (simple visual reset, logic handled by planner)
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
setupToolBtn('buttonEditDoor', 'Door', 'fa-solid fa-door-open', Viewer2D.editMode.DOOR);


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
    // Shininess removed. Added Bootstrap classes.
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

    // Helper map to trigger the correct "Changed" event for live updates
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
                // Dispatch event to update texture
                document.dispatchEvent(new CustomEvent(eventMap[type]));
            });

            col.appendChild(img);
            row!.appendChild(col);
            index++;
        }
    });
    
    // Add extra controls for Roof visibility if type is roof or generic
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

    // --- LOCAL SLIDER EVENTS ---
    // We dispatch both the specific parameter update AND the main texture changed event
    // to ensure the Viewer immediately re-renders the material properties.

    document.getElementById("roughnessSliderLocal")?.addEventListener("input", e => {
        textureManager.setRoughness(parseInt((e.target as HTMLInputElement).value) / 100);
        document.dispatchEvent(new CustomEvent(`${type}_materialUpdated`));
        document.dispatchEvent(new CustomEvent(eventMap[type])); // Force Live Update
    });

    document.getElementById("metalnessSliderLocal")?.addEventListener("input", e => {
        textureManager.setMetalness(parseInt((e.target as HTMLInputElement).value) / 100);
        document.dispatchEvent(new CustomEvent(`${type}_materialUpdated`));
        document.dispatchEvent(new CustomEvent(eventMap[type])); // Force Live Update
    });

    document.getElementById("colorPickerLocal")?.addEventListener("input", e => {
        textureManager.setColorTint((e.target as HTMLInputElement).value);
        document.dispatchEvent(new CustomEvent(`${type}_materialUpdated`));
        document.dispatchEvent(new CustomEvent(eventMap[type])); // Force Live Update
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



// --- HOUSE DESIGNER LOGIC (MODAL) ---

let designState = {
    openSpace: false,
    hallway: false,
    bedrooms: 1,
    bathrooms: 1
};

// Open Modal
const openDesignerBtn = document.getElementById('openDesignerButton');
if (openDesignerBtn) {
    openDesignerBtn.innerHTML = `House Designer <i class="fa-solid fa-pencil fa-2xl fa-fw" style="margin-left: 1em;"></i>`;
    openDesignerBtn.addEventListener('click', () => {
        const modalEl = document.getElementById('designerModal');
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
    });
}

// Design Logic - Toggle Helpers
const updateToggleBtn = (btnId: string, stateKey: 'openSpace' | 'hallway', labelOn: string, labelOff: string) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Toggle State
        designState[stateKey] = !designState[stateKey];
        const isActive = designState[stateKey];

        // Update Text
        btn.textContent = isActive ? labelOn : labelOff;

        // Update Visuals (Bootstrap classes)
        if (isActive) {
            btn.classList.remove('btn-outline-dark');
            btn.classList.add('btn-dark');
        } else {
            btn.classList.remove('btn-dark');
            btn.classList.add('btn-outline-dark');
        }
    });
};

updateToggleBtn('buttonOpenSpace', 'openSpace', 'Open Space: ON', 'Open Space: OFF');
updateToggleBtn('buttonHallway', 'hallway', 'Add Hallway: ON', 'Add Hallway: OFF');
// Design Logic - Room Counts
const setupGroupSelect = (groupIdPrefix: string, count: number, stateKey: 'bedrooms' | 'bathrooms') => {
    // Determine the suffix based on key (Bed vs Bath)
    const suffix = stateKey === 'bedrooms' ? 'Bed' : 'Bath';

    for (let i = 1; i <= count; i++) {
        const btnId = `${groupIdPrefix}${i}${suffix}`; // e.g., button1Bed
        const btn = document.getElementById(btnId);
        
        if (btn) {
            btn.addEventListener('click', () => {
                // Update State
                designState[stateKey] = i;

                // Update Visuals: Loop through all siblings in this group
                for (let j = 1; j <= count; j++) {
                    const siblingId = `${groupIdPrefix}${j}${suffix}`;
                    const sibling = document.getElementById(siblingId);
                    
                    if (sibling) {
                        if (j === i) {
                            // Active State
                            sibling.classList.add('active'); 
                            sibling.classList.remove('btn-outline-primary');
                            sibling.classList.add('btn-primary');
                        } else {
                            // Inactive State
                            sibling.classList.remove('active');
                            sibling.classList.remove('btn-primary');
                            sibling.classList.add('btn-outline-primary');
                        }
                    }
                }
            });
        }
    }
};

setupGroupSelect('button', 4, 'bedrooms');
setupGroupSelect('button', 2, 'bathrooms');

// Generate Plan
const btnGenerate = document.getElementById('buttonGenerate');
if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
        planner2D.clearBoard();
        
        const lenInput = document.getElementById("designerLength") as HTMLInputElement;
        const widInput = document.getElementById("designerWidth") as HTMLInputElement;
        
        const length = parseInt(lenInput?.value) || 1500; // Default fallback
        const width = parseInt(widInput?.value) || 1000;

        let totalRooms = designState.bedrooms + designState.bathrooms;
        if (designState.hallway) totalRooms += 1;
        if (designState.openSpace) totalRooms += 1; else totalRooms += 2;

        console.log(`Generating: ${length}x${width}, Rooms: ${totalRooms}`);
        
        designer.createHousePlan(length, width, totalRooms);
        designer.buildModel(planner2D);
    });
}