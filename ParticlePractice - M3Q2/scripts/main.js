//import statements
import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

//setup for the camera, scene, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//setting up the variables
let nameMesh = new THREE.Mesh();
let stars, stars2, starGeo;

//function calls to initialize the scene's contents - each one is defined below
lighting();
text();
particles();
setInterval(changeColor, 3000);   //every three seconds, calls the method that changes the color of the stars to a random one

//star particles
function particles() {
  let points = [];
  for (let i = 0; i < 12000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("/assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  stars2 = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
  scene.add(stars2);
  stars2.position.y = 450;
}

//function for the movement and spawn-loop of star particles, using two resetting pairs that create an illusion of infinity 
function animateParticles() {
  starGeo.verticesNeedUpdate = true;
  stars.position.y -= 0.9;
  stars2.position.y -= 0.9;
  if (stars.position.y < -450) {
    stars.position.y = 550;
  }
  if (stars2.position.y < -450) {
    stars2.position.y = 550;
  }
}

//function to randomly change the color of star particles
function changeColor(){
  stars.material.color.setRGB(Math.random(256), Math.random(256), Math.random(256));
}

//setting the TextGeometry so it displays my first name
function text(){
  const textTexture = new THREE.TextureLoader().load("/assets/textures/wooden.jpg");

  const floader = new FontLoader();
  floader.load("/assets/fonts/droid_sans_bold.typeface.json", function(font){
    const textGeom = new TextGeometry("Justin Kyle", {
      font:font,
      size:4,
      height:1,
    })
    textGeom.center();
    const textMat = new THREE.MeshBasicMaterial({map: textTexture});
    nameMesh = new THREE.Mesh(textGeom, textMat);
    scene.add(nameMesh);
  });
  camera.position.z = 25;
}

//lighting setup
function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

//all about the movement of scene components
function animate() {
  requestAnimationFrame(animate);

  animateParticles(); //indefinitely falling stars

  nameMesh.rotation.x += 0.008;   //rotating name
  nameMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}
animate();