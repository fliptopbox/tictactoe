// import { PointerEventTypes, PickingInfo } from "babylonjs";
import getRotationProperties from './getRotationProperties';
import rotatePlane from './rotatePlane';

let down = false;
let movement = [0, 0];
let onRelease;
let selected;
// let ts;

export default pointerEvents;
function pointerEvents(e) {
    const {camera, earth, canvas, scene} = this;
    const {type, pickInfo} = e;
    const {movementX, movementY} = e.event;
    //   const { POINTERDOWN, POINTERUP, POINTERMOVE } = PointerEventTypes;

    let diff, props;

    switch (type) {
        case 1: // case POINTERDOWN:
            if (pickInfo && pickInfo.pickedMesh) {
                camera.detachControl(canvas);
                down = true;

                selected = {
                    mesh: {...pickInfo.pickedMesh.absolutePosition},
                    normal: {...pickInfo.getNormal()}
                };
            }
            tick();
            break;

        case 2: // case POINTERUP:
            diff = tick()
                .splice(-2)
                .reduce((a, c) => c - a, 0);

            // rotation interaction
            if (pickInfo.pickedMesh && onRelease && diff > 160) {
                selected.dest = pickInfo.pickedMesh.absolutePosition;
                // dispatch( rotate, rotationProperties);
                props = getRotationProperties(selected);
                props &&
                    rotatePlane(
                        scene,
                        earth,
                        props.rotation,
                        props.extent,
                        props.amount
                    );
                tick("clear");
            }

            // user occupies cube by double click/tap
            diff = tickAverage();
            if(pickInfo.pickedMesh && diff && diff < 100) {
                this.occupy(pickInfo.pickedMesh.id);
                tick("clear");
            }

            // re-attach arc camera
            camera.attachControl(canvas, true);
            onRelease = null;
            movement = [0, 0];
            selected = null;
            down = false;
            // ts = 0;
            break;

        case 4: // case POINTERMOVE:
            if (down) {
                movement[0] += movementX;
                movement[1] += movementY;

                onRelease =
                    Math.abs(movement[0]) > 10 || Math.abs(movement[1]) > 10;
            }
            break;
        default:
            break;
    }
}

let tts = [];
function tick(n) {
    const now = new Date().valueOf();
    const diff = -(tts.length && tts.slice(-1)[0] - now)

    // clear click stack tick("clear") or timediff > 1.5 sec
    if(n === "clear" || diff > 1500) return tts = [now];

    // do not add new timestamp with tick(null)
    tts = n === null ? [...tts] : [...tts, now].splice(-5);
    return [...tts];
}

function tickAverage() {
    // returns the average of the last two click intervals
    let ave = tick(null);

    if(ave.length < 4) return 0;

    ave = [
        [...ave].splice(-4, 2).reduce((a, c) => c - a, 0),
        [...ave].splice(-2).reduce((a, c) => c - a, 0),
    ].reduce((a,c) => a + c, 0) / 2;
    return ave;
};
