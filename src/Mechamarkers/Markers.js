import * as Vec2 from './Utils/Vec2';

const MARKER_COUNT = 100;
const MARKER_TIMEOUT = 300;
const CENTER_SMOOTH_THRESHOLD = 1;
const CORNER_SMOOTH_THRESHOLD = 3;
const SMOOTH_HEAVY = 0.2; // 0-1, lower the value to get more smoothing
const SMOOTH_LIGHT = 0.75;

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
      this.edgeLengths = [0, 0, 0, 0];
      this.averageEdgeLength = 0;
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
        
      // Update edges
      let edgeTotal = 0;
      this.allCorners.forEach((c, i) => {
        let l = 0;

        if (i < this.allCorners.length - 1) l = vecDist(c, this.allCorners[i + 1]);
        else l = vecDist(c, this.allCorners[0]); // last edge goes from 3 -> 0

        this.edgeLengths[i] = l;
        edgeTotal += l;
      });
      this.averageEdgeLength = edgeTotal / 4;
    }

    checkPresence(timenow) {
        this.present = (timenow - this.timestamp) > this.timeout ? false : true;
    }
}

export function initMarkers() {
    const markerData = [];
    for (let i=0; i<MARKER_COUNT; i++) {
        markerData.push(new Marker(i));
    }
    return markerData;
}
