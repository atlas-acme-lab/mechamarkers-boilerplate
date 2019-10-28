import Vec2 from './src/Utils/Vec2';
import * as Mechamarkers from './src/Mechamarkers';

let canvas, ctx, prevTime;
const VW = window.innerWidth;
const VH = window.innerHeight;

function update() {
  const currTime = Date.now();
  const dt = (currTime - prevTime) / 1000;
  prevTime = currTime;

  // Mechamarkers stuff
  Mechamarkers.update(currTime);

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  update();
}