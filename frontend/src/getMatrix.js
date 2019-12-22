import { MeshBuilder, Vector3 } from "babylonjs";
import createWorld from "./createWorld";

export default getMatrix;
function getMatrix({ scene }, diameter = 1) {
    const { CreateBox } = MeshBuilder;
    const planet = createWorld(diameter).matrix.map(cube => {

        const { id, x, y, z } = cube;
        const size = 0.9;

        var mesh = CreateBox(id, { size }, scene);
        mesh.position = new Vector3(x, y, z);

        return {
            ...cube,
            mesh
        };
    });

    return planet;
}
