import {
    Vector3,
    ArcRotateCamera,
} from 'babylonjs';

export default createCamera;
function createCamera({scene, canvas}, distance = 8) {
    var camera = new ArcRotateCamera(
        'Camera',
        Math.PI / 2,
        Math.PI / 2,
        distance,
        Vector3.Zero(),
        scene
    );

    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
}
