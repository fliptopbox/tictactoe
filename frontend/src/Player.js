import * as React from 'react';

export default Player;
function Player({ player, current }) {
    let { alias, material, twist } = player;

    const style = { background: material };
    // const free = null;
    // spiecies = ['human', 'random', 'AI'][spiecies];

    // const showTwist = twist ? (
    //     <div className="ui-player-twist">twist: {twist || 'none'}</div>
    // ) : null;

    // const showFree =
    //     free !== null ? (
    //         <div className="ui-player-free">Free: {free || 'none'}</div>
    //     ) : null;

    const active = current ? 'ui-player-current' : '';
    const classname = `ui-player ${active}`;

    const showAlias = (
        <div className="ui-player-info">
            {alias} ({twist})
        </div>
    );

    return (
        <div className={classname}>
            <div className="ui-player-icon" style={style}>
                {showAlias}
            </div>
        </div>
    );
}
