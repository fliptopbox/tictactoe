import * as React from 'react';
import { Color3 } from 'babylonjs';
import Canvas from './Canvas'; // import the component above linking to file we just created.

// import materials from './materials';
import createCamera from './createCamera';
import createLight from './createLight';
import getMatrix from './getMatrix';
import showAxis from './showAxis';
// import rotatePlane from './rotatePlane';
import { getTerrain } from './terrain';
import pointerEvents from './pointerEvents';

class Scene extends React.Component {
    constructor() {
        super();
        this.state = {
            player: 0
        };
    }
    sceneDidMount = generateScene.bind(this);
    render() {
        return <Canvas sceneDidMount={this.sceneDidMount} />;
    }
}

export default Scene;

function generateScene(e) {
    // const that = this;
    const { scene, canvas, engine } = e;
    const diameter = 0;

    engine.runRenderLoop(() => scene && scene.render());

    showAxis((diameter + 1) * 3, scene);
    createLight(e, 'hemi', 'sun', 0.5, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]);
    // createLight(e, 'point', 'point1', 0.8, [0, 6, -1]);

    const earth = getMatrix(e, diameter);
    let camera = createCamera(e, (diameter + 1) * 3.6);
    // camera.inputs.addMouse();

    scene.clearColor = new Color3(0.05, 0.05, 0.05);
    scene.onPointerObservable.add(
        pointerEvents.bind({ camera, scene, earth, canvas })
    );

    earth.filter(c => !c.core).forEach(cube => getTerrain(cube, e, 0));

    window.earth = earth;
}
