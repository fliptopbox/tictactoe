import materials from './materials';
import {
    MeshBuilder,
    Vector3,
    Space,
    ShadowGenerator
} from 'babylonjs';

export default createGroundPlane;
function createGroundPlane({ scene , sun, earth }) {

    const m = materials({ scene});
    const size = 45.5;
    const ground = MeshBuilder.CreateGround(
        'ground',
        { height: size, width: size, subdivisions: 96 },
        scene
    );

    console.log(earth);
    const subject = earth[13].mesh;

    ground.translate(new Vector3(0, -2.3, 0), Space.WORLD);
    ground.material = m('ground');

    // Shadows
    var shadowGenerator = new ShadowGenerator(1024, sun);

    shadowGenerator.getShadowMap().renderList.push(subject);
    // shadowGenerator.addShadowCaster(subject);
    shadowGenerator.useExponentialShadowMap = true;


    ground.receiveShadows = true;
    return ground;
}
