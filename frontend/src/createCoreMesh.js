import {
    // Mesh,
    // Color3,
    PointLight,
    // MeshBuilder,
    Vector3,
    Texture,
    VolumetricLightScatteringPostProcess
} from 'babylonjs';

export default createCoreMesh;
function createCoreMesh({ engine, camera, scene }) {
    // Create the "God Rays" effect (volumetric light scattering)

    const createGodRays = false;
    if(!createGodRays) return;

    const core = scene.meshes.filter(mesh => mesh.isCore);
    core.forEach(mesh => godRadiation(mesh, engine, camera, scene));
}

function godRadiation(mesh, engine, camera, scene) {

    console.log(mesh);
    var godrays = new VolumetricLightScatteringPostProcess(
        'godrays',
        1.0,
        camera,
        mesh,
        100,
        Texture.BILINEAR_SAMPLINGMODE,
        engine,
        false
    );

    // By default it uses a billboard to render the sun, 
    // just apply the desired texture position and scale

    // godrays.mesh.material.diffuseTexture = new Texture(
    //     'textures/sun.png',
    //     scene,
    //     true,
    //     false,
    //     Texture.BILINEAR_SAMPLINGMODE
    // );
    // godrays.mesh.material.diffuseTexture.hasAlpha = true;

    godrays.useDiffuseColor = true;
    godrays.mesh.position = new Vector3(0, 0, 0);
    // godrays.mesh.scaling = new Vector3(.91, .91, .91);

    var light = new PointLight("Omni", new Vector3(0, 0, 0), scene);
    light.position = godrays.mesh.position;

}
