import * as React from 'react';
import { Vector3, MeshBuilder, Animation } from 'babylonjs';
import Canvas from './Canvas'; // import the component above linking to file we just created.

import materials from './materials';
import createCamera from './createCamera';
import createLight from './createLight';
import getBoxes from './boxes';

import showAxis from './showAxis';

class Scene extends React.Component {
    sceneDidMount = e => {
        const { scene, engine } = e;
        engine.runRenderLoop(() => scene && scene.render());

        // This creates and positions a free camera (non-mesh)
        createCamera(e);
        createLight(e, 'hemi', 'sun', 0.8, [1, 4, 0]);
        createLight(e, 'point', 'point1', 0.8, [0, 6, -1]);

        showAxis(3, scene);
        const boxes = getBoxes(e);

        const m = materials(e);

        var CoR_At = new Vector3(0, 0, 0);
        var sphere = MeshBuilder.CreateSphere(
            'sphere',
            { diameter: 0.25 },
            scene
        );
        sphere.position = CoR_At;

        const keys = Object.keys(boxes);
        const A = keys.slice(0, 9);
        const B = keys.slice(9, 18);
        const C = keys.slice(18, 27);

        // TicTakToe tech-ton-nix  tec-ton-ics

        A.forEach(key => {
            var s = 3.5;
            var box = boxes[key];
            // box.parent = sphere;
            box.scaling = new Vector3(s, s, s);
            box.material = m['matA'];
        });
        B.forEach(key => {
            var s = 3.5;
            var box = boxes[key];
            // box.parent = sphere;
            box.scaling = new Vector3(s, s, s);
            box.material = m['matB'];
        });
        C.forEach(key => {
            var s = 3.5;
            var box = boxes[key];
            // box.parent = sphere;
            box.scaling = new Vector3(s, s, s);
            box.material = m['matC'];
        });

        // sphere.animations = [];
        // sphere.animations.push(anim)

        window.turn = function(dim = "x", n = 1) {

            let array = Array(9);
            array = [...array].map((v,i) => i+9+9)
            array.forEach(n => {
                var box = boxes['C' + n % 9];
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
    };

    render() {
        return <Canvas sceneDidMount={this.sceneDidMount} />;
    }
}

export default Scene;
