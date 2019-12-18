import { Vector3, Space } from 'babylonjs';

export default explodeMatrix;
function explodeMatrix(
    { scene, earth },
    winner = '111',
    amount = 7,
    duration = 375
) {
    const meshes = earth
        .filter(cube => !cube.type || cube.owner !== winner)
        .map(cube => cube.mesh);

    meshes.forEach(m => {
        const { x, y, z } = m.absolutePosition;
        stack(scene, m, [x, y, z], amount, duration);
    });
}

function stack(scene, mesh, xyz, size, time) {
    const [x, y, z] = xyz;
    const t = 0.5;
    for (let i = 0; i <= time; i += (time / 20) >> 0) {
        const n = Number(i);
        setTimeout(() => {
            const temp = (n / time) * size;
            mesh.translate(new Vector3(x * t, y * t, z * t), temp, Space.WORLD);
            if (n >= time) {
                rotationLoop(scene, () =>
                    mesh.rotate(
                        new Vector3(-1, 3, 0),
                        Math.PI / (24 * 1024),
                        Space.LOCAL
                    )
                );
            }
        }, Number(i));
    }
}
function rotationLoop(scene, fn) {
    scene.registerBeforeRender(fn);
}
