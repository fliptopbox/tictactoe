// import { PointerEventTypes, PickingInfo } from "babylonjs";
import getRotationProperties from "./getRotationProperties";
import rotatePlane from "./rotatePlane";

let down = false;
let movement = [0, 0];
let onRelease;
let selected;
let ts;

export default pointerEvents;
function pointerEvents(e) {
  const { camera, earth, canvas, scene } = this;
  const { type, pickInfo } = e;
  const { movementX, movementY, timeStamp } = e.event;
//   const { POINTERDOWN, POINTERUP, POINTERMOVE } = PointerEventTypes;

  let diff, props;

  switch (type) {
    case 1: // case POINTERDOWN:
      if (pickInfo && pickInfo.pickedMesh) {
        camera.detachControl(canvas);
        down = true;
        ts = timeStamp;
        selected = {
          mesh: { ...pickInfo.pickedMesh.absolutePosition },
          normal: { ...pickInfo.getNormal() }
        };
      }
      break;

    case 2: // case POINTERUP:
      diff = ts ? timeStamp - ts : 0;
      // console.log(ts, timeStamp, diff);
      if (pickInfo.pickedMesh && onRelease && diff > 250) {
        // console.log(111, pickInfo.pickedMesh.forward);
        // console.log(222, pickInfo.ray.direction);
        props = getRotationProperties(selected, movement);
        props && rotatePlane(scene, earth, props.rotation, props.extent, props.amount);

        console.log(scene);
        console.log(scene.cameras[0].position);
      }
      // camera.inputs.addMouse();
      // camera.inputs.attached.mouse.detachControl();
      // camera.inputs.attachInput(camera.inputs.attached.mouse);
      camera.attachControl(canvas, true);
      onRelease = null;
      movement = [0, 0];
      selected = null;
      down = false;
      ts = 0;
      break;

    case 4: // case POINTERMOVE:
      if (down) {
        movement[0] += movementX;
        movement[1] += movementY;

        onRelease = Math.abs(movement[0]) > 10 || Math.abs(movement[1]) > 10;
      }
      break;
    default:
      break;
  }
}
