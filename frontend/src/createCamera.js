import { timeline } from "./utilities";
import { Vector3, ArcRotateCamera } from "babylonjs";
import orbitCamera from './orbitCamera';

export default createCamera;
function createCamera({ scene, canvas }, radius = 1.276) {
    var camera = new ArcRotateCamera(
        "Camera",
        0.45539, // Math.PI / 2, // camera.alpha (horz)
        4.164, //Math.PI / 2, // camera.beta (vertical)
        radius, // 2.076, // radius, // camera.radius
        null, // new Vector3(2.5, 1.5, 0),
        scene
    );

    camera.fov = 1.2;
    camera.setTarget(new Vector3(0, -1, 0));
    // camera.attachControl(canvas, true);
    //
    const orbit = orbitCamera(camera);
    orbit(1);

    window.camera = {
        camera,
        start: (ms = 2000) => {
            if (orbit()) orbit(0);
            start(camera, ms);
            camera.attachControl(canvas, true);
        },
        orbit,
        attach: camera.attachControl(canvas, true)
    };
    return camera;
}

function start(camera, ms = 2000) {

    const alphaStart = camera.alpha;
    const betaStart = camera.beta;
    const radiusStart = camera.radius;
    const fovStart = camera.fov;

    timeline(ms * 1.05, function(percent) {
        camera.beta = betaStart + percent * 1.015;
        camera.alpha = alphaStart + percent * 2.061;
    });

    timeline(ms, function(percent) {
        camera.radius = radiusStart + percent * 3.1;
        camera.fov = fovStart + percent * 1;
    });
}
