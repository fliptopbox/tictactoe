import { StandardMaterial, Color3 } from 'babylonjs';

export default materials;
function materials({ scene }) {
    const wire = new StandardMaterial('wire', scene);
    wire.diffuseColor = new Color3(1, 0, 1);
    wire.specularColor = new Color3(0.5, 0.6, 0.87);
    wire.emissiveColor = new Color3(1, 1, 1);
    wire.ambientColor = new Color3(0.23, 0.98, 0.53);
    wire.wireframe = true;

    const solid = new StandardMaterial('solid', scene);
    solid.diffuseColor = new Color3(1, 0, 1);
    solid.specularColor = new Color3(0.5, 0.6, 0.87);
    solid.emissiveColor = new Color3(0, 0, 0);
    solid.ambientColor = new Color3(0.23, 0.98, 0.53);
    solid.wireframe = false;

    const matA = new StandardMaterial('matA', scene);
    matA.diffuseColor = new Color3(1, 0, 0);
    matA.specularColor = new Color3(0.5, 0.6, 0.87);
    matA.emissiveColor = new Color3(0, 0, 0);
    matA.ambientColor = new Color3(0.23, 0.98, 0.53);
    matA.wireframe = false;

    const matB = new StandardMaterial('matB', scene);
    matB.diffuseColor = new Color3(0, 1, 0);
    matB.specularColor = new Color3(0.5, 0.6, 0.87);
    matB.emissiveColor = new Color3(0, 0, 0);
    matB.ambientColor = new Color3(0.23, 0.98, 0.53);
    matB.wireframe = false;

    const matC = new StandardMaterial('matC', scene);
    matC.diffuseColor = new Color3(0, 0, 1);
    matC.specularColor = new Color3(0.5, 0.6, 0.87);
    matC.emissiveColor = new Color3(0, 0, 0);
    matC.ambientColor = new Color3(0.23, 0.98, 0.53);
    matC.wireframe = false;

    return { 
        wire, 
        solid,
        matA,
        matB,
        matC
    };
}
