import { matrix, lusolve, subset, index, inv, multiply } from 'mathjs';

// q1-4 corner positions of the quadrilateral, r1-4 corner positions of the rectangle (marker in our case)
export function calDistortionMatrices(q1, q2, q3, q4, r1, r2, r3, r4) {
  const matrixA = matrix(
    [
      [ r1.x, r1.y, 1., 0., 0., 0., (-q1.x)*r1.x, (-q1.x)*r1.y ],
      [ 0., 0., 0., r1.x, r1.y, 1., (-q1.y)*r1.x, (-q1.y)*r1.y ],
      [ r2.x, r2.y, 1., 0., 0., 0., (-q2.x)*r2.x, (-q2.x)*r2.y ],
      [ 0., 0., 0., r2.x, r2.y, 1., (-q2.y)*r2.x, (-q2.y)*r2.y ],
      [ r3.x, r3.y, 1., 0., 0., 0., (-q3.x)*r3.x, (-q3.x)*r3.y ],
      [ 0., 0., 0., r3.x, r3.y, 1., (-q3.y)*r3.x, (-q3.y)*r3.y ],
      [ r4.x, r4.y, 1., 0., 0., 0., (-q4.x)*r4.x, (-q4.x)*r4.y ],
      [ 0., 0., 0., r4.x, r4.y, 1., (-q4.y)*r4.x, (-q4.y)*r4.y ]
    ]
  );
  
  const matrixB = matrix(
    [
      [ q1.x ],
      [ q1.y ],
      [ q2.x ],
      [ q2.y ],
      [ q3.x ],
      [ q3.y ],
      [ q4.x ],
      [ q4.y ]
    ]  
  );

  const s = lusolve(matrixA, matrixB);

  return matrix(
    [
      [ subset(s, index(0, 0)), subset(s, index(1, 0)), subset(s, index(2, 0)) ],
      [ subset(s, index(3, 0)), subset(s, index(4, 0)), subset(s, index(5, 0)) ],
      [ subset(s, index(6, 0)), subset(s, index(7, 0)), 1. ]
    ]
  );
}

// transformation of v using matrix m
// v = 2D vector of the format {x:X, y:Y}
export function matrixTransform(m, v) {
  const matrixV = matrix([
    [v.x],
    [v.y],
    [1.]
  ]);

  const result = multiply(m, matrixV);

  return {
    x: subset(result, index(0, 0)) / subset(result, index(2, 0)),
    y: subset(result, index(1, 0)) / subset(result, index(2, 0))
  };
}
