import * as Vec2 from './Utils/Vec2';

const MARKER_COUNT = 100;
const MARKER_TIMEOUT = 300;
const CENTER_SMOOTH_THRESHOLD = 1;
const CORNER_SMOOTH_THRESHOLD = 3;
const SMOOTH_HEAVY = 0.2; // 0-1, lower the value to get more smoothing
const SMOOTH_LIGHT = 0.75;

let ctx; // lazy fix

class Marker {
    constructor(id) {
      this.id = id;
      this.inuse = false;
      this.present = false;
      this.timestamp = 0;
      this.timeout = MARKER_TIMEOUT;
      this.center = {x:0, y:0};
      this.corner = {x:0, y:0};
      this.allCorners = [{ x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }];
      this.centerSmoothThreshold = 1;
      this.cornerSmoothThreshold = 3;
      this.shouldFill = false;
      this.type = ''; // ANCHOR or ACTOR
      this.groupID = -1; // -1 is unset
      this.inputID = -1; // Only set for actor type marker
    }

    update(marker, timenow) {
        if (this.present) {
            const centerDelta = Vec2.vecMag(Vec2.vecSub(this.center, marker.center));
            const cornerDelta = Vec2.vecMag(Vec2.vecSub(this.corner, marker.corner));
            const centerSmooth = centerDelta > this.centerSmoothThreshold ? SMOOTH_LIGHT : SMOOTH_HEAVY;
            const cornerSmooth = cornerDelta > this.cornerSmoothThreshold ? SMOOTH_LIGHT : SMOOTH_HEAVY;
            this.timestamp = timenow;
            this.center = Vec2.vecEMA(this.center, marker.center, centerSmooth);
            this.corner = Vec2.vecEMA(this.corner, marker.corner, cornerSmooth);

            this.allCorners.forEach((c, i) => {
              const cDelta = Vec2.vecMag(Vec2.vecSub(c, marker.allCorners[i]));
              const cSmooth = cDelta > this.cornerSmoothThreshold ? SMOOTH_LIGHT : SMOOTH_HEAVY;
              const newC = Vec2.vecEMA(c, marker.allCorners[i], cSmooth);
              c.x = newC.x;
              c.y = newC.y;
            });
        } else {
            this.present = true;
            this.timestamp = timenow;
            this.center = marker.center;
            this.corner = marker.corner;
            this.allCorners = marker.allCorners;
        }
    }

    checkPresence(timenow) {
        this.present = (timenow - this.timestamp) > this.timeout ? false : true;
    }

    display(size) {
        if (this.present) {
            // ctx is global
            ctx.beginPath();
            ctx.moveTo(Math.round(this.allCorners[0].x), Math.round(this.allCorners[0].y));
            ctx.lineTo(Math.round(this.allCorners[1].x), Math.round(this.allCorners[1].y));
            ctx.lineTo(Math.round(this.allCorners[2].x), Math.round(this.allCorners[2].y));
            ctx.lineTo(Math.round(this.allCorners[3].x), Math.round(this.allCorners[3].y));
            ctx.lineTo(Math.round(this.allCorners[0].x), Math.round(this.allCorners[0].y));

            ctx.fillStyle = '#ffffff';
            if (this.inuse) ctx.fillStyle = '#ff0000';

            if (this.shouldFill) ctx.fill();

            ctx.fillStyle = '#0000aa';
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(Math.round(this.allCorners[0].x), Math.round(this.allCorners[0].y), 2, 2, 0, 0, Math.PI*2, false);
            ctx.fill();

            // const textPos = vecAdd(posCen, vecScale(vecCenCor0, size/2*1.5));
            // ctx.fillText(this.id, textPos.x, textPos.y);
        }
    }
}

export function initMarkers(drawContext) {
    ctx = drawContext;
    const markerData = [];
    for (let i=0; i<MARKER_COUNT; i++) {
        markerData.push(new Marker(i));
    }
    return markerData;
}