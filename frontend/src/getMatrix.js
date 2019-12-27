import {MeshBuilder, Vector3} from 'babylonjs';
import createWorld from './createWorld';
import {getTerrain} from './terrain';

export default getMatrix;
function getMatrix({scene}, radius = 1) {
    const {CreateBox} = MeshBuilder;

    // dispose old earth mesh
    let {meshes} = scene;

    meshes
        .filter(mesh => mesh && mesh.id && /^m[0-9]+$/.test(mesh.id))
        .forEach((mesh, i) => mesh.dispose());

    let planet = createWorld(radius).matrix.map(cube => {
        const {id, x, y, z} = cube;
        const size = 0.9;
        const mesh = CreateBox(id, {size}, scene);
        mesh.position = new Vector3(x, y, z);
        mesh.id = 'm' + id;

        return {...cube, mesh};
    });

    console.log(planet);
    planet
        .filter(c => !c.core)
        .forEach(cube => getTerrain(cube, {scene}, 0));

    return planet;
}
