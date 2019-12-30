import antagonist from './bad-guys';
import { rnd, uuid } from './utilities';

let serialno = 0;
let history = [];

const materialKeys = ['black', 'white', 'red', 'grey'];

export default createPlayer;
function createPlayer(name, human) {
    const playerId = uuid('p');
    const material = getNextMaterial();
    const spiecies = human ? 0 : 1;
    const alias = name || getRandomName();

    return {
        material,
        playerId,
        twist: 0,
        alias,
        spiecies
    };
}

function getRandomName() {
    // filter used names
    const past = antagonist.length / 4 >> 0;
    const names = antagonist.filter(v => !(history.indexOf(v)+1));
    const n = names.length - 1;
    const text = names[rnd(n, 0, false)];

    // only remember the past 18 used names
    history.push(text);
    history = history.slice(-past);

    return text;
}

function getNextMaterial() {
    let n = materialKeys.length;
    let color = materialKeys[serialno % n];
    serialno += 1;
    return color;
}


getRandomName(); //?