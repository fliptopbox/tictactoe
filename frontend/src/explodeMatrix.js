import { Vector3, Space } from 'babylonjs';
import BezierEasing from 'bezier-easing';

export default explodeMatrix;
function explodeMatrix(
    { scene, earth },
    score,
    multiplier = 0.18,
    duration = 750
) {
    let players = {}; // playerId indexed dictionary
    score.rank.forEach((p, i) => (players[p.playerId] = { ...p, rank: i }));
    const winner = score.rank[0].playerId;

    earth
        .filter(cube => cube.owner || cube.owner === winner)
        .map(cube => {
            cube.mesh.displace = players[cube.owner].rank;
            return cube.mesh;
        })
        .forEach(m => {
            const { x, y, z } = m.absolutePosition;
            const { displace } = m;

            if (!displace) return;

            console.log('displace', m.id, displace, duration, multiplier);
            animationStack(
                scene,
                m,
                [x, y, z],
                displace * multiplier,
                duration
            );
        });
}

function animationStack(scene, mesh, xyz, distance, time) {
    // var easing = BezierEasing(0.13, 0.69, 0.58, 1);
    var easing = BezierEasing(0.25, 5, 0, 1);
    const [x, y, z] = xyz;
    const frames = 50;
    const steps = (time / frames) >> 0;
    const total = steps * frames;
    const pos = new Vector3(x, y, z);

    let lastFloat = 0;
    let done = false;

    for (let i = 0; i <= total; i += steps) {
        let floatNormal = easing(i / total);
        let value = 0;

        // translate value is scalar, convert the normal
        // into positive (explode) or negative (implode) value
        value =
            floatNormal >= lastFloat
                ? (value = floatNormal * distance)
                : distance * (distance * lastFloat * (floatNormal - lastFloat));

        // console.log(
        //     padd(i),
        //     padd(((distance * 1000) >> 0) / 1000),
        //     padd(((lastFloat * 1000) >> 0) / 1000),
        //     padd(((value * 1000) >> 0) / 1000),
        //     padd(((floatNormal * 1000) >> 0) / 1000)
        // );

        lastFloat = floatNormal;

        setTimeout(() => mesh.translate(pos, value, Space.WORLD), i);

        if (i >= total && !done) {
            done = true;
            const spin = rnd(5, 0.1) * 360; // larger is slower
            const [x, y, z] = [rnd(2, -2), rnd(2, -2), rnd(2, -2)];
            rotationLoop(scene, () => {
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

// function padd(string, len = 8) {
//     return String(` ${string}      `).slice(0, len);
// }
