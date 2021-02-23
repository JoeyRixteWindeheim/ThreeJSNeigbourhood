import * as THREE from './three/three.js';

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
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 50;
    camera.position.y = 10;
    
  
    const scene = new THREE.Scene();
  
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    

  




  
    const brugdekGeo =  new THREE.BoxGeometry(30, 1, 20);
    const RoadRailing = new THREE.BoxGeometry(30, 2, 0.2);
    const sidewalk = new THREE.BoxGeometry(30, 0.2, 2);
    const sidewalkRailer = new THREE.BoxGeometry(30, 1, 0.1);

    const pilaar = new THREE.BoxGeometry(0.4, 15, 0.4);
    const dwarsbalk = new THREE.BoxGeometry(0.4, 0.4, 1.2);

    //const gewicht = new THREE.BoxGeometry(2, 2, 4);

    const wheel = new THREE.CylinderGeometry(1.1,1.1,0.2,10);

    const cabel = new THREE.CylinderGeometry(0.05,0.05,1,6);

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

    var prism = new THREE.ExtrudeGeometry( shape, extrudeSettings );


    const gewicht = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    gewicht.scale.x = 2;
    gewicht.scale.y = 2;
    gewicht.scale.z = 4;

    class BrugdekOnderdeel
    {
        constructor(x,y,z){
            this.road = makeInstance(brugdekGeo, 0xffffff,  x,y,z);
            this.roadRailingLeft = makeInstance(RoadRailing, 0xffffff,  x, y+1.5 , z - 10);
            this.roadRailingRight = makeInstance(RoadRailing, 0xffffff,  x, y+1.5 , z + 10);
            this.sidewalkRight = makeInstance(sidewalk, 0xffffff,  x, y-0.4 , z + 11);
            this.sidewalkLeft = makeInstance(sidewalk, 0xffffff,  x, y-0.4 , z - 11);
            this.sidwalkRailingLeft = makeInstance(sidewalkRailer, 0xffffff,  x, y , z - 12);
            this.sidwalkRailingRight = makeInstance(sidewalkRailer, 0xffffff,  x, y , z + 12);
        }

        SetY(y){
            this.road.position.y = y;
            this.roadRailingLeft.position.y = y+1.5;
            this.roadRailingRight.position.y = y+1.5;
            this.sidewalkRight.position.y = y-0.4;
            this.sidewalkLeft.position.y = y-0.4;
            this.sidwalkRailingLeft.position.y = y;
            this.sidwalkRailingRight.position.y = y;
        }
    }

    class Brugtoren
    {
        constructor(x,y,z,dir){
            this.NOpilaar = makeInstance(pilaar, 0xffffff,  x+0.8, y+2.5 , z-0.8);
            this.NWpilaar = makeInstance(pilaar, 0xffffff,  x-0.8, y+2.5 , z-0.8);
            this.ZOpilaar = makeInstance(pilaar, 0xffffff,  x+0.8, y+2.5 , z+0.8);
            this.ZWpilaar = makeInstance(pilaar, 0xffffff,  x-0.8, y+2.5 , z+0.8);

            this.dwarsOnder = new PilaarDwarsBalken(x,2.7,z);
            this.dwarsMiden = new PilaarDwarsBalken(x,6.25,z);
            this.dwarsBoven = new PilaarDwarsBalken(x,9.8,z);

            this.wielen = new BrugTorenWielen(x,11.2,z)

            this.gewicht = makeInstance(gewicht, 0xffffff,  x+ 2*dir -1 , 9 -1 , z -2);

            this.Ngewichtkabel = new kabel ( x + 1.1*dir, 0, z+0.9)
            this.Zgewichtkabel = new kabel ( x + 1.1*dir, 0, z-0.9)

            this.Ndekkabel = new kabel ( x + -1.1*dir, 0, z+0.9)
            this.Zdekkabel = new kabel ( x + -1.1*dir, 0, z-0.9)

        }

        setGewichtKabel(bottom){
            this.Ngewichtkabel.setLength(11.2,bottom);
            this.Zgewichtkabel.setLength(11.2,bottom);
        }

        setDekKabel(bottom){
            this.Ndekkabel.setLength(11.2,bottom);
            this.Zdekkabel.setLength(11.2,bottom);
        }
    }

    class kabel
    {
        constructor(x,y,z)
        {
            this.k = makeInstance(cabel, 0x888888, x, y, z)
        }

        setLength(top,bottom)
        {
            this.k.scale.y = top-bottom;
            this.k.position.y = (top-bottom)/2+bottom;
        }

    }

    class PilaarDwarsBalken
    {
        constructor(x,y,z){
            this.Nbalk = makeInstance(dwarsbalk, 0xffffff,  x, y , z-0.8);
            this.Nbalk.rotateY(1.5708);
            this.Zbalk = makeInstance(dwarsbalk, 0xffffff,  x, y , z+0.8);
            this.Zbalk.rotateY(1.5708);

            this.Obalk = makeInstance(dwarsbalk, 0xffffff,  x+0.8, y , z);
            this.Wbalk = makeInstance(dwarsbalk, 0xffffff,  x-0.8, y , z);
        }
    }

    class Bruggewichten
    {
        constructor(){
            this.no = makeInstance(gewicht, 0xffffff,  18, 9 , -11);
            this.nw = makeInstance(gewicht, 0xffffff,  -18, 9 , -11);
            this.zo = makeInstance(gewicht, 0xffffff,  18, 9 , 11);
            this.zw = makeInstance(gewicht, 0xffffff,  -18, 9 , 11);
        }

        SetY(y){
            this.no.position.y = y;
            this.nw.position.y = y;
            this.zo.position.y = y;
            this.zw.position.y = y;
        }
    }

    class BrugTorenWielen
    {
        constructor(x,y,z){
            this.links = makeInstance(wheel, 0xffff00,  x, 11.2 ,z-0.9 );
            this.rechts = makeInstance(wheel, 0xffff00,  x, 11.2 ,z+0.9 );
            this.links.rotateX(1.5708);
            this.rechts.rotateX(1.5708);
            
        }

        Rotate(time){
            this.links.rotateY(time);
            this.rechts.rotateY(time)
        }
    }

    class Torens
    {
        constructor(){
            this.noToren = new Brugtoren(16,0,-11,1);
            this.nwToren = new Brugtoren(-16,0,-11,-1);
            this.zoToren = new Brugtoren(16,0,11,1);
            this.zwToren = new Brugtoren(-16,0,11,-1);
        }

        moveWeights(y){
            this.noToren.gewicht.position.y = 9-y;
            this.nwToren.gewicht.position.y = 9-y; 
            this.zoToren.gewicht.position.y = 9-y;
            this.zwToren.gewicht.position.y = 9-y;

            this.noToren.setGewichtKabel(9-y);
            this.nwToren.setGewichtKabel(9-y);
            this.zoToren.setGewichtKabel(9-y);
            this.zwToren.setGewichtKabel(9-y);

            this.noToren.setDekKabel(y);
            this.nwToren.setDekKabel(y);
            this.zoToren.setDekKabel(y);
            this.zwToren.setDekKabel(y);
        }

        moveWheels(time){
            this.noToren.wielen.Rotate(time);
            this.nwToren.wielen.Rotate(-time);
            this.zoToren.wielen.Rotate(time);
            this.zwToren.wielen.Rotate(-time);
        }
    }

    function makeInstance(geometry, color, x,y,z) {
      const material = new THREE.MeshPhongMaterial({color});
  
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
  
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
  
      return cube;
    }
    

    const brugdekMidden = new BrugdekOnderdeel(0,0,0);
    const brugdekLinks = new BrugdekOnderdeel(-30,0,0);
    const brugdekRechts = new BrugdekOnderdeel(30,0,0);

    const torens = new Torens();
    

    //const gewichten = new Bruggewichten();

    

    const openDistance = 5;

    var timeLastUpdate = 0;
  
    function render(time) {
      time *= 0.001;  // convert time to seconds
      const timepassed = time - timeLastUpdate;
      timeLastUpdate = time;

      if(open == true && bridgeY < openDistance)
      {
        bridgeY += timepassed;
        if(bridgeY > openDistance){
            bridgeY = openDistance;
        }
        brugdekMidden.SetY(bridgeY);
        torens.moveWeights(bridgeY);
        torens.moveWheels(-timepassed);
      }
      if(open == false && bridgeY > 0)
      {
        bridgeY -= timepassed;
        if(bridgeY < 0){
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




