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










    const brugdekGeo = new THREE.BoxGeometry(30, 2, 20);
    const RoadRailingGlass = new THREE.BoxGeometry(30, 2, 0.1);
    const RoadRailingTop = new THREE.CylinderGeometry(0.1, 0.1, 30, 10);
    //const sidewalk = new THREE.BoxGeometry(30, 0.2, 2);
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

    const sidewalk = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const BetonMain = new THREE.BoxGeometry(3, 4, 24);

    const BetonFront = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    
    class BetonPilaar{
        constructor(x) {
            this.main = makeInstance(BetonMain, 0xffffff, x, -5, 0);
            this.ZO = makeInstance(BetonFront, 0xffffff, x, -3, 12);
            this.ZO.scale.x = 3/4;
            this.ZO.scale.y = 3/4;
            this.ZO.scale.z = 2;
            this.ZO.rotateX(Math.PI/2);
            this.ZW = makeInstance(BetonFront, 0xffffff, x, -3, 12);
            this.ZW.scale.x = 3/4;
            this.ZW.scale.y = 3/4;
            this.ZW.scale.z = 2;
            this.ZW.rotateY(-Math.PI/2);
            this.ZW.rotateX(Math.PI/2);

            this.NO = makeInstance(BetonFront, 0xffffff, x, -7, -12);
            this.NO.scale.x = 3/4;
            this.NO.scale.y = 3/4;
            this.NO.scale.z = 2;
            this.NO.rotateX(-Math.PI/2);
            this.NW = makeInstance(BetonFront, 0xffffff, x, -7, -12);
            this.NW.scale.x = 3/4;
            this.NW.scale.y = 3/4;
            this.NW.scale.z = 2;
            this.NW.rotateY(Math.PI/2);
            this.NW.rotateX(-Math.PI/2);
        }

    }

    class BrugdekOnderdeel {


        constructor(x, y, z) {
            const sidewalkMaterial = this.makeSidewalkMaterial();
            const roadMaterial = this.makeRoadMaterial();
            this.road = makeInstanceWithTexture(brugdekGeo, roadMaterial, x, y-0.5, z);
			this.roadRailingLeft = makeInstance(RoadRailingGlass, 0xffffff, x, y + 1.5, z - 9.9);
            this.roadRailingRight = makeInstance(RoadRailingGlass, 0xffffff, x, y + 1.5, z + 9.9);
            this.sidewalkRight = makeInstanceWithTexture(sidewalk, sidewalkMaterial,  x -15, y - 0.5, z + 10);
			this.sidewalkRight.scale.y = 0.5;
            this.sidewalkRight.scale.z = 15;
            this.sidewalkRight.rotateY(-(Math.PI/2));
            this.sidewalkRight.rotateX(Math.PI);
			
            this.sidewalkLeft = makeInstanceWithTexture(sidewalk, sidewalkMaterial, x+15, y - 0.5, z - 10);
			this.sidewalkLeft.scale.y = 0.5;
            this.sidewalkLeft.scale.z = 15;
            this.sidewalkLeft.rotateY(Math.PI/2);
            this.sidewalkLeft.rotateX(Math.PI);

            this.sidwalkRailingLeft = makeInstance(sidewalkRailer, 0xffffff, x, y, z - 12);
            this.sidwalkRailingRight = makeInstance(sidewalkRailer, 0xffffff, x, y, z + 12);
            this.RailingTopLeft = makeInstance(RoadRailingTop, 0xffffff, x, y + 2.5, z - 9.9);
            this.RailingTopLeft.rotateY(Math.PI /2);
            this.RailingTopLeft.rotateX(Math.PI /2);
            this.RailingTopRight = makeInstance(RoadRailingTop, 0xffffff, x, y + 2.5, z + 9.9);
            this.RailingTopRight.rotateY(Math.PI /2);
            this.RailingTopRight.rotateX(Math.PI /2);
        }

        SetY(y) {
            this.road.position.y = y-0.5;
            this.roadRailingLeft.position.y = y + 1.5;
            this.roadRailingRight.position.y = y + 1.5;
            this.sidewalkRight.position.y = y - 0.5;
            this.sidewalkLeft.position.y = y - 0.5;
            this.sidwalkRailingLeft.position.y = y;
            this.sidwalkRailingRight.position.y = y;
            this.RailingTopLeft.position.y = y+2.5;
            this.RailingTopRight.position.y = y+2.5;
        }

        makeSidewalkMaterial() {
            // how often should it repeat?
            const sidewalkWidthRepeat = 1;
            const sidewalkLengthRepeat = sidewalk.parameters.options.amount * 3;

            // load textures
            const sidewalkAO = loader.load('./resources/images/sidewalk/AO.png');
            sidewalkAO.wrapS = THREE.RepeatWrapping;
            sidewalkAO.wrapT = THREE.RepeatWrapping;
            sidewalkAO.repeat.set( sidewalkWidthRepeat, sidewalkLengthRepeat );
            const sidewalkDiffuse = loader.load('./resources/images/sidewalk/Diffuse.png');
            sidewalkDiffuse.wrapS = THREE.RepeatWrapping;
            sidewalkDiffuse.wrapT = THREE.RepeatWrapping;
            sidewalkDiffuse.repeat.set( sidewalkWidthRepeat, sidewalkLengthRepeat );
            const sidewalkNormal = loader.load('./resources/images/sidewalk/Normal.png');
            sidewalkNormal.wrapS = THREE.RepeatWrapping;
            sidewalkNormal.wrapT = THREE.RepeatWrapping;
            sidewalkNormal.repeat.set( sidewalkWidthRepeat, sidewalkLengthRepeat );

            // only change the top of the mesh
            // const sidewalkMaterials = [
            //
            //     new THREE.MeshStandardMaterial({ color: 0xffffff }),
            //     new THREE.MeshStandardMaterial({ color: 0xffffff }),
            //     new THREE.MeshStandardMaterial(
            //         {
            //             aoMap: sidewalkAO,
            //             normalMap: sidewalkNormal,
            //             map: sidewalkDiffuse
            //         }),
            //     new THREE.MeshStandardMaterial({ color: 0xffffff }),
            //     new THREE.MeshStandardMaterial({ color: 0xffffff }),
            //     new THREE.MeshStandardMaterial({ color: 0xffffff }),
            //     new THREE.MeshStandardMaterial({ color: 0xffffff })
            //
            // ];
            const sidewalkMaterials = [
                new THREE.MeshStandardMaterial({ color: 0xffffff }),
                new THREE.MeshStandardMaterial(
                    {
                        aoMap: sidewalkAO,
                        normalMap: sidewalkNormal,
                        map: sidewalkDiffuse
                    }),

                new THREE.MeshStandardMaterial({ color: 0xffffff })

            ];
            return sidewalkMaterials;
        }

        makeRoadMaterial() {
            // how many times does it repeat?
            const roadWidthRepeat = 2;
            const roadLengthRepeat = 2;

            // load all textures needed and repeat them
            const roadAO = loader.load('./resources/images/road/Highway_road_patches_02_2K_AO.png');
            roadAO.wrapS = THREE.RepeatWrapping;
            roadAO.wrapT = THREE.RepeatWrapping;
            roadAO.repeat.set( roadWidthRepeat, roadLengthRepeat );
            const roadDiffuse = loader.load('./resources/images/road/Highway_road_patches_02_2K_Base_Color.png');
            roadDiffuse.wrapS = THREE.RepeatWrapping;
            roadDiffuse.wrapT = THREE.RepeatWrapping;
            roadDiffuse.repeat.set( roadWidthRepeat, roadLengthRepeat );
            const roadNormal = loader.load('./resources/images/road/Highway_road_patches_02_2K_Normal.png');
            roadNormal.wrapS = THREE.RepeatWrapping;
            roadNormal.wrapT = THREE.RepeatWrapping;
            roadNormal.repeat.set( roadWidthRepeat, roadLengthRepeat );
            const roadMaterials = [

                new THREE.MeshStandardMaterial({ color: 0xffffff }),
                new THREE.MeshStandardMaterial({ color: 0xffffff }),
                new THREE.MeshStandardMaterial(
                    {
                        aoMap: roadAO,
                        normalMap: roadNormal,
                        map: roadDiffuse
                    }),
                new THREE.MeshStandardMaterial({ color: 0xffffff }),
                new THREE.MeshStandardMaterial({ color: 0xffffff }),
                new THREE.MeshStandardMaterial({ color: 0xffffff }),
                new THREE.MeshStandardMaterial({ color: 0xffffff })

                ];
            return roadMaterials;
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

            this.gewicht = makeInstance(gewicht, 0xffffff, x + 2 * dir - 1*dir, 0, z -2*dir);
            
            this.gewicht.scale.z = 2;
            if(dir == -1){
                this.gewicht.rotateY(Math.PI);
            }

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
            this.noToren.gewicht.position.y = 8 - y;
            this.nwToren.gewicht.position.y = 8 - y;
            this.zoToren.gewicht.position.y = 8 - y;
            this.zwToren.gewicht.position.y = 8 - y;

            this.noToren.setGewichtKabel(9 - y);
            this.nwToren.setGewichtKabel(9 - y);
            this.zoToren.setGewichtKabel(9 - y);
            this.zwToren.setGewichtKabel(9 - y);

            this.noToren.setDekKabel(y-0.5);
            this.nwToren.setDekKabel(y-0.5);
            this.zoToren.setDekKabel(y-0.5);
            this.zwToren.setDekKabel(y-0.5);
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

    function makeInstanceWithTexture(geometry, material, x, y, z) {
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

    const BetonPilaarLinks = new BetonPilaar(-16);
    const BetonPilaarRechts = new BetonPilaar(16);
    //const gewichten = new Bruggewichten();



    const openDistance = 5;


    const riverGeometry = new THREE.BoxGeometry(210, 1, 400);
    const riverMaterial = new THREE.MeshPhongMaterial( {
                                color: 0x31877d,
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
                            flowDirection: new THREE.Vector2( 0, -1 ),
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


        if (open == true && bridgeY < openDistance) {
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




