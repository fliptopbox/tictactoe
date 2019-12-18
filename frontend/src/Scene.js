import * as React from 'react';
import {
    Mesh,
    Color3,
    Vector3,
    Texture,
    VolumetricLightScatteringPostProcess
} from 'babylonjs';
import Canvas from './Canvas'; // import the component above linking to file we just created.

import materials from './materials';
import createCamera from './createCamera';
import createLight from './createLight';
import getMatrix from './getMatrix';
import showAxis from './showAxis';
import { getTerrain } from './terrain';
import pointerEvents from './pointerEvents';
import rotatePlane from './rotatePlane';
import getScore from './calculateScore';
import explodeMatrix from './explodeMatrix';

import Player from './Player';
import './ui.css';

class Scene extends React.Component {
    constructor() {
        super();
        this.state = {
            playDelay: 550, // non-human turn delay
            rotationFrames: 50, // milseconds of animation
            focusOnOccupy: true, // move camera to occupaion cube
            twistsPerPlay: 2,
            showCubeCoords: false,
            player: 0,
            finished: false,
            players: [
                {
                    material: 'black',
                    playerId: '111',
                    twist: 0,
                    alias: '@black',
                    spiecies: 1
                },
                {
                    material: 'white',
                    playerId: '222',
                    twist: 0,
                    alias: '@white',
                    spiecies: 1
                },
                {
                    material: 'red',
                    playerId: '333',
                    twist: 0,
                    alias: '@red',
                    spiecies: 1
                }
            ],
            toggleOnDoubleTap: true,
            radius: 0
        };
        this.toggleToNextPlayer.bind(this);
    }

    executeNonHumanPlayer = (player, ms = 0) => {
        // this.setState({ player });

        const { earth, rotate, executeNonHumanPlayer, occupy } = this;
        const array = earth.filter(c => !c.owner && c.type);
        const cube = array[(Math.random() * array.length) >> 0];
        const { players, playDelay } = this.state;
        const currentPlayer = players[player];
        const twist = [1, 0, 0, 1, 0][(Math.random() * 5) >> 0];
        const rotation = ['x', 'y', 'z'][rnd(2, 0)];
        const size = [3, 5, 7, 9][this.radius];
        const extent = rnd(size, 0) - ((size / 2) >> 0);
        const amount = [1, 2, 3][rnd(2, 0)];

        setTimeout(function() {
            if (currentPlayer.twist && twist) {
                rotate({ rotation, extent, amount });
                executeNonHumanPlayer(player, ms + 150);
                return;
            }
            // turn always ends with "occupy"
            occupy(cube.mesh.id);
        }, playDelay + ms);
    };

    rotate = ({ rotation, extent, amount }) => {
        const { scene, earth } = this;
        const { player, players, rotationFrames } = this.state;
        const currentPlayer = players[player];

        if (!currentPlayer.twist) return;

        let maxAmount = Math.min(currentPlayer.twist, Math.abs(amount));
        maxAmount = maxAmount * amount > 0 ? 1 : -1; // preserve the sign

        rotatePlane(scene, earth, rotation, extent, maxAmount, rotationFrames);

        currentPlayer.twist -= 1;
        // this.setState({ players });
    };

    toggleToNextPlayer = () => {
        if (!this.state.toggleOnDoubleTap) return;

        let { player, players, playDelay } = this.state;
        const { executeNonHumanPlayer } = this;
        player = (player + 1) % players.length;
        const nextPlayer = players[player];
        const bgcolor = nextPlayer.material;

        console.log(
            '%c%s',
            `background: ${bgcolor}; color: #666; padding: 3px;`,
            nextPlayer.alias,
            nextPlayer.spiecies
        );

        this.setState({ player });
        if (nextPlayer.spiecies) {
            // delay to prevent multiple rotations
            return setTimeout(function() {
                executeNonHumanPlayer(player);
            }, playDelay);
        }
    };

    getCurrentPlayer() {
        let { player, players } = this.state;
        return players[player];
    }

    updateScore() {
        const { earth } = this;
        const { finished } = this.state;

        if (!earth || finished) return null;

        const { playerId } = this.getCurrentPlayer();
        const score = getScore(earth, playerId);
        const array = earth.filter(c => !c.owner && c.type);
        console.log('cubes free', array.length);
        console.log(score);

        if (score.finished) {
            console.log('game over');
            this.setState({ finished: true });
        }

        return score;
    }

