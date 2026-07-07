import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const TEXTURES_DIR = path.join(__dirname, 'assets/textures');
const OUTPUT_FILE = path.join(__dirname, 'generated-textures.ts');

export interface TextureAsset {
    id: string;
    for: string;
    path: string;
    type: string;
}


const CATEGORIES = [
    { folder: 'ground', forType: 'GROUND', hasSubfolders: false, defaultId: '0' },
    { folder: 'walls', forType: 'WALL', hasSubfolders: true },
    { folder: 'floors', forType: 'FLOOR', hasSubfolders: true },
    { folder: 'roof', forType: 'ROOF', hasSubfolders: true },
    { folder: 'windows', forType: 'WINDOW_FRAME', hasSubfolders: true },
    { folder: 'door_frames', forType: 'DOOR_FRAME', hasSubfolders: true },
    { folder: 'doors', forType: 'DOOR', hasSubfolders: true }
];


function determineType(filename: string): string | null {
    const lower = filename.toLowerCase();
    
    
    if (!lower.endsWith('.jpg') && !lower.endsWith('.jpeg') && !lower.endsWith('.png')) {
        return null; 
    }

    if (lower.includes('thumb') || lower.includes('material_') || lower.includes('preview')) return 'THUMB';
    if (lower.includes('col') || lower.includes('color') || lower.includes('albedo')) return 'COL';
    if (lower.includes('nrm') || lower.includes('normal') || lower.includes('norm')) return 'NRM';
    if (lower.includes('hgt') || lower.includes('height') || lower.includes('disp')) return 'HGT';
    
    return null; 
}

function generateTextures(): void {
    const textureAssets: TextureAsset[] = [];

    CATEGORIES.forEach(category => {
        const categoryPath = path.join(TEXTURES_DIR, category.folder);
        
        if (!fs.existsSync(categoryPath)) {
            console.warn(`⚠️ Directory not found, skipping: ${categoryPath}`);
            return;
        }

        if (category.hasSubfolders) {
            
            const subdirs = fs.readdirSync(categoryPath);
            
            subdirs.forEach(subdir => {
                const subdirPath = path.join(categoryPath, subdir);
                if (fs.statSync(subdirPath).isDirectory()) {
                    
                    
                    const parts = subdir.split('_');
                    const id = parts.length > 1 ? parts[parts.length - 1] : subdir;

                    const files = fs.readdirSync(subdirPath);
                    files.forEach(file => {
                        const type = determineType(file);
                        if (type) {
                            textureAssets.push({
                                id: id,
                                for: category.forType,
                                
                                path: `./assets/textures/${category.folder}/${subdir}/${file}`.replace(/\\/g, '/'),
                                type: type
                            });
                        }
                    });
                }
            });
        } else {
            
            const files = fs.readdirSync(categoryPath);
            files.forEach(file => {
                const type = determineType(file);
                if (type && fs.statSync(path.join(categoryPath, file)).isFile()) {
                    textureAssets.push({
                        id: category.defaultId!,
                        for: category.forType,
                        path: `./assets/textures/${category.folder}/${file}`.replace(/\\/g, '/'),
                        type: type
                    });
                }
            });
        }
    });

    
    const fileContent = `



export interface TextureAsset {
    id: string;
    for: string;
    path: string;
    type: string;
}

export const textureAssets: TextureAsset[] = ${JSON.stringify(textureAssets, null, 4)};
    `;

    fs.writeFileSync(OUTPUT_FILE, fileContent.trim());
    console.log(`Successfully generated ${textureAssets.length} textures into src/pages/generated-textures.ts`);
}


generateTextures();