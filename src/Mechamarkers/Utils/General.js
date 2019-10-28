export function calEMA(newVal, oldVal, EMA) {
  return ((newVal * EMA) + (oldVal * (1 - EMA)));
}

// Corner stuff
export const sumPoints = (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y });
export const avgCorners = (corners) => {
  const total = corners.reduce(sumPoints, { x: 0, y: 0 });

  return {
    x: total.x / corners.length,
    y: total.y / corners.length,
  };
};
