import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
//GUI
const gui = new dat.GUI();

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Listen to resize
window.addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);
scene.add(camera);

//Object
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.45;
material.roughness = 0.65;

gui.add(material, "metalness").min(0).max(1).step(0.01);
gui.add(material, "roughness").min(0).max(1).step(0.01);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material);
scene.add(sphere);

// Add light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5); // Point light
pointLight.position.set(2, 2, -1);
scene.add(pointLight);

// Light GUI
const lightFolder = gui.addFolder("Lights");
lightFolder
  .add(ambientLight, "intensity")
  .min(0)
  .max(2)
  .step(0.01)
  .name("Ambient");
lightFolder
  .add(pointLight, "intensity")
  .min(0)
  .max(2)
  .step(0.01)
  .name("Point Intensity");
lightFolder
  .add(pointLight.position, "x")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("Point Light X");
lightFolder
  .add(pointLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("Point Light Y");
lightFolder
  .add(pointLight.position, "z")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("Point Light Z");
// Add GUI controls for point light size
lightFolder
  .add(pointLight, "distance")
  .min(0)
  .max(50)
  .step(0.1)
  .name("Point Distance");
lightFolder
  .add(pointLight, "decay")
  .min(0)
  .max(5)
  .step(0.1)
  .name("Point Decay");
//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; //smooth interaction

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update obj
  sphere.rotation.x = Math.PI * elapsedTime * 0.1;

  const radius = 3; // Radius of the circular motion
  pointLight.position.x = radius * Math.cos(elapsedTime);
  pointLight.position.z = radius * Math.sin(elapsedTime);
  pointLight.decay = Math.sin(elapsedTime)
  //Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  //Next frame
  window.requestAnimationFrame(tick);
};

//Run tick
tick();
