import gamedata from "./finished-game.json";

let radius = 0;
let cubes = 0;
let owner = 222;
const collection = {};


function getFaceArray(data, owner) {

    const array = [...data];
    let depth = 0;
    let count = 0;
    
    [ ...array ].forEach(row => {
        depth = Math.max(depth, row.x)
        count += row.owner === owner ? 1 : 0;
    });

    const faces = {
        depth,
        count,
        x: [[], []],
        y: [[], []],
        z: [[], []]
    };

    [ ...array ].forEach(row => {
        // if(!row || row.owner !== owner) return;
        const {x, y, z} = row;

        if(Math.abs(x) === depth) faces.x[x < 0 ? 0 : 1].push(row)
        if(Math.abs(y) === depth) faces.y[y < 0 ? 0 : 1].push(row)
        if(Math.abs(z) === depth) faces.z[z < 0 ? 0 : 1].push(row)
    });

    return faces;
}

// const z1 = getFaceArray(gamedata.matrix, owner).z[1]; //?
// const z2 = getFaceArray(gamedata.matrix, owner).z[0]; //?


// getFilter(1, "backslash").map(index => String(z1[index].owner) === "111" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "forwardslash").map(index => String(z1[index].owner) === "111" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "row", 0).map(index => String(z1[index].owner) === "111" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "row", 1).map(index => String(z1[index].owner) === "111" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "row", 2).map(index => String(z1[index].owner) === "111" ? 1 : null).reduce((a, c) => a + c, 0) //?

// getFilter(1, "backslash").map(index => String(z2[index].owner) === "222" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "forwardslash").map(index => String(z2[index].owner) === "222" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "row", 0).map(index => String(z2[index].owner) === "222" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "row", 1).map(index => String(z2[index].owner) === "222" ? 1 : null).reduce((a, c) => a + c, 0) //?
// getFilter(1, "row", 2).map(index => String(z2[index].owner) === "222" ? 1 : null).reduce((a, c) => a + c, 0) //?



function getScore(matrix, playerId = 222) {
    const radius = getRadiusFromMatix(matrix);
    const re = new RegExp(`${playerId}`,"i")
    const z2 = getFaceArray(matrix, owner).z[0];
    const score = getFilter(radius, "backslash")
        .reduce((acc, c) => ((re.test(z2[c].owner) ? 1 : 0) + acc), 0);

    return score;
}

getScore(gamedata.matrix, 222); //?

function getRadiusFromMatix(matrix) {
    return Math.max.apply(null, matrix.map(r => r.x)); //?
}

getRadiusFromMatix(gamedata.matrix); //?.


function getFilter(radius, type = 0, value = 0, negate = true) {
    const odd = Math.abs(radius % 2);
    const diameter = (radius * 2) + odd;
    const N = (radius * 2 + odd) ** 2;

    // returns the negated index OR remove output
    const empty = (n) => negate === true ? null : -n;


    let array = [...Array(N)].map((_, i) => i);

    let condition;
    type = String(type).toLowerCase();

    switch (type) {
        case "0":
        case "col":
        case "column":
        case "vertical":
            // columns (type: 1, value: column index)
            condition = (i) => ((i % N) % diameter === value ? i : empty(i));
            break;

        case "1":
        case "row":
        case "horizontal":
            // rows (type: 0, value: row index)
            condition = (i) => ((i / diameter) >> 0 === value ? i : empty(i));
            break;

        case "2":
        case "descend":
        case "diagbck":
        case "backslash":
            // diagonal -45' \ (type: 1, value: NA)
            value = 0;
            condition = (i) => (i % (diameter + 1) === value ? i : empty(i));
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
                    : empty(i);
            break;

        default:
            return null;
    }

    // remove all the "null" values, and returns the relative indexes
    // (setting negate = true, it will return the negative index value)
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

getFilter(1, "row", 0, -1); //?
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
