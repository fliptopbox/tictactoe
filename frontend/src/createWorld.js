export default createWorld;
function createWorld(diameter = 0) {
    const sizes = [3, 5, 7, 9]; // small, medium, large, extra-large
    const columns = sizes[diameter] || sizes[0];
    const squared = columns ** 2; // number of cells per face
    const cubed = columns ** 3; // total number of cells
    const origin = (columns / 2) >> 0; // offset to world origin (0,0,0)

    let matrix = [...Array(cubed)].map((_, i) => {
        // setup coordinates

        let x = i % columns;
        let y = ((i / columns) >> 0) % columns;
        let z = ((i / squared) >> 0) % columns;

        // // ensure the matrix center is at scene origin
        x -= origin;
        y -= origin;
        z -= origin;

        // flag intenal instances
        const core =
            Math.abs(x) < origin &&
            Math.abs(y) < origin &&
            Math.abs(z) < origin;

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
        type = Number(ax + ay + az) === origin * 3 ? 3 : 0;
        type = type ? type : Number(ax + ay) === origin * 3 - origin && 2;
        type = type ? type : Number(ax + az) === origin * 3 - origin && 2;
        type = type ? type : Number(ay + az) === origin * 3 - origin && 2;
        type = type ? type : 1; // interior surfaces
        type = core ? 0 : type; // invisible

        const obj = { id: i, x, y, z, type };
        return obj;
    });

    // output the count of interal objects
    // (the core of the planet)
    console.log('core', Object.keys(matrix).filter(k => matrix[k].type).length);

    return {
        matrix,
        metadata: {
            columns,
            origin
        }
    };
}
