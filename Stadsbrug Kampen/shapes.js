import * as THREE from './three/three.js';

const brugdekGeo =  new THREE.BoxGeometry(30, 1, 20);




const vertices = [

    //back
    { pos: [1, -1,  -1] ,norm: [ 0, 0,  -1]},
    { pos: [ -1, -1,  -1] ,norm: [ 0, 0,  -1]},
    { pos: [-1,  1,  -1] ,norm: [ 0, 0,  -1]},

    //bottom
    { pos: [1, -1,  -1] ,norm: [ 0, -1,  0]},
    { pos: [ -1, -1,  -1] ,norm: [ 0, -1,  0]},
    { pos: [-1,  -1,  1] ,norm: [ 0, -1,  0]},

    { pos: [1, -1,  -1] ,norm: [ 0, -1,  0]},
    { pos: [ 1, -1,  1] ,norm: [ 0, -1,  0]},
    { pos: [-1,  -1,  1] ,norm: [ 0, -1,  0]},

    //front
    { pos: [1, -1,  1] ,norm: [ 0, 0,  1]},
    { pos: [ -1, -1,  1] ,norm: [ 0, 0,  1]},
    { pos: [-1,  1,  1] ,norm: [ 0, 0,  1]},
    
    //left
    { pos: [-1, -1,  -1] ,norm: [ -1, 0,  0]},
    { pos: [ -1, -1,  1] ,norm: [ -1, 0,  0]},
    { pos: [-1,  1,  -1] ,norm: [ -1, 0,  0]},

    { pos: [-1, 1,  -1] ,norm: [ -1, 0,  0]},
    { pos: [ -1, 1,  1] ,norm: [ -1, 0,  0]},
    { pos: [-1,  -1,  1] ,norm: [ -1, 0,  0]},


    { pos: [1, -1,  -1] ,norm: [ 0, 1,  0]},
    { pos: [ 1, -1,  1] ,norm: [ 0, 1,  0]},
    { pos: [-1,  1,  -1] ,norm: [ 0, 1,  0]},

    { pos: [1, -1,  1] ,norm: [ 0, 1,  0]},
    { pos: [ -1, 1,  1] ,norm: [ 0, 1,  0]},
    { pos: [-1,  1,  -1] ,norm: [ 0, 1,  0]},

];
const positions = [];
const normals = [];
for (const vertex of vertices) {
    positions.push(...vertex.pos);
    normals.push(...vertex.norm);
}

const bruggewichtGeo = new THREE.BufferGeometry();
bruggewichtGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), 3));
bruggewichtGeo.setAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(normals), 3));



class brugdekOnderdeel
{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    makeInstance

}

/*
function makeInstance(geometry, color) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    return cube;
  }
*/
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }