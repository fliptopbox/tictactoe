import { StandardMaterial, Color3 } from 'babylonjs';
import { hsl } from 'color-convert';

import hexToRGB from './hexToRGB';
// import materials from './materials';

export { setTerrain };
export { getTerrain };


let greens = [];
let teals = [];

// generate natural tints (light to dark)
// i = 100 white, i = 0 black)
for (let i = 65; i >= 10; i -= 5) {
    let green, teal;
    green = '#' + hsl.hex(120, 100, i);
    teal = '#' + hsl.hex(204, 100, i);

    greens.push(hexToRGB(green));
    teals.push(hexToRGB(teal));

    console.log(
        '%c GREEN %c TEAL ',
        `background: ${green}`,
        `background: ${teal}`,
        i,
        green,
        teal
    );
}

// returns mesh with material of the terrain for a give cube
// with respect to the player and type

// face type: (no. of faces )
// ----------------------------------------------
// corner   (3)     x,y,z (maximum)
// edge     (2)     eg. x,y or x,z
// plane    (1)     single plane
// core     (0)     internal instance

// const types = ['core', 'plane', 'edge', 'corner'];
// const diffuseColors = ['#ff0000', '#00ff00', '#0000ff', '#fefefe'];
// let mat = null;

function getTerrain(cube, { scene }, player = 0) {
    const { type, axis, mesh, id } = cube;

    let [r, g, b] = getNaturalColor(type, axis);

    const mat = new StandardMaterial(id, scene);
    mat.diffuseColor = new Color3(r, g, b);
    mat.wireframe = false;
    mesh.material = mat;
    mesh.id = "m" + id;

    return cube;
}

function setTerrain(offset, x, y, z) {
    // flag intenal instances
    const core =
        Math.abs(x) < offset && Math.abs(y) < offset && Math.abs(z) < offset;

    const ax = Math.abs(x);
    const ay = Math.abs(y);
    const az = Math.abs(z);

    let type = 0;
    type = Number(ax + ay + az) === offset * 3 ? 3 : 0;
    type = type ? type : Number(ax + ay) === offset * 3 - offset && 2;
    type = type ? type : Number(ax + az) === offset * 3 - offset && 2;
    type = type ? type : Number(ay + az) === offset * 3 - offset && 2;
    type = type ? type : 1; // interior surfaces
    type = core ? 0 : type; // invisible

    // flag XYZ axis - the polar plate on each face
    let axis =
        (ax === 0 || ay === 0 || az === 0) &&
        ((ax === 0 && ay === 0 && az === offset) ||
            (ay === 0 && az === 0 && ax === offset) ||
            (az === 0 && ax === 0 && ay === offset));

    return { type, axis };
}



function getNaturalColor(type, axis = false) {

    // world central core
    if(type === 0) return [1,0,0];

    const natural = [...greens.slice(0,-2), ...teals.slice(0,-2)];
    const axises = [...greens.slice(-2), ...teals.slice(-2)]
    const array = axis ? axises : natural;

    return array[Math.random() * array.length >> 0]
}
