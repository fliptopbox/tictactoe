import { Animation, Vector3, MeshBuilder, StandardMaterial } from 'babylonjs';

export default rotatePlane;
function rotatePlane(scene, matrix, axis = 'y', rotations = 2, z = 0) {

    if(!rotations) return;

    const speed = 0.46;
    const direction = rotations > 0 ? 1 : -1;
    const amount = [0.5, 1, 1.5, 2][(Math.abs(rotations) - 1) % 4];
    const duration = 100 * amount * speed;
    const origin = new Vector3(0,0,0);
    
    let sphere = MeshBuilder.CreateSphere('sphere', { diameter: 8, segments: 2 }, scene);
    
    const mat = new StandardMaterial("origin", scene);
    mat.wireframe = true;
    sphere.material = mat;
    sphere.position = origin;

    const collection = matrix.filter(cube => {
        const child = cube[axis] === z;
        if(child) cube.mesh.parent = sphere;
        return child;
    });



    console.log(collection);

    var anim = new Animation(
        'spin',
        `rotation.${axis}`,
        25,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // var frames = [{ frame: 0, value: 0 }, { frame: 100, value: Math.PI / rotations }];
    var frames = [{ frame: 0, value: 0 }, { frame: duration, value: Math.PI * amount * direction }];

    anim.setKeys(frames);
    scene.beginDirectAnimation(sphere, [anim], 0, duration, false);
}
