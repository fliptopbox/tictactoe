import {rnd} from './utilities';

export default getRandomRotation;
function getRandomRotation(radius) {
    const rotation = ['x', 'y', 'z'][rnd(2, 0, false)];
    const extent = Math.round((rnd(radius * 2, 0) - radius) * 2) / 2;
    const amount = [-1, 1][rnd(1, 0, false)];

    return {rotation, extent, amount};
}
