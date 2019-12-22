
export default orbitCamera;
function orbitCamera(camera, inc = 3, orbit = "alpha") {

    let timer = null;
    let step = inc / 1000;

    orbit = /^(alpha|beta)$/i.test(orbit) ? orbit : "alpha";
    orbit = orbit.toLowerCase();

    const helper = function(direction = null) {
        // direction: -1 negative, 0 stop, 1 positive
        if(direction === undefined || direction === null) {
            return timer !== null; // true = is running
        }

        if (direction === 0) {
            clearTimeout(timer);
            timer = null;
            return;
        }


        camera[orbit] += step * direction;
        timer = setTimeout(() => helper(direction ), 50);
    };

    return helper;
}