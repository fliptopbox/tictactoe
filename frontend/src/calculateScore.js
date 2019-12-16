import gamedata from "./finished-game.json";

function getFaceArray(dataset) {
    const radius = getRadiusFromMatix(dataset);
    const faces = {
        x: [[], []],
        y: [[], []],
        z: [[], []]
    };

    [...dataset].forEach(row => {
        const { x, y, z } = row;

        // the negagive axes (eg x: -1) are index: 0
        // the positive axes (eg. y: 1) are index: 1
        if (Math.abs(x) === radius) faces.x[x < 0 ? 0 : 1].push(row);
        if (Math.abs(y) === radius) faces.y[y < 0 ? 0 : 1].push(row);
        if (Math.abs(z) === radius) faces.z[z < 0 ? 0 : 1].push(row);
    });

    return faces;
}

function getLattice(iterations, type, facet, radius, re, diameter) {
    return iterations.map(i => {
        return getFilter(radius, type, i).reduce(
            (acc, c) => (re.test(facet[c].owner) ? (i && i < diameter - 1 ? 1 : 1) : 0) + acc,
            0
        );
    });
}

function getDiagonals(re, facet, diameter, radius) {
    return ["backslash", "forwardslash"].map(type =>
        getFilter(radius, type).reduce((acc, c) => (re.test(facet[c].owner) ? 1 : 0) + acc, 0) === diameter
            ? diameter
            : 0
    );
}

function getScore(matrix, playerId) {
    const radius = getRadiusFromMatix(matrix);
    const { x, y, z } = getFaceArray(matrix, playerId);

    const re = new RegExp(`${playerId}`, "i");
    const diameter = radius + 2;
    const iterations = [...Array(diameter)].map((_, i) => i);

    const occupied = [].concat(
        [x, y, z].map(dimensions =>
            dimensions.map(facet => {
                //
                const rows = getLattice(iterations, "row", facet, radius, re, diameter);
                const cols = getLattice(iterations, "col", facet, radius, re, diameter);
                const diags = getDiagonals(re, facet, diameter, radius);

                return [...rows, ...cols, ...diags];
            })
        )
    );

    // the number of individual cubes occupied
    const subtotal = matrix.filter(row => re.test(row.owner)).map(() => 1).length;

    // the number of consecutive occupied cubes
    const sets = occupied
        .map(set => set.filter(values => (values === diameter ? 1 : 0)))
        .map(a => a.length)
        .reduce((a, c) => a + c, 0);

    // does this player occupy an entire facet? (instant victory)
    const dominance = occupied.map(types => types.every(value => value >= diameter)).filter(bool => bool).length;

    const total = subtotal + sets * diameter;

    return {
        dominance,
        sets,
        subtotal,
        total
    };
}


function getRadiusFromMatix(matrix) {
    return Math.max.apply(
        null,
        matrix.map(r => r.x)
    );
}


function getFilter(radius, type = 0, value = 0, negate = true) {
    const diameter = radius + 2;
    const sqr = diameter ** 2;

    // returns the negated index OR remove output
    const empty = n => (negate === true ? null : -n);

    let array = [...Array(sqr)].map((_, i) => i);

    let condition;
    type = String(type).toLowerCase();

    switch (type) {
        case "0":
        case "col":
        case "column":
        case "vertical":
            // columns (type: 1, value: column index)
            condition = i => ((i % sqr) % diameter === value ? i : empty(i));
            break;

        case "1":
        case "row":
        case "horizontal":
            // rows (type: 0, value: row index)
            condition = i => ((i / diameter) >> 0 === value ? i : empty(i));
            break;

        case "2":
        case "descend":
        case "diagbck":
        case "backslash":
            // diagonal -45' \ (type: 1, value: NA)
            value = 0;
            condition = i => (i % (diameter + 1) === value ? i : empty(i));
            break;

        case "3":
        case "ascend":
        case "diagfwd":
        case "forwardslash":
            // diagonal +45' / (type:1, value: NA)
            value = diameter;
            condition = i => (((i % sqr) % diameter) + 1 + ((i / diameter) >> 0) === value ? i : empty(i));
            break;

        default:
            return null;
    }

    // remove all the "null" values, and return the relative indexes
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



getScore(gamedata.matrix, 222); //?
getRadiusFromMatix(gamedata.matrix); //?.


/***/
