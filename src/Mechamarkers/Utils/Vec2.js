export function vecAdd(vec1, vec2) {
  return {x:vec1.x + vec2.x, y:vec1.y + vec2.y};
}

// vector vec1 ---> vec2
export function vecSub(vec1, vec2) {
  return {x:-vec1.x + vec2.x, y:-vec1.y + vec2.y};
}

export function vecScale(vec, scale) {
  return {x:vec.x*scale, y:vec.y*scale};
}

export function vecDot(vec1, vec2) {
  return vec1.x*vec2.x + vec1.y*vec2.y;
}

export function vecMag(vec) {
  return Math.pow(Math.pow(vec.x, 2) + Math.pow(vec.y, 2), 0.5);
}

export function vecMag2(vec) {
  return Math.pow(vec.x, 2) + Math.pow(vec.y, 2);
}

export function vecUnit(vec) {
  var m = vecMag(vec);
  return {
    x: vec.x/m,
    y: vec.y/m,
  };
}

export function vecRot90(vec) {
  return {x:vec.y, y:-vec.x}
}

export function vecRot(vec, angle) {
  var x = vec.x * Math.cos(angle) - vec.y * Math.sin(angle);
  var y = vec.x * Math.sin(angle) + vec.y * Math.cos(angle);
  return {x:x, y:y};
}

export function vecAngleBetween(vec1, vec2) {
  // return Math.atan2(vec1.y, vec1.x) - Math.atan2(vec2.y, vec2.x);
  return Math.atan2(vec1.x*vec2.y-vec1.y*vec2.x, vec1.x*vec2.x+vec1.y*vec2.y);
}

export function vecEMA(vec1, vec2, weight) {
  return {
    x: (vec1.x*(1-weight) + vec2.x*weight), 
    y: (vec1.y*(1-weight) + vec2.y*weight) 
  };
}

// Line closest point
// p0 is point of interest, p1: start of line, p2: end of line
export function lineCP(p2, p0, p1) {
  var p10 = {x: p0.x-p1.x, y: p0.y-p1.y};
  var p12 = {x: p2.x-p1.x, y: p2.y-p1.y};
  var t = vecDot(p12, p10) / vecDot(p12, p12);
  var CPx = p1.x + t*p12.x;
  var CPy = p1.y + t*p12.y;

  return {x: CPx, y: CPy, t: t};
}
