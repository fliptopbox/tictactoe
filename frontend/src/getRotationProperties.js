export default getRotationProperties;
function getRotationProperties(object, movement) {
    // Inputs Mesh Objects -OR- {x,y,z} Literals
    // returns Object {rotation, amount, extent}
    //
    // rotation:    String      the axis of rotation (x,y,z)
    // amount:      Integer     the number of revolutions (signed vector)
    // extent:      Integer     the col/row to affect (signed integer)
    //

    // console.clear();
    console.log('normal', object.normal);
    console.log('mesh', object.mesh);

    let rotation = 'x';
    let amount = 1;
    let extent = 1;

    const xyz = ['x', 'y', 'z'];
    const [deltaX, deltaY] = movement;
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? 0 : 1;
    console.log('delta', xyz[delta], movement[delta]);

    const [nX, nY, nZ] = Object.values(object.normal);
    const normal = [nX, nY, nZ].findIndex(v => Math.abs(v));
    const nValue = [nX, nY, nZ][normal];

    console.log('normal', normal, xyz[Math.abs(normal)]);

    if (!object.normal || ![nX, nY, nZ].some(b => b)) {
        console.warn('no normals detected');
        return null;
    }

    const [mX, mY, mZ] = Object.values(object.mesh);

    switch (xyz[Math.abs(normal)]) {
        case 'x':
            // horizontal drag
            extent = mY;
            rotation = 'y';
            // vertical drag
            if (xyz[delta] === 'y') {
                extent = mZ;
                rotation = 'z';
            }

            // positive/negative normals reverse direction
            if (nValue > 0) {
                console.log('forward >>', rotation, nValue, movement[delta]);
                amount *= movement[delta] > 0 ? -1 : 1;
            } else {
                console.log('backward >>', rotation, nValue, movement[delta]);
                amount *=
                    rotation === 'y'
                        ? movement[delta] > 0
                            ? -1
                            : 1
                        : movement[delta] > 0
                        ? 1
                        : -1;
            }

            break;

        case 'y':
            extent = mZ;
            rotation = 'z';
            if (xyz[delta] === 'y') {
                extent = mX;
                rotation = 'x';
            }
            // positive/negative normals reverse direction
            if (nValue > 0) {
                console.log('forward >>', rotation, nValue, movement[delta]);
                amount *= movement[delta] > 0 ? 1 : -1;
            } else {
                console.log('backward >>', rotation, nValue, movement[delta]);
                amount *=
                    rotation === 'z'
                        ? movement[delta] > 0
                            ? -1
                            : 1
                        : movement[delta] > 0
                        ? 1
                        : -1;
            }
            break;

        case 'z':
        default:
            extent = mY;
            rotation = 'y';
            if (xyz[delta] === 'y') {
                extent = mX;
                rotation = 'x';
            }
            // positive/negative normals reverse direction
            if (nValue > 0) {
                console.log('forward >>', rotation, nValue, movement[delta]);
                amount *=
                    rotation === 'x'
                        ? movement[delta] > 0
                            ? 1
                            : -1
                        : movement[delta] > 0
                        ? -1
                        : 1;
            } else {
                console.log('backward >>', rotation, nValue, movement[delta]);
                amount *=
                    rotation === 'x'
                        ? movement[delta] > 0
                            ? -1
                            : 1
                        : movement[delta] > 0
                        ? -1
                        : 1;
            }
            break;
    }

    return { rotation, amount, extent };
}

/** QUOKKA INLINE *!/

let objA, objB;

// two down
objA = {x:1, y: 1, z: 1}; objB = {x:1, y: -1, z: 1};
getRotationProperties(objA, objB); //?

// one down
objA = {x:1, y: 1, z: -1}; objB = {x:1, y: 0, z: -1};
getRotationProperties(objA, objB); //?

// 5x5 four down
objA = {x:2, y: 2, z: 0}; objB = {x:2, y: -2, z: 0};
getRotationProperties(objA, objB); //?

// one right
getRotationProperties(objA, objB); //?

// two left
getRotationProperties(objA, objB); //?

// one left


/** */
