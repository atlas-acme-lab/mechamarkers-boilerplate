import { calEMA } from '../Utils/General';
import { vecSub, vecRot, vecScale, vecAngleBetween } from '../Utils/Vec2';
import { matrixTransform } from '../Utils/Distortion';

const xaxis = {x:1, y:0};

class Knob {
  constructor(markerData, inputData) {
    this.name = inputData.name;
    this.type = inputData.type;
    if (inputData.actorID !== '') {
      this.actor = markerData[inputData.actorID];
      this.actor.timeout = inputData.detectWindow;
      this.actor.inuse = true;
    }
    this.val = 0;
    this.relativePosition = {
      distance: inputData.relativePosition.distance,
      angle: inputData.relativePosition.angle,
    };
  }

  update(parent) {
    if(!this.actor) return;
    if (this.actor.present) {
      const quad2Rect = v => matrixTransform(parent.matrixQuad2Rect, v);
      const anchorVec = vecSub(quad2Rect(parent.anchor.center), quad2Rect(parent.anchor.corner));
      const actorVec = vecSub(quad2Rect(this.actor.center), quad2Rect(this.actor.corner));
      const angleBetween = -vecAngleBetween(anchorVec, actorVec);
      this.val = calEMA(angleBetween, this.val, 1.0);
    }
  }
}

export default Knob;
