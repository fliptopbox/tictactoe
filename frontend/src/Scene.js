import * as React from 'react';
import {Color3, Vector3} from 'babylonjs';
import Canvas from './Canvas'; // import the component above linking to file we just created.

import materials from './materials';
import createCamera from './createCamera';
import createLight from './createLight';
import getMatrix from './getMatrix';
import showAxis from './showAxis';
import {getTerrain} from './terrain';
import pointerEvents from './pointerEvents';
import rotatePlane from './rotatePlane';
import getScore from './calculateScore';
import explodeMatrix from './explodeMatrix';
import radialLineCluster from './radialLineCluster';
import createCoreMesh from './createCoreMesh';
import {rnd} from './utilities';
import gameState from './gameState';

import Introduction from './Introduction';
import Player from './Player';

import './ui.css';

class Scene extends React.Component {
    constructor() {
        super();
        this.state = {
            showIntro: true, 
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
            radius: rnd(2, 1, false)
        };

        console.log(this.state.radius);
        this.toggleToNextPlayer.bind(this);
    }

    executeNonHumanPlayer = (player, ms = 0) => {
        // this.setState({ player });

        const {earth, rotate, radius, executeNonHumanPlayer, occupy} = this;
        const diameter = radius + 2;
        const array = earth.filter(c => !c.owner && c.type);
        const cube = array[rnd(array.length - 1, 0, false)];
        const {players, playDelay} = this.state;
        const currentPlayer = players[player];

        // with the non-human occupy OR twist
        // 33% chance of twist
        const willTwist = currentPlayer.twist
            ? rnd(9, 0, false) % 3 === 0
            : false;

        // potential rotation params
        const rotation = ['x', 'y', 'z'][rnd(2, 0, false)];
        const extent = rnd(radius, -radius, false);
        const amount = 1; // rnd(3, 1, false);

        let totalDelay = willTwist ? playDelay + ms : 50;

        setTimeout(function() {
            if (willTwist) {
                console.log('twisting', rotation, extent, amount);
                rotate({rotation, extent, amount});
                executeNonHumanPlayer(player, ms + 150);
                return;
            }
            // turn always ends with "occupy"
            occupy(cube.mesh.id);
        }, totalDelay);
    };

    rotate = ({rotation, extent, amount}) => {
        const {scene, earth} = this;
        const {player, players, rotationFrames} = this.state;
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

        let {player, players, playDelay} = this.state;
        const {executeNonHumanPlayer} = this;
        player = (player + 1) % players.length;
        const nextPlayer = players[player];
        const bgcolor = nextPlayer.material;

        console.log(
            '%c%s',
            `background: ${bgcolor}; color: #666; padding: 3px;`,
            nextPlayer.alias,
            nextPlayer.spiecies
        );

        this.setState({player});
        if (nextPlayer.spiecies) {
            // delay to prevent multiple rotations
            return setTimeout(function() {
                executeNonHumanPlayer(player);
            }, playDelay);
        }
    };

    getCurrentPlayer() {
        let {player, players} = this.state;
        return players[player];
    }

    updateScore() {
        const {earth} = this;
        const {finished} = this.state;

        if (!earth || finished) return null;

        const {playerId} = this.getCurrentPlayer();
        const score = getScore(earth, playerId);
        const array = earth.filter(c => !c.owner && c.type);
        // console.log('cubes free', array.length);
        // console.log(score);

        if (score.finished) {
            console.log('game over');
            this.setState({finished: true});
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
        const {playerId} = currentPlayer;
        const {x, y, z, axis} = cube;

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
            explodeMatrix({scene: this.scene, earth: this.earth}, score);
        }
    };

    sceneDidMount = e => {
        this.scene = e.scene;
        this.canvas = e.canvas;
        this.engine = e.engine;

        const {radius} = this.state;
        // this.camera = createCamera(e, (radius + 1) * 3.6);
        this.camera = createCamera(e, this );
        this.earth = getMatrix(e, radius);
        this.generateScene = generateScene.bind(this);

        return generateScene.call(this);
    };

    getCurrentPlayerInfo() {
        // render all contestants

        const {players, player} = this.state;

        return players.map((obj, n) => (
            <Player key={n} player={obj} current={n === player} />
        ));
    }

    render() {
        const opts = {};
        const {earth} = this;
        const hexes = !earth
            ? null
            : earth
                  .filter(c => c.type)
                  .map((o, i) => {
                      const {hexColor} = o.mesh.material;
                      const bgcolor = {background: hexColor};
                      return (
                          <span
                              className="swatch"
                              key={'hx' + i}
                              style={bgcolor}></span>
                      );
                  });

        const array = !earth ? null : earth.filter(c => !c.owner && c.type);
        const showLogo = !this.state.showIntro ? null : <Introduction />;

        return (
            <div className="ui-container">
                {showLogo}
                <div className="ui">
                    <div className="ui-cta-start">
                        <span onClick={() => window.camera.start(1200)}>
                            START
                        </span>
                    </div>
                    <div className="ui-terrain-count">
                        {array && array.length}
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
    let {scene, engine, earth, camera} = this;
    const {radius} = this.state;

    engine.runRenderLoop(() => scene && scene.render());

    showAxis((radius + 1) * 3, scene);
    createLight({scene}, 'hemi', 'sun', 0.25, [0.6, 0.7, 0.7], [0.5, 0.5, 0.5]);
    createLight({scene}, 'point', 'point1', 0.4, [0, 6, -1]);
    createLight({scene}, 'point', 'core1', 1.4, [0, 0, 0]);

    scene.clearColor = new Color3(0.1, 0.1, 0.1);
    scene.onPointerObservable.add(pointerEvents.bind(this));

    // bump the state, to propogate the earth data
    // earth = earth.filter(cube => cube.type);
    earth = earth
        .filter(c => !c.core)
        .forEach(cube => getTerrain(cube, {scene}, 0));

    // delete all non-playable cubes
    console.log(earth);
    this.setState({ready: true});

    radialLineCluster(scene);
    createCoreMesh({scene, engine, camera});

    window.earth = earth;
    window.gameState = gameState(this);
}
