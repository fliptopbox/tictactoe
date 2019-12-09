import { Animation, Vector3, MeshBuilder, StandardMaterial } from 'babylonjs';

export default rotatePlane;
function rotatePlane(scene, matrix, axis = 'y', rotations = 2, z = 0) {
    if (!rotations) return;

    const speed = 0.46;
    const direction = rotations > 0 ? 1 : -1;
    const amount = [0.5, 1, 1.5, 2][(Math.abs(rotations) - 1) % 4];
    const duration = 100 * amount * speed;
    const origin = new Vector3(0, 0, 0);

    let sphere = MeshBuilder.CreateSphere(
        'sphere',
        { diameter: 8, segments: 2 },
        scene
    );

    const mat = new StandardMaterial('origin', scene);
    mat.wireframe = true;
    sphere.material = mat;
    sphere.position = origin;

    let collection = matrix.filter(cube => {
        const child = cube[axis] === z;
        cube.mesh.setParent(null);
        if (child) cube.mesh.setParent(sphere);
        return child;
    });

    console.log(collection.length);

    const anim = new Animation(
        'spin',
        `rotation.${axis}`,
        25,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // console.log(collection[0].mesh.absolutePosition);
    // var frames = [{ frame: 0, value: 0 }, { frame: 100, value: Math.PI / rotations }];
    const frames = [
        { frame: 0, value: 0 },
        { frame: duration, value: Math.PI * amount * direction }
    ];
    const onAnimationEnd = () => {
        collection = updateCubePositions(collection, matrix, sphere);
        sphere.dispose(true);
    };

    anim.setKeys(frames);
    scene.beginDirectAnimation(
        sphere,
        [anim],
        0,
        duration,
        false,
        1,
        onAnimationEnd
    );
}

function updateCubePositions(array, matrix, parent) {
    // after the animation, update the positions to absolute coords
    // and update the respective matrix references too
    return array
        .map(cube => {
            const { absolutePosition } = cube.mesh;
            let { x, y, z } = absolutePosition;
            const { mesh } = cube;

            // the matrix attributes
            x = Math.round(absolutePosition.x);
            y = Math.round(absolutePosition.y);
            z = Math.round(absolutePosition.z);

            mesh.setParent(null);
            mesh.setAbsolutePosition(new Vector3(x,y,z));

            return { ...cube, mesh, x, y, z };
        })
        .forEach(cube => {
            matrix[cube.id] = cube;
        });
}
