import { VertexBuffer, VertexData, Animation, Vector3, MeshBuilder, StandardMaterial } from 'babylonjs';
// import updateNormals from './updateNormals';

export default rotatePlane;
function rotatePlane(scene, matrix, axis = 'y', extent = 0, rotations = 1, rotationFrames = 100) {
    if (!rotations || !/^[xyz]$/.test(axis)) return;

    const speed = 0.3;
    const direction = rotations > 0 ? 1 : -1;
    const amount = [0.5, 1, 1.5, 2][(Math.abs(rotations) - 1) % 4];
    const duration = rotationFrames * speed >> 0;
    const pivot = createPivot(scene);

    let collection = matrix.filter(cube => {
        const child = cube[axis] === extent;
        if (child) cube.mesh.setParent(pivot);
        return child;
    });

    const anim = new Animation(
        'spin',
        `rotation.${axis}`,
        25,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const frames = [
        { frame: 0, value: 0 },
        { frame: duration, value: Math.PI * amount * direction }
    ];

    const onAnimationEnd = () => {
        collection = updateCubePositions(collection, matrix, scene);
        pivot.dispose(true);
    };

    anim.setKeys(frames);
    scene.beginDirectAnimation(
        pivot,
        [anim],
        0,
        duration,
        false,
        1,
        onAnimationEnd
    );
}

function updateCubePositions(array, matrix) {
    // after the animation, update the mesh positions to absolute coords
    // and merge the new positions in the respective matrix reference

    const updated = array
        .map(cube => {
            const { absolutePosition } = cube.mesh;
            let { x, y, z } = absolutePosition;
            const { mesh } = cube;

            // the matrix attributes
            x = Math.round(absolutePosition.x);
            y = Math.round(absolutePosition.y);
            z = Math.round(absolutePosition.z);

            // the mesh position
            mesh.parent = null; // mesh.setParent(null) !copies parent normals
            mesh.setAbsolutePosition(new Vector3(x, y, z));

            let positions = mesh.getVerticesData(VertexBuffer.PositionKind);
            let normals = mesh.getVerticesData(VertexBuffer.NormalKind);
            VertexData.ComputeNormals(positions, mesh.getIndices(), normals);
            mesh.setVerticesData(VertexBuffer.NormalKind, normals );
            // updateNormals(mesh, scene);
            // mesh.updateMeshPositions(new Vector3(x,y,z), true)

            return { ...cube, mesh, x, y, z };
        });

    updated
        .forEach(cube => {
            matrix[cube.id] = { ...cube };
        });

    return updated;
}

function createPivot(scene) {
    const origin = new Vector3(0, 0, 0);
    const options = { diameter: 1, segments: 2 };
    const pivot = MeshBuilder.CreateSphere('pivot', options, scene);

    // the rotation parent hull
    const mat = new StandardMaterial('origin', scene);
    mat.wireframe = true;
    pivot.material = mat;
    pivot.position = origin;
    return pivot;
}

