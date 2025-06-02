import  * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from 'lil-gui';


//debug
const gui = new GUI();

//canvas
 const canvas = document.querySelector('.webgl');



 //scene
 const scene = new THREE.Scene();

 // sizes
 const sizes = {
   width: window.innerWidth /3,
   height: window.innerHeight /1.5
 
 }
 console.log(sizes)

//Camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set( 10, 10, 30)
scene.add(camera);

camera.lookAt(scene.position);
//AxisHelper
const axisHelper = new THREE.AxesHelper( 5 );
// scene.add ( axisHelper );

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);


const gltfLoader = new GLTFLoader();


//light
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 5.8)

 directionalLight.position.set(-0.80, 5.77, 0);
 scene.add(directionalLight)

 const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5.8)

 directionalLight2.position.set(10, -10, 5.3);
 scene.add(directionalLight2)
  gui .add(directionalLight2, 'intensity').min(0).max(10).step(0.1)
  gui .add(directionalLight2.position, 'x').min(-10).max(10).step(0.1)
   gui .add(directionalLight2.position, 'y').min(-10).max(10).step(0.1)
    gui .add(directionalLight2.position, 'z').min(-10).max(10).step(0.1)

let model;
//Model
gltfLoader.load("./green.glb", (gltf) => {
   model = gltf.scene;
    model.scale.set(1.2, 1.2, 1.2);
     model.position.set(-0.80, 2.77, 0);
     

   console .log(gltf);
  scene.add(model);
});
let model2;
gltfLoader.load("./sword.glb", (gltf) => {
   model2 = gltf.scene;
    model2.scale.set(7.2, 7.2, 7.2);
     model2.position.set(0.2, -3.77, 0);
    model2.rotation.set(2.34, 2.4, 0);
   console .log(gltf);
  scene.add(model2);

gui.add(model2 .rotation, 'x').min (0).max(Math.PI * 2).step(0.01).name('rotationX');
gui.add(model2 .rotation, 'y').min (0).max(Math.PI * 2).step(0.01).name('rotationY');

});



const clock = new THREE.Clock();

//Animate
const tick = () =>{

  if(model){
    model.rotation.y += 0.01;
    const py = model.position.y;
     model.position.y = py + Math.sin(clock.getElapsedTime()) * 0.01;
  }
  if(model2){
     directionalLight2 .position.y = Math.sin(clock.getElapsedTime()+1) *5;
  }

  // Render
  renderer.render(scene, camera);
   window.requestAnimationFrame(tick);
}
tick();