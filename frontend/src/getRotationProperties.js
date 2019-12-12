export default getRotationProperties;
function getRotationProperties(object) {
    // Input Mesh Objects -OR- {x,y,z} Literals
    //
    // object {mesh, dest, normal}
    // ---------------------------
    // mesh         Object      mouse down object (origin)
    // dest         Object      mouse up object (destingation)
    // normal       Object      face normal coords
    //
    // returns Object {rotation, amount, extent}
    // -----------------------------------------
    // rotation:    String      the axis of rotation (x,y,z)
    // amount:      Integer     the number of revolutions (signed vector)
    // extent:      Integer     the col/row to affect (signed integer)

    let dest = {...object.dest};
    Object.keys(dest).forEach(k => (dest[k] = object.mesh[k] - object.dest[k]));
    Object.keys(dest).forEach(k => (dest[k] !== 0 ? dest[k] : delete dest[k]));

    // maximum revolutions for this player for this turn
    const amountMax = 3;

    let rotation;
    let amount;
    let extent;

    const xyz = ['x', 'y', 'z'];

    const [nX, nY, nZ] = Object.values(object.normal);
    const normal = [nX, nY, nZ].findIndex(v => Math.abs(v));
    const nValue = [nX, nY, nZ][normal];

    if (!object.normal || ![nX, nY, nZ].some(b => b)) {
        console.warn('no normals detected');
        return null;
    }

    const [mX, mY, mZ] = Object.values(object.mesh);
    let normalAxis = xyz[Math.abs(normal)];
    let destAxis = Object.keys(dest)[0];
    let destValue = Object.values(dest)[0];
    let clockwise;

    amount = Math.min(Math.abs(destValue), amountMax);

    switch (normalAxis) {
        case 'x':
            rotation = destAxis === 'z' ? 'y' : 'z';
            clockwise = nValue > 0 ? -1 : 1;

            if (destAxis === 'y') {
                extent = mZ;
                clockwise *= destValue > 0 ? 1 : -1;
            }

            if (destAxis === 'z') {
                extent = mY;
                clockwise *= destValue > 0 ? -1 : 1;
            }

            amount *= clockwise;
            break;

        case 'y':
            rotation = destAxis === 'z' ? 'x' : 'z';
            clockwise = nValue > 0 ? 1 : -1;

            if (destAxis === 'x') {
                extent = mZ;
                clockwise *= destValue > 0 ? 1 : -1;
            }

            if (destAxis === 'z') {
                extent = mX;
                clockwise *= destValue > 0 ? -1 : 1;
            }

            amount *= clockwise;
            break;

        case 'z':
        default:
            rotation = destAxis === 'y' ? 'x' : 'y';
            clockwise = nValue > 0 ? 1 : -1;

            if (destAxis === 'y') {
                extent = mX;
                clockwise *= destValue > 0 ? 1 : -1;
            }

            if (destAxis === 'x') {
                extent = mY;
                clockwise *= destValue > 0 ? -1 : 1;
            }

            amount *= clockwise;
            break;
    }

    return {rotation, amount, extent};
}
