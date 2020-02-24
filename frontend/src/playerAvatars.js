import * as React from 'react';
import { rnd, uuid } from './utilities';
import antagonist from './bad-guys';

import './avatar.scss';


let history = [];
const materials = ['black', 'white', 'red', 'grey'];
const playerTypes = ['human', 'robot'];
const numbers = ['zero', 'one', 'two', 'three'];

export default playerAvatars;
function playerAvatars(opponents = 2, nonhuman = 1) {

    const avatars = [...Array(opponents)].map((_, i, a) => {

        const playerId = uuid("p");
        const alias = getRandomName();
        const spiecies = a.length - nonhuman - i > 0 ? 0 : 1;
        const material = materials[i];

        const classes = [
            'avatar-icon',
            'avatar-' + playerTypes[spiecies],
            'avatar-' + materials[i],
            'avatar-' + numbers[i]
        ];

        // <div className="avatar-label">{alias}</div>

        const el = (
            <div key={i} className="avatar-player">
                <div className={classes.join(' ')} />
            </div>
        );

        return {
            material,
            playerId,
            twist: 0,
            alias,
            spiecies,
            el
        };
    });

    return avatars;
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
