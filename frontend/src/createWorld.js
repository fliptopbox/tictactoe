import { setTerrain } from "./terrain";

export default createWorld;
function createWorld(radius = 1) {
    const diameter = radius + 2; //?

    const columns = diameter; //sizes[diameter] || sizes[0];
    const squared = columns ** 2; // number of cells per face
    const totalcubes = columns ** 3; // total number of cells
    const offset = (diameter - 1) / 2; // offset to world origin (0,0,0)

    let matrix = [...Array(totalcubes)].map((_, i) => {
        // setup coordinates

        let x = i % columns;
        let y = ((i / columns) >> 0) % columns;
        let z = ((i / squared) >> 0) % columns;

        // ensure the matrix center is at scene origin
        x = x + -(offset);
        y = y + -(offset);
        z = z + -(offset);

        const { axis, type } = setTerrain((offset), x, y, z);
        const owner = 0;
        const obj = { id: i, x, y, z, type, axis, owner };
        return obj;
    });

    // output the count of interal objects
    // (the core of the planet)
    // console.log('core', Object.keys(matrix).filter(k => matrix[k].type).length);

    return {
        matrix,
        metadata: {
            columns,
            offset
        }
    };
}