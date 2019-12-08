import * as React from 'react';
import { Vector3, MeshBuilder, Animation } from 'babylonjs';
import Canvas from './Canvas'; // import the component above linking to file we just created.

import createCamera from './createCamera';
import createLight from './createLight';
import getMatrix from './getMatrix';
import showAxis from './showAxis';
import { getTerrain } from './terrain';

class Scene extends React.Component {
    sceneDidMount = generateScene.bind(this);

    render() {
        return <Canvas sceneDidMount={this.sceneDidMount} />;
    }
}

export default Scene;

function generateScene(e) {
    const { scene, engine } = e;
    const diameter = 0;

    engine.runRenderLoop(() => scene && scene.render());

    // This creates and positions a free camera (non-mesh)
    createCamera(e, ((diameter + 1) * 1.2) * 5);
    createLight(e, 'hemi', 'sun', 0.8, [1, 4, 0]);
    // createLight(e, 'point', 'point1', 0.8, [0, 6, -1]);

    showAxis(3, scene);
    const earth = getMatrix(e, diameter);


    var CoR_At = new Vector3(0, 0, 0);
    var sphere = MeshBuilder.CreateSphere('sphere', { diameter: 0.25 }, scene);
    sphere.position = CoR_At;


    earth
        .filter(c => !c.core)
        .forEach((cube, i) => getTerrain(cube, e, 0));


    // // TicTakToe tech-ton-nix  tec-ton-ics

    // A.forEach(key => {
    //     var s = 3.5;
    //     var box = boxes[key];
    //     // box.parent = sphere;
    //     box.scaling = new Vector3(s, s, s);
    //     box.material = m['matA'];
    // });

    // sphere.animations = [];
    // sphere.animations.push(anim)
    //

    window.earth = earth;
    window.turn = function(dim = 'x', n = 1) {
        let array = Array(9);
        array = [...array].map((_, i) => i + 9 + 9);
        array.forEach(n => {
            var box = earth['C' + (n % 9)];
            box.parent = sphere;
        });
        var anim = new Animation(
            'spin',
            `rotation.${dim}`,
            25,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        var frames = [
            { frame: 0, value: 0 },
            { frame: 100, value: Math.PI / n }
        ];

        anim.setKeys(frames);
        scene.beginDirectAnimation(sphere, [anim], 0, 25 * 4, false);
    };
}
