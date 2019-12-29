import React from 'react';

export default GameOver;

function GameOver({ finished, players, handleRestart }) {
    if (!finished) return null;

    const { count, rank } = getResults(players);
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
                <div className="ui-restart">
                    <span className="ui-cta-primary" onClick={handleRestart}>
                        RESTART
                    </span>
                </div>
            </div>
        </div>
    );
}

function getResults(players) {
    const rank = players.sort((a, b) => b.accumulated - a.accumulated);

    // is this a tied games?
    const topscore = rank[0].accumulated;
    const count = rank.filter(p => p.accumulated === topscore).length;

    console.log('winners', topscore, count);

    return { count, rank };
}
