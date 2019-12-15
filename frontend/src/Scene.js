import * as React from 'react';
import {
    Mesh,
    Color3,
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

import './ui.css';

class Scene extends React.Component {
    constructor() {
        super();
        this.state = {
            playDelay: 560, // non-human turn delay
            rotationFrames: 50, // milseconds of animation
            focusOnOccupy: true, // move camera to occupaion cube
            blur: false,
            player: 0,
            players: [
                {
                    material: 'black',
                    playerId: 111,
                    twist: 0,
                    alias: '@black',
                    spiecies: 0
                },
                {
                    material: 'white',
                    playerId: 222,
                    twist: 0,
                    alias: '@white',
                    spiecies: 1
                },
                {
                    material: 'red',
                    playerId: 333,
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

    executeNonHumanPlayer = player => {
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
                executeNonHumanPlayer(player);
                return;
            }
            // turn always ends with "occupy"
            occupy(cube.mesh.id);
        }, playDelay);
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

    updateScore() {
        const { earth } = this;
        if (!earth) return null;

        const array = earth.filter(c => !c.owner && c.type);
        console.log('cubes free', array.length);

        if (!array.length) {
            console.log('game over');
            window.alert('game over');
        }

        return array.length;
    }

    occupy = id => {
        const index = id.replace(/^m/i, '');
        const cube = this.earth[index];

        if (cube.owner) return;

        const m = materials(this);
        const { player, players } = this.state;
        const currentPlayer = players[player];
        const playerMaterial = currentPlayer.material;
        const {x,y,z, axis} = cube;
        const coord = [x,y,z].join(",");
        const hash = axis ? "#" : "";

        currentPlayer.twist += 1;

        cube.owner = currentPlayer.playerId;
        cube.mesh.material = m(playerMaterial, `${id}(${coord})${hash}`);

        console.log('occupy', id, cube);

        // does the game continue?
        if (this.updateScore()) {
            this.toggleToNextPlayer();
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
        const { player, players } = this.state;
        const currentPlayer = players[player];
        let { alias, material, spiecies, twist } = currentPlayer;

        const style = { background: material };
        const free = this.updateScore();
        spiecies = ['human', 'random', 'AI'][spiecies];

        const showTwist = twist ? (
            <div className="ui-player-twist">twist: {twist || 'none'}</div>
        ) : null;

        const showFree =
            free !== null ? (
                <div className="ui-player-free">Free: {free || 'none'}</div>
            ) : null;

        return (
            <div className="ui-player">
                <div className="ui-player-icon">
                    <div className="ui-player-color" style={style}></div>
                    <div className="ui-player-alias">{alias}</div>
                    <div className="ui-player-spiecies">{spiecies}</div>
                </div>

                {showTwist}
                {showFree}
            </div>
        );
    }

    render() {
        console.log('render', this.state.blur);
        const opts = {};
        return (
            <div className="ui-container">
                <div className="ui">{this.getCurrentPlayerInfo()}</div>
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
    god.emissiveColor = new Color3(1,0,0);
    god.visibility = 1;
    god.alpha = 0.2;
    var godrays = new VolumetricLightScatteringPostProcess(
        'godrays',
        1.0,
        camera,
        god,
        100,
        Texture.BILINEAR_SAMPLINGMODE,
        engine,
        false
    );

    // godrays._volumetricLightScatteringRTT.renderParticles = true;

    // godrays.exposure = 0.1;
    // godrays.decay = 0.96815;
    // godrays.weight = 0.98767;
    // godrays.density = 0.996;

    // // set the godrays texture to be the image.
    // godrays.mesh.material.diffuseTexture = new Texture(
    //     'textures/BJS-logo_v3.png',
    //     scene
    // );
    // godrays.mesh.material.diffuseTexture.hasAlpha = true;




    // this.earth = earth;
    // this.camera = camera;

    scene.clearColor = new Color3(0.05, 0.05, 0.05);
    scene.onPointerObservable.add(pointerEvents.bind(this));

    earth.filter(c => !c.core).forEach(cube => getTerrain(cube, { scene }, 0));

    window.earth = earth;
}

function rnd(max, min = 0) {
    return (Math.random() * max + min) >> 0;
}
