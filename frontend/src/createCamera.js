import { timeline } from "./utilities";
import { Vector3, ArcRotateCamera } from "babylonjs";
import orbitCamera from "./orbitCamera";

export default createCamera;
function createCamera({ scene, canvas }, matrixRadius = 1) {
    const radius = matrixRadius * 1.2; // 1.276;
    let camera = new ArcRotateCamera(
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
            start(camera, ms, matrixRadius);
            camera.attachControl(canvas, true);
        },
        orbit,
        attach: camera.attachControl(canvas, true)
    };
    return camera;
}

function start(camera, ms = 2000, matrixRadius) {
    const diameter = matrixRadius + 2;
    const distance = diameter + (diameter / 2);
    const { alpha, beta, radius, fov } = camera;
    const end = { beta: 1, alpha: 7.2, radius: distance, fov: 1.5 };

    timeline(ms * 1.05, function(percent) {
        camera.beta = beta + percent * (end.beta - beta);
        camera.alpha = alpha + percent * (end.alpha - alpha);
    });

    timeline(ms, function(percent) {
        camera.radius = radius + percent * (end.radius - radius);
        camera.fov = fov + percent * (end.fov - fov);
    });
}
