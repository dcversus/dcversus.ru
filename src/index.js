import './base.css';
import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  Mesh,
} from 'babylonjs';

const mainText = 'Василиса Версус';
const mainFormat = 'color: #f9690e; font-size: 3em';
const additionalText = 'https://dcversus.ru/';

console.clear();
console.log(`%c${mainText}`, mainFormat);
console.log(additionalText);

//

// Get the canvas DOM element
const canvas = document.getElementById('renderCanvas');
// Load the 3D engine
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

// Create a basic BJS Scene object
const scene = new Scene(engine);
// Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
// Target the camera to scene origin
camera.setTarget(Vector3.Zero());
// Attach the camera to the canvas
camera.attachControl(canvas, false);
// Create a basic light, aiming 0, 1, 0 - meaning, to the sky
new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
// Create a built-in "sphere" shape; its constructor takes 6 params:
// name, segment, diameter, scene, updatable, sideOrientation
const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene, false, Mesh.FRONTSIDE);
// Move the sphere upward 1/2 of its height
sphere.position.y = 1;
// Create a built-in "ground" shape; its constructor takes 6 params:
// name, width, height, subdivision, scene, updatable
Mesh.CreateGround('ground1', 6, 6, 2, scene, false);

// run the render loop
engine.runRenderLoop(() => {
  scene.render();
});
// the canvas/window resize event handler
window.addEventListener('resize', () => {
  engine.resize();
});
