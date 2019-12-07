import {MeshBuilder, Vector3} from 'babylonjs';
import createWorld from'./createWorld';

export default boxes;
function boxes({scene}, diameter = 1) {
    const {CreateBox} = MeshBuilder;
    const planet = createWorld(diameter).matrix.map(cube => {

        const {id, x, y, z, type} = cube;
        const size = !type ? 1 : 0.90;

        var mesh = CreateBox(id, { size }, scene);
        mesh.position = new Vector3(x, y, z);
        // mesh.material = m(material);


        return {
            ...cube,
            mesh
        }

    });

    return planet;
}

