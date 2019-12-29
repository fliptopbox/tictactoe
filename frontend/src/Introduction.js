import * as React from 'react';

export default Introduction;
function Introduction({ state }) {
    if (!state.showIntro) return null;

    return (
        <div className="ui-intro-instructions">
            <p>Familiar lattice game in 3D</p>

            <h2>How to play</h2>
            <p>double tap to occupy a cube</p>
            <p>tap+drag on a cube to rotate accross a plane</p>
            <p>tap+drag on the canvas to orbit the matrix</p>

            <h2>Conditions of victory</h2>
            <p>Score is awarded by occupying a sequential set of territories</p>
            <p>Each territory occupied gives you 2 opportunites to twist</p>
            <p>Occupy and entire face will cause immediate victory</p>
        </div>
    );
}
