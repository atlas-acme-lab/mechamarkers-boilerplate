import { calEMA } from '../Utils/General';
import { vecSub, vecMag, vecRot, vecScale, vecEMA, lineCP, vecUnit } from '../Utils/Vec2';

const xaxis = {x:1, y:0};
const yaxis = {x:0, y:1};

class Toggle {
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
    }
  }

  update(parent) {
    if(!this.actor) return;
    const v = this.actor.present ? 1 : 0;
    this.val = calEMA(v, this.val, 0.5);
  }

  display(parent, ctx, pxpermm, w) {
    if(!this.actor) return;
    const screenpos = vecRot(vecScale(xaxis, this.relativePosition.distance*pxpermm), this.relativePosition.angle - parent.cornerAngleInput);

    ctx.save();

    ctx.translate(parent.pos.x, parent.pos.y);
    ctx.rotate(parent.angle);
    ctx.translate(screenpos.x, screenpos.y);

    ctx.strokeRect(-w/2, -w/2, w, w);
    
    if (this.val > 0.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
      ctx.fillRect(-w/2+3, -w/2+3, w-6, w-6);
    }
    
    ctx.restore();
  }
}

export default Toggle;
