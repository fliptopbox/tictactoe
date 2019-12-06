import { MeshBuilder, Vector3 } from 'babylonjs';
import materials from './materials';

export default boxes;
function boxes({scene}) {
    const { CreateBox } = MeshBuilder;
    const { wire } = materials(scene);

    var name;
    var dim = { size: 0.25 };
    var cubes = {};
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
