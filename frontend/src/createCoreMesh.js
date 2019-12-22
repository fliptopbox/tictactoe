import {
    Mesh,
    Color3,
    Vector3,
    Texture,
    MeshBuilder,
    VolumetricLightScatteringPostProcess
} from 'babylonjs';

export default createCoreMesh;
function createCoreMesh({ engine, camera, scene }) {

    const defaultMesh = VolumetricLightScatteringPostProcess.CreateDefaultMesh("meshName", scene);
    
}
