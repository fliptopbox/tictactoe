import * as React from 'react';
import uuid from './uuid';
import badguys from './bad-guys';
import {rnd} from './utilities';

const materialKeys = ['black', 'white', 'red', 'grey'];

class Settings extends React.Component {
    constructor({options, saveSettings}) {
        super();

        let state = {
            radius: 1,
            opponents: 2,
            nonhuman: 1,
            max: null,
            players: null
        };

        state.max = state.opponents;
        state.players = [0, 1, 2, 3].map(n => {
            let ishuman =
                state.opponents > state.nonhuman &&
                state.opponents - state.nonhuman - n > 0
                    ? 0
                    : 1;
            return createPlayer(null, ishuman === 0);
        });

        this.state = state;
    }

    handleSave = () => {
        let {radius, players, opponents} = this.state;
        const settings = {
            radius,
            players: players.slice(0, opponents)
        };
        this.props.saveSettings(settings);
    };

    handleNons = e => {
        let value = Number(e.target.value);
        let {max} = this.state;
        value = Math.min(value, max);

        // update player spiecies
        let {players, opponents} = this.state;
        players = players.map((p, i) => {
            let ishuman =
                opponents > value && opponents - value - i > 0 ? 0 : 1;
            console.log(p.alias, ishuman);
            p.spiecies = ishuman;
            return p;
        });

        this.setState({nonhuman: value, players});
    };
    handleRadius = e => {
        const radius = Number(e.target.value);
        this.setState({radius});
    };
    handleRadiusChange = e => {
        const radius = Number(e.target.value);
        this.props.updateEarth(radius);
    };
    handlePlayers = e => {
        let {nonhuman} = this.state;
        const opponents = Number(e.target.value);
        if (nonhuman > opponents) nonhuman = opponents;
        this.setState({opponents, max: opponents, nonhuman});
    };

    updatePlayername = (index, text) => {
        const {players, nonhuman} = this.state;
        players[index].alias = text;
        // players[index].spiecies = index + 1 < nonhuman ? 1 : 0;
        this.setState({players});
    };

    render() {
        const {radius} = this.state;
        const text = `${radius + 2}x${radius + 2}`;
        const playerslist = this.state.players.map((user, i) => {
            let {opponents, nonhuman} = this.state;
            let {alias, playerId, spiecies} = user;

            if (i + 1 > opponents) return null;

            return (
                <li key={i}>
                    <PlayerName
                        playerId={playerId}
                        handler={text => this.updatePlayername(i, text)}
                        alias={alias}
                        spiecies={spiecies}
                    />
                </li>
            );
        }, this);

        return (
            <div className="ui-settings">
                <h2>Game settings</h2>
                <Range
                    key="radius"
                    min="1"
                    max="4"
                    value={this.state.radius}
                    text={text}
                    handler={this.handleRadius}
                    handleChange={this.handleRadiusChange}
                />
                <Range
                    key="opponents"
                    min="2"
                    max="4"
                    label="opponents"
                    value={this.state.opponents}
                    handler={this.handlePlayers}
                />
                <Range
                    key="nonhuman"
                    min="0"
                    max={this.state.max}
                    label="non-human"
                    value={this.state.nonhuman}
                    handler={this.handleNons}
                />
                <ul>{playerslist}</ul>
                <div className="ui-cta-save" onClick={this.handleSave}>
                    SAVE
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
            <input
                className="ui-input-range"
                type="range"
                min={min}
                max={max}
                defaultValue={value}
                onInput={handler}
                onChange={handleChange}
            />
            <span className="ui-input-text"> {text || value}</span>
            <span className="ui-input-label"> {label || ''}</span>
        </div>
    );
}

function PlayerName({alias, spiecies, handler}) {
    spiecies = spiecies === 0 ? 'human' : 'random';
    return (
        <span>
            <input
                placeholder="Your player name"
                type="text"
                value={alias}
                onChange={e => handler(e.target.value)}
            />
            ({spiecies})
        </span>
    );
}

function getNextMaterial() {
    let color = materialKeys.splice(0, 1);
    return color[0];
}

function createPlayer(alias, human) {

    const playerId = uuid('p');
    const material = getNextMaterial();
    const spiecies = human ? 0 : 1;

    alias = alias || badguys[rnd(badguys.length - 1, 0, false)];

    console.log(alias, human);
    return {
        material,
        playerId,
        twist: 0,
        alias,
        spiecies
    };
}
