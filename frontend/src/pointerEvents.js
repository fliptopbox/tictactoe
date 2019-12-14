import { PointerEventTypes } from 'babylonjs';
import getRotationProperties from './getRotationProperties';

let down = false;
let movement = [0, 0];
let onRelease;
let selected;
// let ts;

const {
    POINTERTAP,
    POINTERPICK,
    POINTERDOWN,
    POINTERUP,
    POINTERMOVE,
    POINTERDOUBLETAP
} = PointerEventTypes;

export default pointerEvents;
function pointerEvents(e) {
    const { camera, canvas } = this;
    const { type, pickInfo = null } = e;
    const { pickedMesh = null } = pickInfo || {};
    const { movementX, movementY } = e.event;

    let props;

    switch (type) {
        case POINTERDOWN:
            if (pickedMesh && pickInfo) {
                camera.detachControl(canvas);
                down = true;

                selected = {
                    mesh: { ...pickedMesh.absolutePosition },
                    normal: { ...pickInfo.getNormal() }
                };
            }
            break;

        case POINTERUP:
            // rotation interaction
            if (pickedMesh && onRelease) {
                selected.dest = pickedMesh.absolutePosition;
                // dispatch( rotate, rotationProperties);
                props = getRotationProperties(selected);
                this.rotate(props);
            }

            // re-attach arc camera
            camera.attachControl(canvas, true);
            onRelease = null;
            movement = [0, 0];
            selected = null;
            down = false;

            break;

        case POINTERMOVE:
            if (down) {
                movement[0] += movementX;
                movement[1] += movementY;

                // if the mouse has moved more than 10px execute
                // flag any onRelease checks to execute
                onRelease = Math.abs(movement[0] + Math.abs(movement[1])) > 10;
            }

            break;

        case POINTERPICK:
        case POINTERTAP:
            // console.log('pick/tap', type);
            break;

        case POINTERDOUBLETAP:
            console.log('double click - auto occupy', type);
            if(!/^m/.test(pickedMesh.id)) return;
            this.occupy(pickedMesh.id);
            break;

        default:
            console.log('dropthrough', type);
            break;
    }
}
