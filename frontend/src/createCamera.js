import { timeline } from './utilities';
import { Vector3, ArcRotateCamera } from 'babylonjs';

export default createCamera;
function createCamera({ scene, canvas }, radius = 2.076) {
    var camera = new ArcRotateCamera(
        'Camera',
        0.45539, // Math.PI / 2, // camera.alpha (horz)
        0.455, //Math.PI / 2, // camera.beta (vertical)
        radius, // 2.076, // radius, // camera.radius
        null, // new Vector3(2.5, 1.5, 0),
        scene
    );

    camera.fov = 0.5;
    camera.setTarget(new Vector3(0, -1, 0));
    // camera.attachControl(canvas, true);
    //

    window.camera = {
        camera,
        start: (ms = 2000) => {
            start(camera, ms);
            camera.attachControl(canvas, true);
        },
        orbit: (bool) => rotateOnAlpha.call(camera, bool === true),
        attach: camera.attachControl(canvas, true)
    };
    return camera;
}

function start(camera, ms = 2000) {
    rotateOnAlpha.call(camera, true);

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

let orbit;
function rotateOnAlpha(stop = false) {

    if(stop === true) {
        clearTimeout(orbit);
        return;
    }

    this.alpha += 0.0051;
    orbit = setTimeout(() => rotateOnAlpha.call(this), 50);
}
