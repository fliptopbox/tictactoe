import {
    Vector3,
    ArcRotateCamera,
} from 'babylonjs';

export default createCamera;
function createCamera({scene, canvas}, distance = 10) {
    var camera = new ArcRotateCamera(
        'Camera',
        Math.PI / 2,
        Math.PI / 2,
        distance,
        new Vector3(2.5,2.5,0),
        scene
    );

    camera.fov = 1.5;
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    return camera;
}
