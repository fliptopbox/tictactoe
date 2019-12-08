import {setTerrain} from './terrain';

export default createWorld;
function createWorld(diameter = 0) {
    const sizes = [3, 5, 7, 9]; // small, medium, large, extra-large
    const columns = sizes[diameter] || sizes[0];
    const squared = columns ** 2; // number of cells per face
    const cubed = columns ** 3; // total number of cells
    const offset = (columns / 2) >> 0; // offset to world offset (0,0,0)

    let matrix = [...Array(cubed)].map((_, i) => {
        // setup coordinates

        let x = i % columns;
        let y = ((i / columns) >> 0) % columns;
        let z = ((i / squared) >> 0) % columns;

        // // ensure the matrix center is at scene offset
        x -= offset;
        y -= offset;
        z -= offset;

        const {axis, type} = setTerrain(offset, x, y, z);
        console.log(axis, type);

        const obj = {id: i, x, y, z, type, axis};
        return obj;
    });

    // output the count of interal objects
    // (the core of the planet)
    console.log('core', Object.keys(matrix).filter(k => matrix[k].type).length);

    return {
        matrix,
        metadata: {
            columns,
            offset
        }
    };
}