    occupy = (id, emulate = null) => {
        const {
            player,
            players,
            finished,
            twistsPerPlay,
            showCubeCoords
        } = this.state;

        if (finished) {
            alert('The game is over');
            return;
        }

        const index = id.replace(/^m/i, '');
        const cube = this.earth[index];

        if (emulate === null && cube.owner) {
            console.warn('already occupied', id, emulate);
            return;
        }

        const m = materials(this);
        let currentPlayer = emulate === null ? players[player] : emulate;
        const playerMaterial = currentPlayer.material;
        const { playerId } = currentPlayer;
        const { x, y, z, axis } = cube;

        cube.owner = currentPlayer.playerId;

        if (showCubeCoords) {
            const coord = [x, y, z].join(',');
            const hash = axis ? '#' : '';
            cube.mesh.material = m(playerMaterial, `${id}(${coord})${hash}`);
        }
        cube.mesh.material = m(playerMaterial); //, `${id}(${coord})${hash}`);
        const scale = 1.08;
        cube.mesh.scaling = new Vector3(scale, scale, scale);

        console.log('occupy', playerId, id, cube);

        // if game data is importing do not toggle to next player
        if (emulate !== null) return;

        currentPlayer.twist += twistsPerPlay;

        // does the game continue?
        const score = this.updateScore();
        if (!score.finished) {
            this.toggleToNextPlayer();
        } else {
            explodeMatrix(
                { scene: this.scene, earth: this.earth },
                score.leader,
                0.25
            );
        }
    };

    sceneDidMount = e => {
        this.scene = e.scene;
        this.canvas = e.canvas;
        this.engine = e.engine;

        const { radius } = this.state;
        this.camera = createCamera(e, (radius + 1) * 3.6);
        this.earth = getMatrix(e, radius);

        return generateScene.call(this);
    };

    getCurrentPlayerInfo() {
        // render all contestants

        const { players, player } = this.state;

        return players.map((obj, n) => (
            <Player key={n} player={obj} current={n === player} />
        ));
    }

    render() {
        const opts = {};
        // const { earth } = this;

        let total = 0,
            hexes = null,
            cubes = null,
            free,
            percent = 0;

        if (this.earth) {
            cubes = this.earth.filter(o => o.type);
            total = cubes.length;
            free =
                this.earth.reduce(
                    (acc, curr) => acc + (!curr.type || !curr.owner ? 1 : 0),
                    0
                ) - 1;

            hexes = !free
                ? null
                : cubes.slice(-free).map((o, i) => {
                      return (
                          <span
                              className="swatch"
                              key={'hex' + i}
                              style={{ background: o.mesh.hex }}></span>
                      );
                  });
            percent = 100 - (((free / total) * 100) >> 0);
            console.log('hex', hexes && hexes.length);
        }

        console.log('render', total, free, percent);
        const style = { width: `${percent}%` };

        return (
            <div className="ui-container">
                <div className="ui">
                    <div className="ui-players" style={style}>
                        {this.getCurrentPlayerInfo()}
                    </div>
                    <div className="ui-terrain">{hexes}</div>
                </div>
                <Canvas sceneDidMount={this.sceneDidMount} opts={opts} />;
            </div>
        );
    }
}

export default Scene;

function generateScene() {
    // const that = this;
    // const { scene, canvas, engine } = e;
    const { scene, engine, earth, camera } = this;
    const { radius } = this.state;

    engine.runRenderLoop(() => scene && scene.render());

    showAxis((radius + 1) * 3, scene);
    createLight(
        { scene },
        'hemi',
        'sun',
        0.25,
        [0.6, 0.7, 0.7],
        [0.5, 0.5, 0.5]
    );
    createLight({ scene }, 'point', 'point1', 0.4, [0, 6, -1]);
    createLight({ scene }, 'point', 'core1', 1.4, [0, 0, 0]);

    const god = earth[13].mesh;
    god.billboardMode = Mesh.BILLBOARDMODE_ALL;
    god.emissiveColor = new Color3(1, 0, 0);
    god.visibility = 1;
    god.alpha = 0.2;
    new VolumetricLightScatteringPostProcess(
        'godrays',
        1.0,
        camera,
        god,
        100,
        Texture.BILINEAR_SAMPLINGMODE,
        engine,
        false
    );

    scene.clearColor = new Color3(0.1, 0.1, 0.1);
    scene.onPointerObservable.add(pointerEvents.bind(this));

    // bump the state, to propogate the earth data
    earth.filter(c => !c.core).forEach(cube => getTerrain(cube, { scene }, 0));
    this.setState({ ready: true });

    window.earth = earth;
    window.getGameState = object => getGameState.call(this, object);
    window.setGameState = k => setGameState.call(this, k);
}

function rnd(max, min = 0) {
    return (Math.random() * max + min) >> 0;
}

function setGameState(key) {
    // export state and matrix
    let { state, earth } = this;
    const matrix = earth.map(o => {
        delete o.mesh;
        return { ...o };
    });

    const json = {
        state,
        matrix
    };

    localStorage[key] = JSON.stringify(json, null, 4);
    return json;
}

function getGameState(object) {
    if (typeof object === 'string') {
        object = localStorage[object] || object;
        object = JSON.parse(object);
    }

    const occupy = this.occupy.bind(this);
    let { state, matrix } = object;

    // merge the JSON data into the existing terrain data
    // and render the updated cube
    this.state = { ...this.state, ...state };

    const emulate = {};
    this.state.players.forEach(p => (emulate[p.playerId] = p));

    matrix = matrix.filter(o => o.owner);
    matrix.forEach(row => {
        const { id, owner } = row;
        this.earth[id] = {
            ...this.earth[id],
            ...row
        };

        occupy.call(this, `m${id}`, emulate[owner]);
    }, this);
}
