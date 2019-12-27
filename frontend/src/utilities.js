import BezierEasing from 'bezier-easing';

export { padd };
 function padd(string, len = 8) {
     return String(` ${string}      `).slice(0, len);
 }

export { rnd };
function rnd(max = 1, min = 0, float = true) {
    let n = Math.random() * (max - min) + min;
    if (!float && max === 1 && min === 0) n = Math.round(n);
    return float ? n : n >> 0;
}

export { timeline };
function timeline(duration, fn, frameRate = 60) {
    const seconds = duration / 1000;
    const frames = frameRate * seconds;
    const fps = 1000 / frameRate;

    for (let i = 0; i <= frames; i += 1) {
        setTimeout(function() {
            return !fn ? null : fn(Number(i / frames), i);
        }, i * fps);
    }
}

const easingCurves = {
    ease: [0.25, 0.1, 0.25, 1],
    linear: [0, 0, 1, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'ease-in-out': [0.42, 0, 0.58, 1]
};
export { easingCurves };

export { easing };
function easing(key) {
    const curve = easingCurves[key] || easingCurves['ease-out'];
    return BezierEasing(...curve);
}

export { percentToAbsolute };
function percentToAbsolute() {
    // translate value is scalar, convert the normal
    // into positive (explode) or negative (implode) value

    let lastFloat = 0;
    return function(distance, percent) {
        let value = 0;

        value =
            percent >= lastFloat
                ? (value = percent * distance)
                : distance * (distance * lastFloat * (percent - lastFloat));

        // console.log(
        //     padd(i),
        //     padd(((distance * 1000) >> 0) / 1000),
        //     padd(((lastFloat * 1000) >> 0) / 1000),
        //     padd(((value * 1000) >> 0) / 1000),
        //     padd(((percent * 1000) >> 0) / 1000)
        // );

        lastFloat = percent;
        return value;
    };
}
