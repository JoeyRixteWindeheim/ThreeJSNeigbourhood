import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { Water } from './three/examples/jsm/objects/Water2.js';
import { KMZLoader } from './three/examples/jsm/loaders/KMZLoader.js';
import { STLLoader } from "https://threejs.org/examples/jsm/loaders/STLLoader.js";
import { GUI } from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js';


function main() {
    const canvas = document.querySelector('#mainCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 400;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 50;
    camera.position.y = 5;

    canvas.parentElement.addEventListener('keydown', onKeypress);

    const scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xFFFFFF, 150, 200);

    const stlloader = new STLLoader();




    // Bridge open/close variables
    var bridgeY = 0;

    const gui = new GUI();
    var params = {
        open: false
    };

    gui.add(params, "open").name("brug open");
    gui.open();

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
            params["open"] = true;
            //open
        }
        if (e.code == "KeyC") //c
        {
            params["open"] = false;
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
      light.position.set(-150, 75, 100);
      light.target.position.set(-4, 0, -4);
      light.castShadow = true;

      //makes it so shadows are rendered throughout the entire map
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 500;
      light.shadow.camera.top = 100;
      light.shadow.camera.bottom = -100;
      light.shadow.camera.left = 100;
      light.shadow.camera.right = -100;

      // prevents objects from casting shadow upon self
      light.shadow.bias = -0.01;

      // makes for prettier shadows but decreases performance
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;


      scene.add(light);
      scene.add(hemiLight);



    // helper for loading external images
    const loader = new THREE.TextureLoader();

    // loader for external KMZ models
    const kmzLoader = new KMZLoader();

    /// == This loads the model in 4 different times. This is bad and inefficient.. A better way would be to clone the scene
    // which kmzLoader creates, but as far as I know, it's not possible to do this.

    kmzLoader.load( './resources/models/houses.kmz', function ( kmz ) {

        //kmz.scene.position.y = 0.5;
        kmz.scene.rotation.z = 0.5;
        kmz.scene.position.x = 90;
        kmz.scene.position.z = 60;
        scene.add( kmz.scene );

        render();

    } );

    kmzLoader.load( './resources/models/houses.kmz', function ( kmz ) {

        //kmz.scene.position.y = 0.5;
        kmz.scene.rotation.z = 0.5;
        kmz.scene.position.x = 90;
        kmz.scene.position.z = -30;
        scene.add( kmz.scene );



        render();

    } );

    kmzLoader.load( './resources/models/houses.kmz', function ( kmz ) {

        //kmz.scene.position.y = 0.5;
        kmz.scene.rotation.z = 3.65;
        kmz.scene.position.x = -90;
        kmz.scene.position.z = 40;
        scene.add( kmz.scene );

        render();

    } );

    kmzLoader.load( './resources/models/houses.kmz', function ( kmz ) {

        //kmz.scene.position.y = 0.5;
        kmz.scene.rotation.z = 3.65;
        kmz.scene.position.x = -90;
        kmz.scene.position.z = -50;
        scene.add( kmz.scene );

        render();

    } );


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

    const kade = new THREE.BoxGeometry(30, 10, 284);

    const pilaar = new THREE.BoxGeometry(0.4, 15, 0.4);
    const dwarsbalk = new THREE.BoxGeometry(0.4, 0.4, 1.2);
    const PyramideTop = new THREE.ConeGeometry( 1.41421356237, 1.5, 4 );
    const CubusTop = new THREE.BoxGeometry(0.8, 2, 0.8);
    //const gewicht = new THREE.BoxGeometry(2, 2, 4);

    //const wheel = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 10);

    let wheel = new THREE.BufferGeometry();
    stlloader.load( 'resources/wheel.stl', function ( geometry ) {

        torens.setWheels(geometry);
    });

    const axel = new THREE.CylinderGeometry(0.2, 0.2, 2.1, 10);

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

    function makeConcreteMaterial() {
        // how many times does it repeat?
        const concreteWidthRepeat = 2;
        const concreteLengthRepeat = 2;

        // load all textures needed and repeat them
        const concreteAO = loader.load('./resources/images/concrete/AO.png');
        concreteAO.wrapS = THREE.RepeatWrapping;
        concreteAO.wrapT = THREE.RepeatWrapping;
        concreteAO.repeat.set( concreteWidthRepeat, concreteLengthRepeat );
        const concreteDiffuse = loader.load('./resources/images/concrete/base.png');
        concreteDiffuse.wrapS = THREE.RepeatWrapping;
        concreteDiffuse.wrapT = THREE.RepeatWrapping;
        concreteDiffuse.repeat.set( concreteWidthRepeat, concreteLengthRepeat );
        const concreteNormal = loader.load('./resources/images/concrete/normal.png');
        concreteNormal.wrapS = THREE.RepeatWrapping;
        concreteNormal.wrapT = THREE.RepeatWrapping;
        concreteNormal.repeat.set( concreteWidthRepeat, concreteLengthRepeat );

        const concreteMaterial =
            new THREE.MeshStandardMaterial(
                {
                    aoMap: concreteAO,
                    normalMap: concreteNormal,
                    map: concreteDiffuse
                });

        return concreteMaterial;
    }
    const concreteMaterial = makeConcreteMaterial();


    class BetonPilaar{
        constructor(x) {
            this.main = makeInstanceWithTexture(BetonMain, concreteMaterial, x, -5, 0);
            this.ZO = makeInstanceWithTexture(BetonFront, concreteMaterial, x, -3, 12);
            this.ZO.scale.x = 3/4;
            this.ZO.scale.y = 3/4;
            this.ZO.scale.z = 2;
            this.ZO.rotateX(Math.PI/2);
            this.ZW = makeInstanceWithTexture(BetonFront, concreteMaterial, x, -3, 12);
            this.ZW.scale.x = 3/4;
            this.ZW.scale.y = 3/4;
            this.ZW.scale.z = 2;
            this.ZW.rotateY(-Math.PI/2);
            this.ZW.rotateX(Math.PI/2);

            this.NO = makeInstanceWithTexture(BetonFront, concreteMaterial, x, -7, -12);
            this.NO.scale.x = 3/4;
            this.NO.scale.y = 3/4;
            this.NO.scale.z = 2;
            this.NO.rotateX(-Math.PI/2);
            this.NW = makeInstanceWithTexture(BetonFront, concreteMaterial, x, -7, -12);
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
            const roadRailMaterial = new THREE.MeshPhysicalMaterial ({
                transmission: 0.7,
                reflectivity: 0.1,
                opacity: 1,
                transparent: true
            });


            this.road = makeInstanceWithTexture(brugdekGeo, roadMaterial, x, y-0.5, z);



			this.roadRailingLeft = makeInstanceWithTexture(RoadRailingGlass, roadRailMaterial, x, y + 1.5, z - 9.9);
            this.roadRailingRight = makeInstanceWithTexture(RoadRailingGlass, roadRailMaterial, x, y + 1.5, z + 9.9);
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

                concreteMaterial,
                concreteMaterial,
                new THREE.MeshStandardMaterial(
                    {
                        aoMap: roadAO,
                        normalMap: roadNormal,
                        map: roadDiffuse
                    }),
                concreteMaterial,
                concreteMaterial,
                concreteMaterial,
                concreteMaterial

                ];
            return roadMaterials;
        } 



    }

    class Brugtoren {
        constructor(x, y, z, dir) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.NOpilaar = makeInstance(pilaar, 0xffffff, x + 0.8, y + 2.5, z - 0.8);
            this.NWpilaar = makeInstance(pilaar, 0xffffff, x - 0.8, y + 2.5, z - 0.8);
            this.ZOpilaar = makeInstance(pilaar, 0xffffff, x + 0.8, y + 2.5, z + 0.8);
            this.ZWpilaar = makeInstance(pilaar, 0xffffff, x - 0.8, y + 2.5, z + 0.8);

            this.dwarsOnder = new PilaarDwarsBalken(x, 2.7, z);
            this.dwarsMiden = new PilaarDwarsBalken(x, 6.25, z);
            this.dwarsBoven = new PilaarDwarsBalken(x, 9.8, z);

            this.top = makeInstance(PyramideTop, 0xffffff, x, 10.75, z);
            this.top.rotateY(Math.PI/4);

            this.top2 = makeInstance(CubusTop, 0xffffff, x, 11, z);

            this.wielen = null;

            this.gewicht = makeInstance(gewicht, 0xffffff, x + 2 * dir - 1*dir, 8, z -2*dir);
            
            this.gewicht.scale.z = 2;
            if(dir == -1){
                this.gewicht.rotateY(Math.PI);
            }

            this.Ngewichtkabel = new kabel(x + 1.1 * dir, 0 , z + 0.9)
            this.Zgewichtkabel = new kabel(x + 1.1 * dir, 0, z - 0.9)

            this.Ndekkabel = new kabel(x + -1.1 * dir, 0, z + 0.9)
            this.Zdekkabel = new kabel(x + -1.1 * dir, 0, z - 0.9)
            this.setGewichtKabel(8);
            this.setDekKabel(-1);
        }

        setWheels(geometry)
        {
            this.wielen = new BrugTorenWielen(this.x, 11.5, this.z,geometry);
        }

        setGewichtKabel(bottom) {
            this.Ngewichtkabel.setLength(11.5, bottom);
            this.Zgewichtkabel.setLength(11.5, bottom);
        }

        setDekKabel(bottom) {
            this.Ndekkabel.setLength(11.5, bottom);
            this.Zdekkabel.setLength(11.5, bottom);
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
        constructor(x, y, z,geometry) {
            this.material =  new THREE.MeshBasicMaterial( {color: "yellow"} );

            this.links = makeInstanceWithTexture(geometry,this.material , x, y, z - 1);
            this.rechts = makeInstanceWithTexture(geometry, this.material, x, y, z + 1);
            this.scale = 0.014;
            this.links.scale.x = this.scale;
            this.links.scale.y = this.scale;
            this.links.scale.z = this.scale;
            this.rechts.scale.x = this.scale;
            this.rechts.scale.y = this.scale;
            this.rechts.scale.z = this.scale;

            this.as = makeInstance(axel, 0x000000,x,y,z);
            this.rechts.rotateY(Math.PI);
            this.as.rotateX(1.5708);
        }

        Rotate(time) {
            this.links.rotateZ(time);   //rotation.z = this.links.rotation.z+ time;
            this.rechts.rotateZ(-time);   //rotation.z =  this.rechts.rotation.z+ time;
            this.as.rotateY(time);
        }
    }

    class Torens {
        constructor() {
            this.wheelsexist = false;
            this.noToren = new Brugtoren(16, 0, -11, 1);
            this.nwToren = new Brugtoren(-16, 0, -11, -1);
            this.zoToren = new Brugtoren(16, 0, 11, 1);
            this.zwToren = new Brugtoren(-16, 0, 11, -1);
            
        }

        setWheels(geometry)
        {
            this.noToren.setWheels(geometry);
            this.nwToren.setWheels(geometry);
            this.zoToren.setWheels(geometry);
            this.zwToren.setWheels(geometry);
            this.wheelsexist = true;
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
            if(this.wheelsexist){
               
            this.noToren.wielen.Rotate(time);
            this.nwToren.wielen.Rotate(-time);
            this.zoToren.wielen.Rotate(time);
            this.zwToren.wielen.Rotate(-time); 
        }
        }
    }


    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const box = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);



    function makeInstance(geometry, color, x, y, z) {
        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;

        return cube;
    }

    function makeInstanceWithTexture(geometry, material, x, y, z) {
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
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
    const kadeLinks = makeInstanceWithTexture(kade,concreteMaterial,60,-5,0);
    const kadeRechts = makeInstanceWithTexture(kade,concreteMaterial,-60,-5,0);


    const openDistance = 5;


    const riverGeometry = new THREE.BoxGeometry(90, 1, 400);
    const riverMaterial = new THREE.MeshPhongMaterial( {
                                color: 0x31877d,
    } );
    const mainRiver = new THREE.Mesh(riverGeometry, riverMaterial);
    scene.add(mainRiver);
    mainRiver.position.y = -10;
    //mainRiver.position.z = 100;


    const riverNormalMap = loader.load('./three/examples/textures/water/Water_1_M_Normal.jpg');
    const riverNormalMap2 = loader.load('./three/examples/textures/water/Water_2_M_Normal.jpg');
    // needs to be plane; any 3d shape won't work
    const waterGeometry = new THREE.PlaneGeometry( 90, 400 );
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
    //water.position.z = 10;





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


        if (params["open"] == true && bridgeY < openDistance) {
            bridgeY += timepassed;
            if (bridgeY > openDistance) {
                bridgeY = openDistance;
            }
            brugdekMidden.SetY(bridgeY);
            torens.moveWeights(bridgeY);
            torens.moveWheels(-timepassed);
        }
        if (params["open"] == false && bridgeY > 0) {
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




