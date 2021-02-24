import * as THREE from './three/build/three.module.js';
import { STLLoader } from "https://threejs.org/examples/jsm/loaders/STLLoader.js";;

function main() {
  const canvas = document.querySelector('#mainCanvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 200;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-100, 2, 4);
    scene.add(light);
  }

  

  var loader = new STLLoader();

  var wheel = new THREE.Mesh();

  loader.load( 'resources/wheel.stl', function ( geometry ) {

                var material = new THREE.MeshBasicMaterial( {color: "yellow"} );

                wheel = new THREE.Mesh( geometry, material );
                
                wheel.scale.x = 0.01;
                wheel.scale.y = 0.01;
                wheel.scale.z = 0.01;

                wheel.position.x = 0;
                wheel.position.y = 0;
                wheel.position.z = 0;


                scene.add( wheel );

            }, 
            function ( parameter )
            {
              console.log(parameter);
            },
            function ( parameter )
            {
              console.log(parameter);
            }
            
            );


  function render(time) {
    time *= 0.001;  // convert time to seconds

    //wheel.rotation.x = time;
    //wheel.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();
