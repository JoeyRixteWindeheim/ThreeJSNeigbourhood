import * as THREE from './three/three.js';
/*
// Select canvas element from HTML.
const canvas = document.querySelector('#mainCanvas');

// Create renderer
const renderer = new THREE.WebGLRenderer({canvas});

// Create scene
var scene = new THREE.Scene();

// Create camera
var camera = new THREE.PerspectiveCamera(
    90,     // fov - Camera frustum vertical field of view.
    // aspect - Camera frustum aspect ratio, but without stretching to fit the screen
    window.innerWidth / window.innerHeight,

    0.1,   // near - Camera frustum near plane
    1000); // far - Camera frustum far plane


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 2;


function makeCube(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
}

function main() {
    // requests continous render
    // "request to render something"
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const staticBridgePart = new THREE.BoxGeometry(20, 1, 60);
    const openableBridgePart = new THREE.BoxGeometry(20, 1, 15);

    const staticBridgeComponents = [
        makeCube(staticBridgePart, 0x44aa88, 0),
        makeCube(staticBridgePart, 0x44aa88, 90),
        makeCube(staticBridgePart, 0x44aa88, 150),
    ];

    const openableBridgeParts = [
        makeCube(openableBridgePart, 0xaa4488, 60),
        makeCube(openableBridgeP)
    ]

    // Also prevents the canvas from stretching the
    function updateCanvasToFitScreen() {
        // Canvas instead of window width and height to prevent stretching the image. This preserves aspect ratio!
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // keeps rendering on a constant basis
    // "time" is a three.js auto-managed variable
    function render(time) {
        // convert to seconds
        time *= 0.001;
        // rotation is in radiants

        updateCanvasToFitScreen();

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


}



function DoCameraMovement(){

}

main();
*/



function main() {
    const canvas = document.querySelector('#mainCanvas');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);


    canvas.parentElement.addEventListener('keydown', onKeypress);

    var open = true;
    var bridgeY = 0;

    function onKeypress(e) {
        if(e.code == "KeyO") //o
        {
            open = true;
            //open
        }
        if(e.code == "KeyC") //c
        {
            open = false;
            //close
        }

    }
  
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 20;
    camera.position.y = 5;
    
  
    const scene = new THREE.Scene();
  
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }
  
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const box = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);


    const brugdekGeo =  new THREE.BoxGeometry(15, 1, 10);
  
    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});
  
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
  
      cube.position.x = x;
  
      return cube;
    }
    
    const cubes = [
      //makeInstance(brugdekGeo, 0xffffff,  0),
      //makeInstance(box, 0x8844aa, -2),
      //makeInstance(box, 0xaa8844,  2),
    ];

    const brugdekMidden = makeInstance(brugdekGeo, 0xffffff,  0)

    const brugdekLinks = makeInstance(brugdekGeo, 0xffffff,  0)
    brugdekLinks.position.x = -15;

    const brugdekRechts = makeInstance(brugdekGeo, 0xffffff,  0)
    brugdekRechts.position.x = 15;

    var timeLastUpdate = 0;
  
    function render(time) {
      time *= 0.001;  // convert time to seconds
      const timepassed = time - timeLastUpdate;
      timeLastUpdate = time;

    

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;


        cube.position.y = Math.sin(time);
      });

      if(open == true && bridgeY < 5)
      {
        bridgeY += timepassed;
        if(bridgeY > 5){
            bridgeY = 5;
        }
        brugdekMidden.position.y = bridgeY;
      }
      if(open == false && bridgeY > 0)
      {
        bridgeY -= timepassed;
        if(bridgeY < 0){
            bridgeY = 0;
        }
        brugdekMidden.position.y = bridgeY;
      }
  
      renderer.render(scene, camera);
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  
  }
  
  main();