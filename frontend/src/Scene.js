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
            player: 0,
            players: [1,2],
            radius: 0
        };
    }

    rotate = ({rotation, extent, amount}) => {
        // rotatePlane
    }

    occupy = (id) => {
        console.log("occupy", id, this.state.player)
    }



    sceneDidMount = (e) => {
        this.scene = e.scene;
        this.canvas = e.canvas;
        this.engine = e.engine;

        const { radius } = this.state;
        this.camera = createCamera(e, (radius + 1) * 3.6);
        this.earth = getMatrix(e, radius);

        return generateScene.call(this);
    }

    render() {
        return <Canvas sceneDidMount={this.sceneDidMount} />;
    }
}

export default Scene;

function generateScene() {
    // const that = this;
    // const { scene, canvas, engine } = e;
    const { scene, engine, earth } = this;
    const { radius } = this.state;

    engine.runRenderLoop(() => scene && scene.render());

    showAxis((radius + 1) * 3, scene);
    createLight({scene}, 'hemi', 'sun', 0.5, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]);
    // createLight(e, 'point', 'point1', 0.8, [0, 6, -1]);

    // camera.inputs.addMouse();

    // this.earth = earth;
    // this.camera = camera;

    scene.clearColor = new Color3(0.05, 0.05, 0.05);
    scene.onPointerObservable.add(
        pointerEvents.bind(this)
    );

    earth.filter(c => !c.core).forEach(cube => getTerrain(cube, {scene}, 0));

    window.earth = earth;
}
