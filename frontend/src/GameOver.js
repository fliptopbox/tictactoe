import React from 'react';

export default GameOver;

function GameOver({ finished, result }) {
    if (!finished) return null;

    const { count, rank } = result;
    const scoreCard = rank.map(item => {
        const { alias, accumulated, material, playerId } = item;
        return (
            <div key={playerId} className="ui-score-row">
                <span className="ui-score-col ui-score-avatar">{material}</span>
                <span className="ui-score-col ui-score-alias">{alias}</span>
                <span className="ui-score-col ui-score-points">
                    {accumulated}
                </span>
            </div>
        );
    });

    const tie = count > 1;
    const { alias } = rank[0];
    const winner = tie ? 'Nobody wins!' : `${alias} wins!`;

    return (
        <div className="ui-status-game-over">
            <div className="ui-game-over-stats">
                <div className="ui-heading">Game Over</div>
                <div className="ui-subheading">{winner}</div>
                {scoreCard}
            </div>
        </div>
    );
}
