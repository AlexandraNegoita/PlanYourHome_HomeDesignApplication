import express, { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { spawn } from 'child_process';
export const app = Router();
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, ''));
    }
});
const upload = multer({ storage });
const BLENDER_EXEC = 'C:\\Program Files\\Blender Foundation\\Blender 4.2\\blender.exe';
const PYTHON_SCRIPT_PATH = path.join(__dirname, 'import-asset.py');
const APP_ASSETS_DIR = path.join(__dirname, 'build/src/pages/assets');
app.post('/api/import-furniture', upload.single('blendFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No blend file provided' });
    }
    const uploadedFilePath = req.file.path;
    const itemName = req.file.filename.replace('.blend', '');
    console.log(`\n📥 Received file: ${itemName}.blend`);
    console.log(`⚙️ Running Blender in background...`);
    const blenderProcess = spawn(BLENDER_EXEC, [
        '-b', uploadedFilePath, // -b = background mode
        '-P', PYTHON_SCRIPT_PATH, // -P = run python script
        '--', APP_ASSETS_DIR // Pass target directory to Python
    ]);
    blenderProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output.includes('---'))
            console.log(output);
    });
    blenderProcess.stderr.on('data', (data) => console.error(`Blender Error: ${data}`));
    blenderProcess.on('close', (code) => {
        if (fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
        }
        if (code === 0) {
            console.log(`Generated assets for ${itemName}`);
            res.json({
                success: true,
                paths: {
                    icon: `./assets/icons/${itemName}.png`,
                    symbol: `./assets/symbols/${itemName}.png`,
                    obj: `./assets/furniture/obj/${itemName}.obj`,
                    mtl: `./assets/furniture/mtl/${itemName}.mtl`
                }
            });
        }
        else {
            console.error(`Blender process exited with code ${code}`);
            res.status(500).json({ error: 'Blender failed to process the file.' });
        }
    });
});
console.log('Serving static files from:', path.join(__dirname, 'build/src/pages'));
app.use(express.static(path.join(__dirname, 'build/src/pages')));
