import { Vector3, Space } from 'babylonjs';

export default explodeMatrix;
function explodeMatrix({ scene, earth }, score, amount = 2, duration = 250) {
    let players = {}; // playerId indexed dictionary
    score.rank.forEach((p, i) => (players[p.playerId] = { ...p, rank: i }));
    const winner = score.rank[0].playerId;

    earth
        .filter(cube => cube.owner || cube.owner === winner)
        .map(cube => {
            cube.mesh.displace = players[cube.owner].rank ** 1.5;
            return cube.mesh;
        })
        .forEach(m => {
            const { x, y, z } = m.absolutePosition;
            const { displace } = m;

            if (!displace) return;

            animationStack(scene, m, [x, y, z], displace * amount, duration);
        });
}

function animationStack(scene, mesh, xyz, size, time) {
    const [x, y, z] = xyz;
    for (let i = 0; i <= time; i += (time / 10) >> 0) {
        const n = Number(i);
        setTimeout(() => {
            const temp = (n / time) * size;
            mesh.translate(new Vector3(x, y, z), temp, Space.WORLD);
            if (n >= time) {
                rotationLoop(scene, () => {
                    const array = [rnd(3, -3), rnd(1, -1), 0];
                    const spin = rnd(5, 0.1) * 1024;
                    const [x, y, z] = array;
                    mesh.rotate(
                        new Vector3(x, y, z),
                        Math.PI / spin,
                        Space.LOCAL
                    );
                });
            }
        }, Number(i));
    }
}
function rotationLoop(scene, fn) {
    scene.registerBeforeRender(fn);
}

function rnd(max, min = 0, float = true) {
    const n = Math.random() * max + min;
    return float ? n : n >> 0;
}
