// TRIANGLE COLLISION
export function pointInTri(pt, t0, t1, t2) {
  const area = 0.5 * (-t1.y * t2.x + t0.y * (-t1.x + t2.x) + t0.x * (t1.y - t2.y) + t1.x * t2.y);
  // Need this bc this formula needs to know winding order of triangle verts
  const sign = area > 0 ? 1 : -1;

  const s = (t0.y * t2.x - t0.x * t2.y + (t2.y - t0.y) * pt.x + (t0.x - t2.x) * pt.y) * sign;
  const t = (t0.x * t1.y - t0.y * t1.x + (t0.y - t1.y) * pt.x + (t1.x - t0.x) * pt.y) * sign;
    
  return s > 0 && t > 0 && ((s + t) < 2 * area * sign);
}

// RECT COLLISION
export function pointInRect(pt, rect) {
  if (pointInTri(pt, rect[0], rect[1], rect[2])) return true;
  else if (pointInTri(pt, rect[0], rect[2], rect[3])) return true;

  return false;
}
