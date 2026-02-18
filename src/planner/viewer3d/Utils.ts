import * as THREE from 'three';
import { Model } from '../model/Model';
import { TextureManager } from './TextureManager';

export class Utils {
    calculateRatio(coord: number) {
        return coord/30;
    }
    checkAngle(startPointX: number, startPointY: number, endPointX: number, endPointY: number) {
        //distance
        var wall1X = 1;
        var wall1Y = 0; //this.y - this.y
        var wall2X = endPointX - startPointX;
        var wall2Y = endPointY - startPointY;
        var angle = Math.atan2(wall1X * wall2Y - wall1Y * wall2X, wall1X * wall2X + wall1Y * wall2Y);
        // if(angle < 0) {angle = angle * -1;}
        var degree_angle = 180 - angle * (180 / Math.PI);
        //console.log("angle: " + degree_angle)
        return angle;
        //if(degree_angle > 90) return false;
        //return true;
    }
}