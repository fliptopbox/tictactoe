import * as React from 'react';
import { Color3, Vector3 } from 'babylonjs';
import Canvas from './Canvas';

import { rnd } from './utilities';
import materials from './materials';
import createCamera from './createCamera';
import createLight from './createLight';
import getMatrix from './getMatrix';
import showSceneAxis from './showAxis';
import pointerEvents from './pointerEvents';
import rotatePlane from './rotatePlane';
import getScore from './calculateScore';
import explodeMatrix from './explodeMatrix';
import radialLineCluster from './radialLineCluster';
import createCoreMesh from './createCoreMesh';
import gameState from './gameState';
import getRandomRotation from './getRandomRotation';

import Player from './Player';
import Settings from './Settings';
import Status from './Status';

import './ui.scss';

class Scene extends React.Component {
    constructor() {
        super();
        this.state = {
            showAxis: false,
            // showIntro: true,
            showSettings: true,
            playDelay: 550, // non-human turn delay
            rotationFrames: 50, // milseconds of animation
            focusOnOccupy: true, // move camera to occupaion cube
            twistsPerPlay: 2,
            toggleOnDoubleTap: true,
            showCubeCoords: false,

            inProgress: false,
            finished: false,

            radius: 1,
            player: 0,
            players: null
        };

        // zero state players (for intro)
        // TODO a better temp player simulator
        this.state.players = [
            {
                material: 'black',
                playerId: '111',
                twist: 0,
                alias: 'Jack Black',
                spiecies: 1
            },
            {
                material: 'white',
                playerId: '222',
                twist: 0,
                alias: 'Walter White',
                spiecies: 1
            }
        ];

        console.log('initial radius', this.state.radius);
        this.toggleToNextPlayer.bind(this);
    }

    executeNonHumanPlayer = (player, ms = 0) => {
        // this.setState({ player });

        const { earth, rotate, executeNonHumanPlayer, occupy } = this;
        // const diameter = radius + 2;
        const array = earth.filter(c => !c.owner && c.type);
        const cube = array[rnd(array.length - 1, 0, false)];
        const { players, playDelay, radius } = this.state;
        const currentPlayer = players[player];

        // with the non-human occupy OR twist 33% chance of twist
        const willTwist = currentPlayer.twist
            ? rnd(9, 0, false) % 3 === 0
            : false;

        let totalDelay = willTwist ? playDelay + ms : 50;

        setTimeout(function() {
            if (willTwist) {
                rotate(getRandomRotation(radius));
                executeNonHumanPlayer(player, ms + 150);
                return;
            }

            // turn always ends with "occupy"
            occupy(cube.mesh.id);
        }, totalDelay);
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
        let { finished, players } = this.state;

        if (!earth || finished) return null;

        const { playerId } = this.getCurrentPlayer();
        const score = getScore(earth, playerId);

        score.rank.forEach(item => {
            // updated state player score
            const index = players.findIndex(
                row => row.playerId === item.playerId
            );
            if (index < 0) {
                console.warn("can't find playerId", item.playerId);
                return;
            }
            players[index].accumulated = item.accumulated;
        });

        finished = score.finished === true;
        this.setState({ players, finished });
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
        const scaleUpBy = 1.165; // upsize cube

        cube.owner = currentPlayer.playerId;

        if (showCubeCoords) {
            const coord = [x, y, z].join(',');
            const hash = axis ? '#' : '';
            cube.mesh.material = m(playerMaterial, `${id}(${coord})${hash}`);
        }
        cube.mesh.material = m(playerMaterial); //, `${id}(${coord})${hash}`);
        cube.mesh.scaling = new Vector3(scaleUpBy, scaleUpBy, scaleUpBy);

        console.log('Occupy', playerId, id, cube);

        // if game data is importing do not toggle to next player
        if (emulate !== null) return;

        currentPlayer.twist += twistsPerPlay;

        // does the game continue?
        const score = this.updateScore();
        if (!score.finished) {
            this.toggleToNextPlayer();
        } else {
            explodeMatrix({ scene: this.scene, earth: this.earth }, score);
        }
    };

    sceneDidMount = e => {
        this.scene = e.scene;
        this.canvas = e.canvas;
        this.engine = e.engine;

        const { radius } = this.state;
        // this.camera = createCamera(e, (radius + 1) * 3.6);
        this.camera = createCamera(e, this);
        this.earth = getMatrix(e, radius);
        this.generateScene = generateScene.bind(this);

        window.earth = this.earth;
        return generateScene.call(this);
    };

    getCurrentPlayerInfo() {
        // render all contestants

        const { players, player } = this.state;

        return players.map((obj, n) => (
            <Player key={n} player={obj} current={n === player} />
        ));
    }

    saveSettings = settings => {
        const { radius, players } = settings;
        const next = {
            ...this.state,
            radius,
            players,
            finished: false,
            inProgress: true
        };

        this.setState(next, () => this.saveAndStart(players, radius));
    };

    updateEarth = radius => {
        console.log('re-generate earth matrix', radius);
        const scene = this.scene;
        this.earth = getMatrix({ scene }, radius);
        window.earth = this.earth;
    };

    render() {
        const opts = {};
        const { earth, state } = this;

        return (
            <div className="ui-container">
                <div className="ui-branding">FLIPTOPBOX</div>
                <Status
                    state={state}
                    earth={earth}
                    handleRestart={this.restart.bind(this)}
                />
                <Settings
                    state={state}
                    saveSettings={this.saveSettings}
                    updateEarth={this.updateEarth}
                />
                <Canvas sceneDidMount={this.sceneDidMount} opts={opts} />;
            </div>
        );
    }

    restart() {
        console.log('Restart');
        let { players, radius } = this.state;

        // reset the accumulated score and twist
        players = players.map(p => {
            p.twist = 0;
            p.accumulated = 0;
            return p;
        });

        // re-generate the earth
        this.updateEarth(radius);

        this.setState({
            showSettings: true,
            showIntro: false,
            inProgress: false,
            finished: false,
            players
        });
    }

    saveAndStart(players, radius) {
        const next = {
            ...this.setState,
            showSettings: false,
            showIntro: false,
            inProgress: true,
            radius,
            players
        };
        this.setState(next, () => {
            window.camera.start(1200);
            const humans = players.reduce(
                (a, c) => a + (c.spiecies === 0 ? 1 : 0),
                0
            );
            if (!humans) this.executeNonHumanPlayer(0);
        });
    }
}

export default Scene;

function generateScene() {
    // const that = this;
    // const { scene, canvas, engine } = e;
    let { scene, engine, camera, earth } = this;
    const { radius, showAxis } = this.state;

    engine.runRenderLoop(() => scene && scene.render());

    showSceneAxis((radius + 1) * 3, scene, showAxis);
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

    scene.clearColor = new Color3(0.1, 0.1, 0.1);
    scene.onPointerObservable.add(pointerEvents.bind(this));

    this.setState({ ready: true });

    radialLineCluster(scene);
    createCoreMesh({ scene, engine, camera, earth });

    window.gameState = gameState(this);
}
