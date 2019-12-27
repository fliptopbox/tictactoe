import {StandardMaterial, MeshBuilder, Color3 } from 'babylonjs';


export default radialLineCluster;
function radialLineCluster(scene) {
    return pointCloud(scene);
    // const lines = lineArray();
    // const color = new Color3(0.07, 0.07, 0.07);
    // MeshBuilder.CreateLineSystem('linesystem', {lines}, scene).color = color;

    // lines.forEach(l => pinHead(l[1], scene, color));
    // return lines;
}

// function pinHead(xyz, scene, color) {
//     const m = MeshBuilder.CreateSphere(
//         'dot',
//         {diameter: 0.11, segments: 4},
//         scene
//     );
//     const mat = new StandardMaterial('drkgrey', scene);
//     mat.emissiveColor = color;
//     mat.diffuseColor = new Color3.Black();
//     mat.specularColor = new Color3.Black();

//     m.setAbsolutePosition(xyz);
//     m.material = mat;
//     // m.material.wireframe = true;
// }

// function lineArray(n = 500) {
//     let a = [];

//     const e = 6;

//     [...Array(n)]
//         .map((_, i) => i)
//         .forEach(_ => {
//             const coords = getXYZ(e, e + 3).map(xyz => {
//                 const [x, y, z] = xyz;
//                 return new Vector3(x, y, z);
//             });
//             a.push(coords);
//         });

//     return a;
// }

// function getXYZ(min, max) {
//     const {PI, random, sin, cos} = Math;
//     const long = random() * PI;
//     const lat = random() * (PI * 2);
//     return [
//         [
//             min * sin(long) * cos(lat),
//             min * sin(long) * sin(lat),
//             min * cos(long)
//         ],
//         [
//             (min + max) * sin(long) * cos(lat),
//             (min + max) * sin(long) * sin(lat),
//             (min + max) * cos(long)
//         ]
//     ];
// }

function pointCloud(scene) {
    var sphere = MeshBuilder.CreateIcoSphere(
        'sphere',
        {radius: 10, segments: 128},
        scene
    );

    let r, g, b;
    r = g = b = 0.1050999;
    var pointsMaterial = new StandardMaterial('Material', scene);
    pointsMaterial.pointsCloud = true;
    pointsMaterial.pointSize = 10;
    pointsMaterial.diffuseColor = new Color3(r,g,b)
    pointsMaterial.emissiveColor = new Color3(r,g,b)
    sphere.material = pointsMaterial;
}
