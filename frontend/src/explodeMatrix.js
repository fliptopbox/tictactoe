import {Vector3, Space} from 'babylonjs';
import BezierEasing from 'bezier-easing';

export default explodeMatrix;
function explodeMatrix({scene, earth}, score, amount = 2, duration = 250) {
    let players = {}; // playerId indexed dictionary
    score.rank.forEach((p, i) => (players[p.playerId] = {...p, rank: i}));
    const winner = score.rank[0].playerId;

    earth
        .filter(cube => cube.owner || cube.owner === winner)
        .map(cube => {
            cube.mesh.displace = players[cube.owner].rank;
            return cube.mesh;
        })
        .forEach(m => {
            const {x, y, z} = m.absolutePosition;
            const {displace} = m;

            if (!displace) return;

            animationStack(scene, m, [x, y, z], displace, duration);
        });
}

function animationStack(scene, mesh, xyz, size, time) {
    var easing = BezierEasing(0.13, 0.69, 0.58, 1);
    const [x, y, z] = xyz;
    const frames = 30;
    const steps = (time / frames) >> 0;
    const total = steps * frames;
    const pos = new Vector3(x, y, z);
    let done = false;

    for (let i = 0; i <= total; i += steps) {
        const temp = (easing(i / total) * 1000 >> 0) / 1000;
        // console.log(i, size, temp * size);
        setTimeout(() => mesh.translate(pos, temp * size, Space.WORLD), i);

        if (i >= total && !done) {
            rotationLoop(scene, () => {
                done = true;
                const spin = rnd(5, 0.1) * 1024;
                const [x, y, z] = [rnd(3, -3), rnd(1, -1), 0];
                mesh.rotate(new Vector3(x, y, z), Math.PI / spin, Space.LOCAL);
            });
        }
    }
}

function rotationLoop(scene, fn) {
    scene.registerBeforeRender(fn);
}

function rnd(max, min = 0, float = true) {
    const n = Math.random() * max + min;
    return float ? n : n >> 0;
}
