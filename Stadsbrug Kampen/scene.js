import * as THREE from './three/three.js';

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
        makeCube(openableBridgePart, 0xaa4488, 60)
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