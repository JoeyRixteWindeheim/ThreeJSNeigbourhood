import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { Water } from './three/examples/jsm/objects/Water2.js';

function main() {
    const canvas = document.querySelector('#mainCanvas');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 400;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 20;
    camera.position.y = 5;

    canvas.parentElement.addEventListener('keydown', onKeypress);

    // Bridge open/close variables
    var open = true;
    var bridgeY = 0;

    //Player movement
    let playerForwardDirection = 0; // -1 is backward, 1 is forward, 0 is neither
    let playerSidewaysDirection = 0; // -1 is left, 1 is right, 0 is neither
    let playerUpwardsDirection = 0; // -1 is down, 1 is up, 0 is neither
    const playerMovementSpeed = 1;

    // Keypress actions
    function onKeypress(e) {
        /// bridge controls
        // o = open, c = close
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

        /// player movement
        // Prioritise forwards over backwards
        if (e.code == "KeyW") {
            playerForwardDirection = -1;
        }
        else if (e.code == "KeyS") {
            playerForwardDirection = 1;
        }

        // prioritise right over left
        if (e.code == "KeyD") {
            playerSidewaysDirection = 1;
        }
        else if (e.code == "KeyA") {
            playerSidewaysDirection = -1;
        }

        // prioritise up over down
        // prioritise right over left
        if (e.code == "KeyE") {
            playerUpwardsDirection = 1;
        }
        else if (e.code == "KeyQ") {
            playerUpwardsDirection = -1;
        }
    }


    function playerCameraMovement(){

        // forwards/backwards movement
        if (playerForwardDirection === 1) {
            camera.translateZ(playerMovementSpeed)
        }
        else if (playerForwardDirection === -1) {
            camera.translateZ(-1 * playerMovementSpeed);
        }

        // sideways movement
        // to the right
        if (playerSidewaysDirection === 1) {
            camera.translateX(playerMovementSpeed);
        }
        // to the left
        else if (playerSidewaysDirection === -1) {
            camera.translateX(-1 * playerMovementSpeed);
        }

        // upwards/downwards movement
        // upwards, no upper bounds
        if (playerUpwardsDirection === 1) {
            camera.translateY(playerMovementSpeed);
        }
        // downwards
        else if ((playerUpwardsDirection === -1)) {
            camera.translateY(-1 * playerMovementSpeed);
        }

        // fixate camera position to not go through bridge
        if (camera.position.y < 1) {
            camera.position.y = 1;
        }

        playerForwardDirection = 0; // -1 is backward, 1 is forward, 0 is neither
        playerSidewaysDirection = 0; // -1 is left, 1 is right, 0 is neither
        playerUpwardsDirection = 0; // -1 is down, 1 is up, 0 is neither
    }








    const scene = new THREE.Scene();

    // Lights; one hemisphere light to light the entire scene, and one directional light to simulate the sun.
    // Is way prettier than without; also looks more realistic
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      const hemiLight = new THREE.HemisphereLight(color, 0x787878, 0.4);
      light.position.set(-1, 2, 4);
      scene.add(light);
      scene.add(hemiLight);

    // helper for loading external images
    const loader = new THREE.TextureLoader();

    // ///Skybox
    // const skybox = loader.load('./resources/images/skybox.jpg', () => {
    //     const renderTarget = new THREE.WebGLCubeRenderTarget(skybox.image.height);
    //     renderTarget.fromEquirectangularTexture(renderer, skybox);
    //     scene.background = renderTarget;
    // });

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

    const brugdekMidden = makeInstance(brugdekGeo, 0xffffff,  0);

    const brugdekLinks = makeInstance(brugdekGeo, 0xffffff,  0);
    brugdekLinks.position.x = -15;

    const brugdekRechts = makeInstance(brugdekGeo, 0xffffff,  0);
    brugdekRechts.position.x = 15;


    const riverGeometry = new THREE.BoxGeometry(210, 1, 400);
    const riverMaterial = new THREE.MeshPhongMaterial( {
                                color: 0xebd66e,
    } );
    const mainRiver = new THREE.Mesh(riverGeometry, riverMaterial);
    scene.add(mainRiver);
    mainRiver.position.y = -10;
    mainRiver.position.z = 100;


    const riverNormalMap = loader.load('./three/examples/textures/water/Water_1_M_Normal.jpg');
    const riverNormalMap2 = loader.load('./three/examples/textures/water/Water_2_M_Normal.jpg');
    // needs to be plane; any 3d shape won't work
    const waterGeometry = new THREE.PlaneGeometry( 210, 400 );
    const water = new Water(
                        waterGeometry,
                {
                            normalMap0: riverNormalMap,
                            normalMap1: riverNormalMap2,
                            // sunColor: 0xffffff,
                            // waterColor: 0x001e0f,
                            // distortionScale: 3.7,
                            // alpha: 1.0,
                            // fog: scene.fog !== undefined
                    alpha: 1.0,
                    sunDirection: new THREE.Vector3(),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 3.7,
                    fog: scene.fog !== undefined
                        }    );
    scene.add(water);
    // Water is vertical wall. We need it to be flat. Rotate it on the x-axis.
    water.rotation.x = Math.PI * - 0.5;
    water.position.y = -5.6;
    water.position.z = 10;





    var timeLastUpdate = 0;


    // setup for orbital controls
    const controls = new OrbitControls(camera, canvas);

    // Also prevents the canvas from stretching the
    function updateCanvasToFitScreen() {
        // Re-get canvas every time to update width/height
        const canvas = document.querySelector('#mainCanvas');
        // Canvas instead of window width and height to prevent stretching the image. This preserves aspect ratio!
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = (canvas.width !== width) || (canvas.height !== height);
        if (needResize) {
            // set width and height of canvas element
            renderer.setSize(width, height, false);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    }

    function render(time) {
      time *= 0.001;  // convert time to seconds
      const timepassed = time - timeLastUpdate;
      timeLastUpdate = time;

      // Responsive design -- changes according to screen height/width
        updateCanvasToFitScreen();

        // move camera if wasd/qe is pressed
        playerCameraMovement();


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