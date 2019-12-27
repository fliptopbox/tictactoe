import { MeshBuilder, Vector3 } from 'babylonjs';
import createWorld from './createWorld';
import { getTerrain } from './terrain';

export default getMatrix;
function getMatrix({ scene }, radius = 1) {
    const { CreateBox } = MeshBuilder;

    // dispose old earth mesh
    let { meshes } = scene;
    let initialSize = 0.85;

    meshes
        .filter(mesh => mesh && mesh.id && /^m[0-9]+$/.test(mesh.id))
        .forEach(mesh => mesh.dispose());

    let planet = createWorld(radius).matrix.map(cube => {
        const { id, x, y, z, type } = cube;
        const size = type ? initialSize : initialSize * 0.8;
        const mesh = CreateBox(id, { size }, scene);
        mesh.position = new Vector3(x, y, z);
        mesh.id = 'm' + id;
        mesh.isCore = type === 0;

        return { ...cube, mesh };
    });

    planet.filter(c => !c.core).forEach(cube => getTerrain(cube, { scene }, 0));

    return planet;
}
