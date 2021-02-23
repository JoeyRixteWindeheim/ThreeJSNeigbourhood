import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { Water } from './three/examples/jsm/objects/Water2.js';

function main() {
    const canvas = document.querySelector('#mainCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 400;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 50;
    camera.position.y = 5;

    canvas.parentElement.addEventListener('keydown', onKeypress);

    const scene = new THREE.Scene();

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);



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
        if (e.code == "KeyO") //o
        {
            open = true;
            //open
        }
        if (e.code == "KeyC") //c
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


    function playerCameraMovement() {

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










    const brugdekGeo = new THREE.BoxGeometry(30, 1, 20);
    const RoadRailing = new THREE.BoxGeometry(30, 2, 0.2);
    const sidewalk = new THREE.BoxGeometry(30, 0.2, 2);
    const sidewalkRailer = new THREE.BoxGeometry(30, 1, 0.1);

    const pilaar = new THREE.BoxGeometry(0.4, 15, 0.4);
    const dwarsbalk = new THREE.BoxGeometry(0.4, 0.4, 1.2);

    //const gewicht = new THREE.BoxGeometry(2, 2, 4);

    const wheel = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 10);

    const cabel = new THREE.CylinderGeometry(0.05, 0.05, 1, 6);

    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 2);
    shape.lineTo(2, 0);
    shape.lineTo(0, 0);

    var extrudeSettings = {
        steps: 2,
        amount: 2,
        bevelEnabled: false,
    };

    var prism = new THREE.ExtrudeGeometry(shape, extrudeSettings);


    const gewicht = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    gewicht.scale.x = 2;
    gewicht.scale.y = 2;
    gewicht.scale.z = 6;

    class BrugdekOnderdeel {
        constructor(x, y, z) {
            this.road = makeInstance(brugdekGeo, 0xffffff, x, y, z);
            this.roadRailingLeft = makeInstance(RoadRailing, 0xffffff, x, y + 1.5, z - 10);
            this.roadRailingRight = makeInstance(RoadRailing, 0xffffff, x, y + 1.5, z + 10);
            this.sidewalkRight = makeInstance(sidewalk, 0xffffff, x, y - 0.4, z + 11);
            this.sidewalkLeft = makeInstance(sidewalk, 0xffffff, x, y - 0.4, z - 11);
            this.sidwalkRailingLeft = makeInstance(sidewalkRailer, 0xffffff, x, y, z - 12);
            this.sidwalkRailingRight = makeInstance(sidewalkRailer, 0xffffff, x, y, z + 12);
        }

        SetY(y) {
            this.road.position.y = y;
            this.roadRailingLeft.position.y = y + 1.5;
            this.roadRailingRight.position.y = y + 1.5;
            this.sidewalkRight.position.y = y - 0.4;
            this.sidewalkLeft.position.y = y - 0.4;
            this.sidwalkRailingLeft.position.y = y;
            this.sidwalkRailingRight.position.y = y;
        }
    }

    class Brugtoren {
        constructor(x, y, z, dir) {
            this.NOpilaar = makeInstance(pilaar, 0xffffff, x + 0.8, y + 2.5, z - 0.8);
            this.NWpilaar = makeInstance(pilaar, 0xffffff, x - 0.8, y + 2.5, z - 0.8);
            this.ZOpilaar = makeInstance(pilaar, 0xffffff, x + 0.8, y + 2.5, z + 0.8);
            this.ZWpilaar = makeInstance(pilaar, 0xffffff, x - 0.8, y + 2.5, z + 0.8);

            this.dwarsOnder = new PilaarDwarsBalken(x, 2.7, z);
            this.dwarsMiden = new PilaarDwarsBalken(x, 6.25, z);
            this.dwarsBoven = new PilaarDwarsBalken(x, 9.8, z);

            this.wielen = new BrugTorenWielen(x, 11.2, z)

            this.gewicht = makeInstance(gewicht, 0xffffff, x + 2 * dir - 1, 9 - 1, z -1);

            this.Ngewichtkabel = new kabel(x + 1.1 * dir, 0, z + 0.9)
            this.Zgewichtkabel = new kabel(x + 1.1 * dir, 0, z - 0.9)

            this.Ndekkabel = new kabel(x + -1.1 * dir, 0, z + 0.9)
            this.Zdekkabel = new kabel(x + -1.1 * dir, 0, z - 0.9)

        }

        setGewichtKabel(bottom) {
            this.Ngewichtkabel.setLength(11.2, bottom);
            this.Zgewichtkabel.setLength(11.2, bottom);
        }

        setDekKabel(bottom) {
            this.Ndekkabel.setLength(11.2, bottom);
            this.Zdekkabel.setLength(11.2, bottom);
        }
    }

    class kabel {
        constructor(x, y, z) {
            this.k = makeInstance(cabel, 0x888888, x, y, z)
        }

        setLength(top, bottom) {
            this.k.scale.y = top - bottom;
            this.k.position.y = (top - bottom) / 2 + bottom;
        }

    }

    class PilaarDwarsBalken {
        constructor(x, y, z) {
            this.Nbalk = makeInstance(dwarsbalk, 0xffffff, x, y, z - 0.8);
            this.Nbalk.rotateY(1.5708);
            this.Zbalk = makeInstance(dwarsbalk, 0xffffff, x, y, z + 0.8);
            this.Zbalk.rotateY(1.5708);

            this.Obalk = makeInstance(dwarsbalk, 0xffffff, x + 0.8, y, z);
            this.Wbalk = makeInstance(dwarsbalk, 0xffffff, x - 0.8, y, z);
        }
    }

    class Bruggewichten {
        constructor() {
            this.no = makeInstance(gewicht, 0xffffff, 18, 9, -11);
            this.nw = makeInstance(gewicht, 0xffffff, -18, 9, -11);
            this.zo = makeInstance(gewicht, 0xffffff, 18, 9, 11);
            this.zw = makeInstance(gewicht, 0xffffff, -18, 9, 11);
        }

        SetY(y) {
            this.no.position.y = y;
            this.nw.position.y = y;
            this.zo.position.y = y;
            this.zw.position.y = y;
        }
    }

    class BrugTorenWielen {
        constructor(x, y, z) {
            this.links = makeInstance(wheel, 0xffff00, x, 11.2, z - 0.9);
            this.rechts = makeInstance(wheel, 0xffff00, x, 11.2, z + 0.9);
            this.links.rotateX(1.5708);
            this.rechts.rotateX(1.5708);

        }

        Rotate(time) {
            this.links.rotateY(time);
            this.rechts.rotateY(time)
        }
    }

    class Torens {
        constructor() {
            this.noToren = new Brugtoren(16, 0, -11, 1);
            this.nwToren = new Brugtoren(-16, 0, -11, -1);
            this.zoToren = new Brugtoren(16, 0, 11, 1);
            this.zwToren = new Brugtoren(-16, 0, 11, -1);
        }

        moveWeights(y) {
            this.noToren.gewicht.position.y = 9 - y;
            this.nwToren.gewicht.position.y = 9 - y;
            this.zoToren.gewicht.position.y = 9 - y;
            this.zwToren.gewicht.position.y = 9 - y;

            this.noToren.setGewichtKabel(9 - y);
            this.nwToren.setGewichtKabel(9 - y);
            this.zoToren.setGewichtKabel(9 - y);
            this.zwToren.setGewichtKabel(9 - y);

            this.noToren.setDekKabel(y);
            this.nwToren.setDekKabel(y);
            this.zoToren.setDekKabel(y);
            this.zwToren.setDekKabel(y);
        }

        moveWheels(time) {
            this.noToren.wielen.Rotate(time);
            this.nwToren.wielen.Rotate(-time);
            this.zoToren.wielen.Rotate(time);
            this.zwToren.wielen.Rotate(-time);
        }
    }


    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const box = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);



    function makeInstance(geometry, color, x, y, z) {
        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;

        return cube;
    }


    const brugdekMidden = new BrugdekOnderdeel(0, 0, 0);
    const brugdekLinks = new BrugdekOnderdeel(-30, 0, 0);
    const brugdekRechts = new BrugdekOnderdeel(30, 0, 0);

    const torens = new Torens();


    //const gewichten = new Bruggewichten();



    const openDistance = 5;


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


        if (open == true && bridgeY < 5) {
            bridgeY += timepassed;
            if (bridgeY > openDistance) {
                bridgeY = openDistance;
            }
            brugdekMidden.SetY(bridgeY);
            torens.moveWeights(bridgeY);
            torens.moveWheels(-timepassed);
        }
        if (open == false && bridgeY > 0) {
            bridgeY -= timepassed;
            if (bridgeY < 0) {
                bridgeY = 0;
            }
            brugdekMidden.SetY(bridgeY);
            torens.moveWeights(bridgeY);
            torens.moveWheels(timepassed);
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


}
main();




