import gamedata from "./finished-game.json";
import { AttachToBoxBehavior } from "babylonjs";

let radius = 0;
let cubes = 0;
let owner = 222;
const collection = {};

const axes = gamedata.filter(row => {
    radius = Math.max(radius, row.x);
    cubes += row.type ? 1 : 0;
    return row.axis && row.owner === owner;
}); //? $.length

axes.forEach(c => (collection[c.id] = owner));

const N = radius * 2 + 1; //?

instantVictory(axes, radius, collection); //?.

function instantVictory(axes, radius, occupancy) {
    // one player occuping an entire face is instant victory
    const candidates = axes.filter(cube => !cube);
    if (!candidates || !candidates.length) return false;

    // check the rows for each axis
    // if one row is incomplete disregard the face
    candidates.forEach(axis => {
        axis;
        getRows(axis, radius).forEach(index => {
            occupancy[index]; //?
        });
    });
}

function getColumns(axis, radius) {
    const columns = getVector(axis, radius).map(v => getVector(v, 1, true));
    return [].concat(...columns);
}

function getRows(axis, radius) {
    const rows = getVector(axis, radius, true).map(v => getVector(v, 1));
    return [].concat(...rows);
}

function getDiagonals(axis, radius) {
    const diags = [-1, 1].map(n => getVector(axis, radius, true, n));
    return [].concat(...diags); //?
}

function getVector(cubes = null, axis, radius, vertical, offset = 0) {
    const N = radius * 2 + 1;
    let array = cubes && cubes.constructor === Array ? cubes : [...Array(N)];
    const diagonal = Math.abs(offset);
    array = array.map((_, i) => {
        const normal = i - radius;
        return (
            axis +
            normal * (vertical ? N : 1) +
            (diagonal ? normal * offset : 0)
        );
    });
    return [...array];
}


function getFilter(radius, type = 0, value = 0) {
    const odd = Math.abs(radius % 2);
    const diameter = (radius * 2) + odd;
    const N = (radius * 2 + odd) ** 2;

    let array = [...Array(N)].map((_, i) => i);

    let condition;
    type = String(type).toLowerCase();

    switch (type) {
        case "0":
        case "col":
        case "column":
        case "vertical":
            // columns (type: 1, value: column index)
            condition = (i) => ((i % N) % diameter === value ? i : null);
            break;

        case "1":
        case "row":
        case "horizontal":
            // rows (type: 0, value: row index)
            condition = (i) => ((i / diameter) >> 0 === value ? i : null);
            break;

        case "2":
        case "descend":
        case "diagbck":
        case "backslash":
            // diagonal -45' \ (type: 1, value: NA)
            value = 0;
            condition = (i) => (i % (diameter + 1) === value ? i : null);
            break;

        case "3":
        case "ascend":
        case "diagfwd":
        case "forwardslash":
            // diagonal +45' / (type:1, value: NA)
            // value = ((diameter / 1) >> 0) + 1;
            value = (diameter)
            condition = (i) =>
                ((i % N) % diameter + 1) + ((i / diameter) >> 0) === value
                    ? i
                    : null;
            break;

        default:
            return null;
    }

    // remove all the "null" values, and return the relative indexes
    return array.map(condition).filter(index => index !== null);

}

/** QUOKKA TEST */
// 0 1 2
// 3 4 5
// 6 7 8

// 0 1 2 3
// 4 5 6 7
// 8 9 a b
// c d e f

getFilter(1, "row", 0); //?
getFilter(1, "col", 0); //?

getFilter(2, "row", 0); //?
getFilter(2, "col", 0); //?
// getFilter(2, 2, 0); //?

getFilter(1, "forwardslash"); //?
getFilter(2, "forwardslash"); //?

getFilter(1, "backslash"); //?
getFilter(2, "backslash"); //?
// getFilter(1, 3); //?.

// getFilter(2); //? $.length

// row
getVector(null, 4, 1); //?

// column
getVector(null, 4, 1, true); //?

// diagonal (+45')
getVector(null, 4, 1, true, 1); //?

// diagonal (-45')
getVector(null, 4, 1, true, -1); //?

/***/
