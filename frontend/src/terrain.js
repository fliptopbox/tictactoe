import materials from './materials';
import {Color3} from 'babylonjs';
import hexToRGB from './hexToRGB';

export { setTerrain };
export { getTerrain };

// returns mesh with material of the terrain for a give cube
// with respect to the player and type

// face type: (no. of faces )
// ----------------------------------------------
// corner   (3)     x,y,z (maximum)
// edge     (2)     eg. x,y or x,z
// plane    (1)     single plane
// core     (0)     internal instance

const types = ['core', 'plane', 'edge', 'corner'];
const diffuseColors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff'];
let mat = null;

function getTerrain(cube, {scene}, player = 0) {
    const {type, axis, mesh} = cube;

    mat = mat || materials(scene);
    let [r, g, b] = hexToRGB(diffuseColors[type]);

    if (axis) [r, g, b] = hexToRGB('#ffff00');

    mesh.material = mat('surface');
    mesh.material.diffuseColor = new Color3(r, g, b);
    mesh.material.wireframe = false;

    return cube;
}


function setTerrain(offset, x, y, z) {

        // flag intenal instances
        const core =
            Math.abs(x) < offset &&
            Math.abs(y) < offset &&
            Math.abs(z) < offset;

        const ax = Math.abs(x);
        const ay = Math.abs(y);
        const az = Math.abs(z);

        // face type: (no. of faces )
        // ----------------------------------------------
        // corner   (3)     x,y,z (maximum)
        // edge     (2)     eg. x,y or x,z
        // plane    (1)     single plane
        // core     (0)     internal instance

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

    return {type, axis}
}
