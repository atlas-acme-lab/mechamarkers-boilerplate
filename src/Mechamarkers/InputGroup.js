import { inv } from 'mathjs';
import Button from './InputClasses/Button';
import Toggle from './InputClasses/Toggle';
import Knob from './InputClasses/Knob';
import Slider from './InputClasses/Slider';
import * as Vec2 from './Utils/Vec2';

import { calDistortionMatrices, matrixTransform } from './Utils/Distortion';
const config = {};

const { vecSub, vecRot, vecScale, vecAngleBetween, vecEMA, vecMag } = Vec2;

// These need to be made constants
const CORNER_ANGLE = -3*Math.PI/4;
const xaxis = {x:1, y:0};
const yaxis = {x:0, y:1};
const angleRefAxis = xaxis;

class InputGroup {
  constructor(markerData, config) {
    this.name = config.name;
    if (config.anchorID !== '') {
      this.anchor = markerData[config.anchorID];
      this.anchor.timeout = config.detectWindow;
      this.anchor.inuse = true;
    }
    this.inputs = config.inputs.map((i) => {
      switch(i.type) {
        case 'BUTTON':
          return new Button(markerData, i);
        case 'TOGGLE':
          return new Toggle(markerData, i);
        case 'KNOB':
          return new Knob(markerData, i);
        case 'SLIDER':
          return new Slider(markerData, i);
        default:
          break;
      }   
    });

    this.boundingBox = { //set with calBoundingBox()
      x: -1, 
      y: -1,
      w: -1,
      h: -1,
    };
    this.angle = 0;
    this.pos = {x:0, y:0};

    // Undistortion Matrix stuff
    this.matrixRect2Quad;
    this.matrixQuad2Rect;

    this.markerSize = config.markerSize;
    this.markerCorners = [
      { x: -config.markerSize/2, y: -config.markerSize/2 },
      { x: config.markerSize/2, y: -config.markerSize/2 },
      { x: config.markerSize/2, y: config.markerSize/2 },
      { x: -config.markerSize/2, y: config.markerSize/2 }
    ];

    this.cornerAngleGroup = 1*Math.PI/4;
    this.cornerAngleInput = -1*Math.PI/4;
  }

  getInput(inputName) {
    // throw error when can't find input by name
    return this.inputs.find(i => i.name == inputName);
  }

  getInputByID(id) {
    return this.inputs[id];
  }

  isPresent() {
    return this.anchor.present;
  }

  calBoundingBox(markerOffsetSize, pxpermm) {
    if (!this.anchor) return;
    let centerPts = this.inputs.map(i => {
      if (!i || !i.actor) return { x: 0, y: 0 };
      // Give each input class a get center point
      return (vecRot(vecScale(xaxis, i.relativePosition.distance*pxpermm), i.relativePosition.angle - this.cornerAngleInput));
    });
    centerPts.push({x:0, y:0});

    centerPts.sort((a, b) => (a.x - b.x));
    const xmax = centerPts[centerPts.length-1].x;
    const xmin = centerPts[0].x;
    const xw = xmax - xmin;
    
    centerPts.sort((a, b) => (a.y - b.y));
    const ymax = centerPts[centerPts.length-1].y;
    const ymin = centerPts[0].y;
    const yh = ymax - ymin;
    
    this.boundingBox.x = xmin - markerOffsetSize;
    this.boundingBox.y = ymin - markerOffsetSize;
    this.boundingBox.w = xw + markerOffsetSize*2;
    this.boundingBox.h = yh + markerOffsetSize*2;
  }

  update() {
    if (!this.anchor) return;
    this.angle = -vecAngleBetween(vecSub(this.anchor.center, this.anchor.corner), angleRefAxis) - this.cornerAngleGroup;
    this.pos = vecEMA(this.anchor.center, this.pos, 0.5);
    if (this.anchor.present) {
      this.matrixRect2Quad = calDistortionMatrices(
        this.anchor.allCorners[0], this.anchor.allCorners[1], this.anchor.allCorners[2], this.anchor.allCorners[3],
        this.markerCorners[0], this.markerCorners[1], this.markerCorners[2], this.markerCorners[3]
      );

      this.matrixQuad2Rect = inv(this.matrixRect2Quad);
      this.inputs.forEach((i) => {
        // If an input is generic, this will be undefined since there is no class
        if (i) i.update(this);
      });
    }
  }

  display(ctx) {
    if (!this.anchor) return;
    if (this.anchor.present) {
      const edgelen = this.anchor.allCorners.map((v, i, arr) => vecMag(vecSub(v, arr[(i + 1) % arr.length])));
      const peri = edgelen.reduce((acc, v) => (acc + v));
      const pxpermm = peri / (this.markerSize*4);
      this.calBoundingBox(50, pxpermm);

      calDistortionMatrices(
        this.anchor.allCorners[0], this.anchor.allCorners[1], this.anchor.allCorners[2], this.anchor.allCorners[3],
        this.markerCorners[0], this.markerCorners[1], this.markerCorners[2], this.markerCorners[3]
      );

      ctx.strokeStyle = 'rgba(255, 255, 255, 1.0)';

      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.angle);

      ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.w, this.boundingBox.h);
      ctx.fillStyle = "rgba(100, 100, 100, 0.7)";
      ctx.fillRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.w, this.boundingBox.h);

      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(' '+this.name, this.boundingBox.x, this.boundingBox.y);
      
      ctx.font = '20px sans-serif';
      ctx.textBaseline = 'center';
      ctx.textAlign = 'center';
      ctx.fillText('\u2693', 0, 0);

      ctx.restore();
      this.inputs.forEach((i) => {
        // If an input is generic, this will be undefined since there is no class
        if (i) i.display(this, ctx, pxpermm, 20*pxpermm);
      });
    }
  }
}

export default InputGroup;
