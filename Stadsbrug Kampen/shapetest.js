import * as THREE from './three/three.js';

function main() {
  const canvas = document.querySelector('#mainCanvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 150;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 10;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }


  

  

  var shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, 2 );
  shape.lineTo( 2, 0 );
  shape.lineTo( 0, 0 );

  var extrudeSettings = {
      steps: 2,
      amount: 2,
      bevelEnabled: false,
  };			

  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

  const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
//material.side = THREE.DoubleSide;
  const cube = new THREE.Mesh(geometry, material);
  
  scene.add(cube);

  function render(time) {
    time *= 0.001;  // convert time to seconds

    //cube.rotation.x = time;
    //cube.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();
