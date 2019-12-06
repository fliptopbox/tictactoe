import { HemisphericLight, PointLight, Vector3 } from 'babylonjs';

export default createLight;
function createLight({ scene }, type = "hemi", name = 'light', intensity, vector=[0,1,0]) {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    let light;
    const target = new Vector3(...vector);

    switch (type) {
        case "hemi":
            light = new HemisphericLight( name, target, scene);
            break;

        case "point":
        default:
            light = new PointLight( name, target, scene);
            break;
    }

    light.intensity = intensity;

    return light;
}



