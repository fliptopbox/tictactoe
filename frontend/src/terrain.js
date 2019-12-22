import { DynamicTexture, StandardMaterial, Color3 } from 'babylonjs';
import { hsl } from 'color-convert';

import hexToRGB from './hexToRGB';
// import materials from './materials';

export { setTerrain };
export { getTerrain };

let greens = [];
let teals = [];
let browns = [];

// generate natural tints (light to dark)
// i = 100 white, i = 0 black)
for (let i = 65; i >= 25; i -= 5) {
    let green, teal, brown;
    green = '#' + hsl.hex(120, 45, i);
    teal = '#' + hsl.hex(204, 60, i);
    brown = '#' + hsl.hex(12, 40, i);

    greens.push(hexToRGB(green));
    teals.push(hexToRGB(teal));
    browns.push(hexToRGB(brown));

    console.log(
        '%c GREEN %c TEAL %c BROWN',
        `background: ${green}`,
        `background: ${teal}`,
        `background: ${brown}`,
        i,
        green,
        teal,
        brown, i - 25
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

function getTerrain(cube, { scene }) {
    const dev = false;
    const { type, axis, mesh, id } = cube;
    const coord = [cube.x, cube.y, cube.z].join(',');
    const label = `${id}(${coord})${axis ? '#' : ''}`;

    let [r, g, b] = getNaturalColor(type, axis);
    const hex = new Color3(r,g,b).toHexString();

    let mat = new StandardMaterial(id, scene);
    if (!dev) {
        mat.diffuseColor = new Color3(r, g, b);
    } else {
        mat = getDynamicTexture(scene, mat, hex, label);
    }

    mat.wireframe = false;
    mesh.material = mat;
    mesh.id = 'm' + id;
    mesh.material.hexColor = hex;

    return cube;
}



const CORNER = 3;
const DOUBLE = 2;
const SINGLE = 1;
const INTERNAL = 0;




function setTerrain(offset, x, y, z) {
    // flag intenal instances
    const core =
        Math.abs(x) < offset && Math.abs(y) < offset && Math.abs(z) < offset;

    const ax = Math.abs(x);
    const ay = Math.abs(y);
    const az = Math.abs(z);

    let type = 0;
    type = Number(ax + ay + az) === offset * CORNER ? CORNER : 0;
    type = type ? type : Number(ax + ay) === offset * CORNER - offset && DOUBLE;
    type = type ? type : Number(ax + az) === offset * CORNER - offset && DOUBLE;
    type = type ? type : Number(ay + az) === offset * CORNER - offset && DOUBLE;
    type = type ? type : SINGLE; // interior surfaces
    type = core ? INTERNAL : type; // invisible

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
    if (type === 0) {
        return browns[(Math.random() * browns.length) >> 0];
    }

    const natural = [...greens.slice(0, -2), ...teals.slice(0, -2)];
    const axises = [...greens.slice(-2), ...teals.slice(-2)];
    const array = axis ? axises : natural;

    return array[(Math.random() * array.length) >> 0];
}

function getDynamicTexture(scene, material, diffuseColor, text) {
    const font = 'bold 16px Arial';
    const color = "white";
    const dynTex = new DynamicTexture(
        'dtex',
        { width: 150, height: 150 },
        scene,
        true
    );

    dynTex.drawText(text, 10, 40, font, color, diffuseColor, true, true);

    material.diffuseTexture = dynTex;
    material.diffuseTexture.uOffset = 0;
    material.diffuseTexture.vOffset = 0;

    return material;
}
