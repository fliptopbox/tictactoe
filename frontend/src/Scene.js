import * as React from 'react';
import { Color3, Vector3, MeshBuilder, Animation } from 'babylonjs';
import Canvas from './Canvas'; // import the component above linking to file we just created.

import createCamera from './createCamera';
import createLight from './createLight';
import getMatrix from './getMatrix';
import showAxis from './showAxis';
import rotatePlane from './rotatePlane';
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
    const diameter = 1;

    scene.clearColor = new Color3(0.05, 0.05, 0.05);

    engine.runRenderLoop(() => scene && scene.render());

    createCamera(e, (diameter + 1) * 3.6);
    createLight(e, 'hemi', 'sun', 0.5, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]);
    // createLight(e, 'point', 'point1', 0.8, [0, 6, -1]);

    showAxis((diameter + 1) * 3, scene);

    const earth = getMatrix(e, diameter);
    earth.filter(c => !c.core).forEach((cube) => getTerrain(cube, e, 0));


    window.rotate = function(axis, extent = 0, rotations = 1) {
        return rotatePlane(scene, earth, axis, extent, rotations);
    }
    window.earth = earth;

}
