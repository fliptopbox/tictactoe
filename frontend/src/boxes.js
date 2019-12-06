import {MeshBuilder, Vector3} from 'babylonjs';
import materials from './materials';

export default boxes;
function boxes({scene}) {
    const {CreateBox} = MeshBuilder;
    const {wire} = materials(scene);

    var name;
    var dim = {size: 0.25};
    var cubes = {
        /*
        id: index
        x: -1, 0, 1
        y: 0,1,2
        z: 0 to 8
        mesh: Mesh

        */
    };


    console.log(createWorld());

    var items = [1, 1, 1, 2, 2, 2, 3, 3, 3];
    items.forEach((v, i) => {
        name = `box_${v}_${i}_${i % 3}`;
        var meshA = CreateBox(name, dim, scene);
        meshA.position = new Vector3(-1, v - 2, (i % 3) - 1);
        meshA.material = wire;
        cubes['A' + i] = meshA;

        name = `box_${v + 1}_${i}_${i % 3}`;
        var meshB = CreateBox(name, dim, scene);
        meshB.position = new Vector3(0, v - 2, (i % 3) - 1);
        meshB.material = wire;
        cubes['B' + i] = meshB;

        name = `box_${v + 1}_${i}_${i % 3}`;
        var meshC = CreateBox(name, dim, scene);
        meshC.position = new Vector3(1, v - 2, (i % 3) - 1);
        meshC.material = wire;
        cubes['C' + i] = meshC;
    });

    console.log(cubes);
    return cubes;
}



    function createWorld(size = 0, origin = true) {

        const sizes = [3, 5, 7, 9]; // small, medium, large, extra-large
        const columns = sizes[size] || sizes[0];
        const squared = columns ** 2; // number of cells per face
        const cubed = columns ** 3; // total number of cells
        const offset = origin ? (columns / 2) >> 0 : 0; // offset to origin

        let world = [...Array(cubed)].map((_, i) => {
            // setup coordinates

            const x = (i % columns) - offset;
            const y = (((i / columns) >> 0) % columns) - offset;
            const z = (((i / squared) >> 0) % columns) - offset;

            // console.log('V:%s  X:%s   Y:%s   Z:%s', i, x, y, z);
            return {id: i, x, y, z};
        });

        return world;
    }
