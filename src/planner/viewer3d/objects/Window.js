import * as THREE from 'three';
import { Utils } from '../Utils';
export class Window {
    textures;
    materials;
    constructor(textures, materials) {
        this.textures = textures;
        this.materials = materials;
    }
    utils = new Utils();
    buildWindow(windowData, wallID, width, height, thickness, orientation, angle) {
        if (windowData.window.partOfWall == wallID) {
            let local1 = new THREE.Vector3(this.utils.calculateRatio(windowData.window.centerPoint.coordX), this.utils.calculateRatio(windowData.window.centerPoint.coordY) + this.utils.calculateRatio(height) * 0.6);
            const window3DWidth = 2.0;
            const halfW = window3DWidth / 2.0;
            const halfH = height * 0.3;
            let windowShape = new THREE.Shape();
            windowShape.moveTo(local1.x - halfW, local1.y + halfH);
            windowShape.lineTo(local1.x + halfW, local1.y + halfH);
            windowShape.lineTo(local1.x + halfW, local1.y - halfH);
            windowShape.lineTo(local1.x - halfW, local1.y - halfH);
            windowShape.lineTo(local1.x - halfW, local1.y + halfH);
            const windowGeometry = new THREE.ExtrudeGeometry([windowShape], {
                steps: 512,
                depth: thickness * 1.5,
                bevelEnabled: false,
            });
            windowGeometry.translate(-local1.x, -local1.y, -(thickness * 1.5) / 2);
            windowGeometry.rotateX(Math.PI / 2);
            if (orientation == 'vertical')
                windowGeometry.rotateZ(Math.PI / 2);
            else if (orientation == 'diagonal')
                windowGeometry.rotateZ(angle);
            windowGeometry.translate(local1.x, local1.y, (thickness * 1.5) + height * 0.3);
            const materialID = this.textures.windowTextureSelected;
            let window = new THREE.Mesh(windowGeometry, this.materials.windowMaterial(this.textures.windowTextureLoaded[materialID].winCOL, this.textures.windowTextureLoaded[materialID].winNRM, this.textures.windowTextureLoaded[materialID].winHGT));
            window.position.z = 0;
            return window;
        }
        return null;
    }
    buildWindowFrame(windowData, wallID, width, height, thickness, orientation, angle) {
        if (windowData.window.partOfWall == wallID) {
            let local1 = new THREE.Vector3(this.utils.calculateRatio(windowData.window.centerPoint.coordX), this.utils.calculateRatio(windowData.window.centerPoint.coordY) + this.utils.calculateRatio(height) * 0.6);
            const window3DWidth = 2.0;
            const halfW = window3DWidth / 2.0;
            const halfH = height * 0.3;
            const framePadding = 0.1;
            let windowFrameShape = new THREE.Shape();
            windowFrameShape.moveTo(local1.x - halfW - framePadding, local1.y + halfH + framePadding);
            windowFrameShape.lineTo(local1.x + halfW + framePadding, local1.y + halfH + framePadding);
            windowFrameShape.lineTo(local1.x + halfW + framePadding, local1.y - halfH - framePadding);
            windowFrameShape.lineTo(local1.x - halfW - framePadding, local1.y - halfH - framePadding);
            windowFrameShape.lineTo(local1.x - halfW - framePadding, local1.y + halfH + framePadding);
            let hole = new THREE.Path();
            hole.moveTo(local1.x - halfW, local1.y + halfH);
            hole.lineTo(local1.x + halfW, local1.y + halfH);
            hole.lineTo(local1.x + halfW, local1.y - halfH);
            hole.lineTo(local1.x - halfW, local1.y - halfH);
            hole.lineTo(local1.x - halfW, local1.y + halfH);
            windowFrameShape.holes.push(hole);
            const windowFrameGeometry = new THREE.ExtrudeGeometry([windowFrameShape], {
                steps: 512,
                depth: thickness,
                bevelEnabled: true,
            });
            windowFrameGeometry.translate(-local1.x, -local1.y, -thickness / 2);
            windowFrameGeometry.rotateX(Math.PI / 2);
            if (orientation == 'vertical')
                windowFrameGeometry.rotateZ(Math.PI / 2);
            else if (orientation == 'diagonal')
                windowFrameGeometry.rotateZ(angle);
            windowFrameGeometry.translate(local1.x, local1.y, (thickness * 1.5) + height * 0.3);
            let windowFrame = null;
            const materialID = this.textures.windowTextureSelected;
            const mat = this.materials.windowFrameMaterial(materialID);
            if (mat instanceof THREE.MeshStandardMaterial) {
                mat.map?.repeat.set(0.3, 0.3);
                mat.normalMap?.repeat.set(0.3, 0.3);
                mat.displacementMap?.repeat.set(0.3, 0.3);
                windowFrame = new THREE.Mesh(windowFrameGeometry, mat);
                windowFrame.position.z = 0;
            }
            return windowFrame;
        }
        return null;
    }
    buildHoleCutter(windowData, wallID, height, thickness, orientation, angle) {
        if (windowData.window.partOfWall == wallID) {
            let local1 = new THREE.Vector3(this.utils.calculateRatio(windowData.window.centerPoint.coordX), this.utils.calculateRatio(windowData.window.centerPoint.coordY) + this.utils.calculateRatio(height) * 0.6);
            const window3DWidth = 2.0;
            const halfW = window3DWidth / 2.0;
            const halfH = height * 0.3;
            let windowShape = new THREE.Shape();
            windowShape.moveTo(local1.x - halfW, local1.y + halfH);
            windowShape.lineTo(local1.x + halfW, local1.y + halfH);
            windowShape.lineTo(local1.x + halfW, local1.y - halfH);
            windowShape.lineTo(local1.x - halfW, local1.y - halfH);
            windowShape.lineTo(local1.x - halfW, local1.y + halfH);
            const windowGeometry = new THREE.ExtrudeGeometry([windowShape], {
                steps: 1,
                depth: thickness * 5,
                bevelEnabled: false,
            });
            windowGeometry.translate(-local1.x, -local1.y, -(thickness * 5) / 2);
            windowGeometry.rotateX(Math.PI / 2);
            if (orientation == 'vertical')
                windowGeometry.rotateZ(Math.PI / 2);
            else if (orientation == 'diagonal')
                windowGeometry.rotateZ(angle);
            windowGeometry.translate(local1.x, local1.y, (thickness * 1.5) + height * 0.3);
            const cutter = new THREE.Mesh(windowGeometry, new THREE.MeshBasicMaterial());
            cutter.updateMatrix();
            return cutter;
        }
        return null;
    }
}
