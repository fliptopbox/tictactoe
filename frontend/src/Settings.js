import * as React from 'react';
import createPlayer from './createPlayer';

class Settings extends React.Component {
    constructor({ state, saveSettings }) {
        super();

        console.log('>>>>', state);

        this.state = {
            radius: 1,
            opponents: 2,
            nonhuman: 1,
            max: null,
            players: null
        };

        this.state.max = this.state.opponents;
        this.state.players = [0, 1, 2, 3].map(n => {
            let ishuman =
                this.state.opponents > this.state.nonhuman &&
                this.state.opponents - this.state.nonhuman - n > 0
                    ? 0
                    : 1;
            return createPlayer(null, ishuman === 0);
        });
    }

    handleSave = () => {
        let { radius, players, opponents } = this.state;
        const settings = {
            radius,
            players: players.slice(0, opponents)
        };
        this.props.saveSettings(settings);
    };

    handleNons = e => {
        let value = Number(e.target.value);
        let { max } = this.state;
        value = Math.min(value, max);

        // update player spiecies
        let { players, opponents } = this.state;
        players = players.map((p, i) => {
            let ishuman =
                opponents > value && opponents - value - i > 0 ? 0 : 1;

            p.spiecies = ishuman;
            return p;
        });

        this.setState({ nonhuman: value, players });
    };
    handleRadius = e => {
        const radius = Number(e.target.value);
        this.setState({ radius });
    };
    handleRadiusChange = e => {
        const radius = Number(e.target.value);
        this.props.updateEarth(radius);
    };
    handlePlayers = e => {
        let { nonhuman } = this.state;
        const opponents = Number(e.target.value);
        if (nonhuman > opponents) nonhuman = opponents;
        this.setState({ opponents, max: opponents, nonhuman });
    };

    updatePlayername = (index, text) => {
        const { players } = this.state;
        players[index].alias = text;
        // players[index].spiecies = index + 1 < nonhuman ? 1 : 0;
        this.setState({ players });
    };

    render() {
        if (!this.props.state.showSettings) return null;

        const { radius } = this.state;
        const text = `${radius + 2}x${radius + 2}`;
        const playerslist = this.state.players.map((user, i) => {
            let { opponents } = this.state;
            let { alias, playerId, spiecies, material } = user;

            if (i + 1 > opponents) return null;

            return (
                <PlayerName
                    key={i}
                    playerId={playerId}
                    material={material}
                    handler={text => this.updatePlayername(i, text)}
                    alias={alias}
                    spiecies={spiecies}
                />
            );
        }, this);

        return (
            <div className="ui">
                <div className="ui-settings">
                    <h2>Game settings</h2>
                    <Range
                        key="radius"
                        min="1"
                        max="4"
                        label="Matrix size"
                        value={this.state.radius}
                        text={text}
                        handler={this.handleRadius}
                        handleChange={this.handleRadiusChange}
                    />
                    <Range
                        key="opponents"
                        min="2"
                        max="4"
                        label="Opponents"
                        value={this.state.opponents}
                        handler={this.handlePlayers}
                    />
                    <Range
                        key="nonhuman"
                        min="0"
                        max={this.state.max}
                        label="Non-human"
                        value={this.state.nonhuman}
                        handler={this.handleNons}
                    />
                    <div className="ui-players">{playerslist}</div>
                    <div className="ui-cta-primary" onClick={this.handleSave}>
                        PLAY
                    </div>
                </div>
            </div>
        );
    }
}
export default Settings;

function Range({
    value,
    text = null,
    label = null,
    min,
    max,
    handler,
    handleChange
}) {
    handleChange = handleChange || function() {};
    return (
        <div className="ui-settings-range">
            <div className="ui-input-row">
                <span className="ui-input-label"> {label || ''}</span>
                <span className="ui-input-text"> {text || value}</span>
            </div>
            <input
                className="ui-input-range"
                type="range"
                min={min}
                max={max}
                defaultValue={value}
                onInput={handler}
                onChange={handleChange}
            />
        </div>
    );
}

function PlayerName({ alias, spiecies, material, handler }) {
    spiecies = spiecies === 0 ? 'human' : 'random';
    const css = { background: material };
    return (
        <span className="ui-player-card" style={css}>
            <div className="ui-player-name">
                <textarea
                    placeholder="Your player name"
                    type="text"
                    value={alias}
                    onChange={e => handler(e.target.value)}
                />
            </div>
            <div className="ui-player-spiecies">{spiecies}</div>
        </span>
    );
}

