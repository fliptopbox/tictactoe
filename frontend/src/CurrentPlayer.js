import React from 'react';

export default CurrentPlayer;

function CurrentPlayer({ state, array }) {
    if (!state.inProgress || state.finished) return null;

    const { player, players } = state;
    const current = players[player];
    const { alias, twist, material } = current;

    return (
        <div className="ui-status-current-player">
            <div className="ui-status-cell ui-current">
                <div
                    className="ui-current-avatar"
                    style={{ background: material }}></div>
                <div className="ui-current-player">{alias}</div>
            </div>
            <div className="ui-status-icons">
                <div className="ui-status-cell">
                    {twist}{' '}
                    <img
                        className="ui-icon"
                        src="/images/icons/twists.svg"
                        alt="twist"
                    />
                </div>
                <div className="ui-status-cell">
                    {current.accumulated || 0}{' '}
                    <img
                        className="ui-icon"
                        src="/images/icons/score.svg"
                        alt="score"
                    />
                </div>
                <div className="ui-status-cell">
                    {array && array.length}{' '}
                    <img
                        className="ui-icon"
                        src="/images/icons/square.svg"
                        alt="free squares"
                    />
                </div>
            </div>
        </div>
    );
}
