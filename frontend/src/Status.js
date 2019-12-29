import React from 'react';
import GameOver from './GameOver';
import HexSwatches from './HexSwatches';
import CurrentPlayer from './CurrentPlayer';
import Introduction from './Introduction';

export default Status;
function Status({ state, gameover, earth }) {
    const finished = state.finished;
    const array = !earth ? null : earth.filter(c => !c.owner && c.type);

    return (
        <div className="ui-status">
            <Introduction state={state} />
            <CurrentPlayer state={state} array={array} />
            <GameOver finished={finished} result={gameover} />
            <HexSwatches state={state} earth={earth} />
        </div>
    );
}
