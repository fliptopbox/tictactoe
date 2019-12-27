import {
    Mesh,
    DynamicTexture,
    StandardMaterial,
    Color3,
    Vector3
} from 'babylonjs';

export default showAxis;
function showAxis(size, scene, showAxis = false) {
    if(!showAxis) return;
    var axisX = Mesh.CreateLines(
        'axisX',
        [
            new Vector3.Zero(),
            new Vector3(size, 0, 0),
            new Vector3(size * 0.95, 0.05 * size, 0),
            new Vector3(size, 0, 0),
            new Vector3(size * 0.95, -0.05 * size, 0)
        ],
        scene
    );
    axisX.color = new Color3(1, 0, 0);
    var xChar = makeTextPlane(scene, 'X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = Mesh.CreateLines(
        'axisY',
        [
            new Vector3.Zero(),
            new Vector3(0, size, 0),
            new Vector3(-0.05 * size, size * 0.95, 0),
            new Vector3(0, size, 0),
            new Vector3(0.05 * size, size * 0.95, 0)
        ],
        scene
    );
    axisY.color = new Color3(0, 1, 0);
    var yChar = makeTextPlane(scene, 'Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = Mesh.CreateLines(
        'axisZ',
        [
            new Vector3.Zero(),
            new Vector3(0, 0, size),
            new Vector3(0, -0.05 * size, size * 0.95),
            new Vector3(0, 0, size),
            new Vector3(0, 0.05 * size, size * 0.95)
        ],
        scene
    );
    axisZ.color = new Color3(0, 0, 1);
    var zChar = makeTextPlane(scene, 'Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
}

function makeTextPlane(scene, text, color, size) {
    var dynamicTexture = new DynamicTexture('DynamicTexture', 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
        text,
        5,
        40,
        'bold 36px Arial',
        color,
        'transparent',
        true
    );
    var plane = new Mesh.CreatePlane('TextPlane', size, scene, true);
    plane.material = new StandardMaterial('TextPlaneMaterial', scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
}
