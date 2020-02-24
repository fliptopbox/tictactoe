import * as React from 'react';
// import createPlayer from './createPlayer';
import Range from './Range';
import Opponents from './Opponents';
import playerAvatars from './playerAvatars';
import logo from "./logo";

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


        const {opponents, nonhuman} = this.state;
        this.state.players = playerAvatars(opponents, nonhuman);
        this.state.max = this.state.opponents;

        this.playerAvatars = playerAvatars;
    }

    handleSave = () => {
        let { radius, players, opponents } = this.state;
        const settings = {
            radius,
            players: players.slice(0, opponents)
        };
        this.props.saveSettings(settings);
    };


    handleRadiusChange = radius => {
        console.log(radius);
        this.props.updateEarth(radius);
    };

    updatePlayername = (index, text) => {
        const { players } = this.state;
        players[index].alias = text;
        // players[index].spiecies = index + 1 < nonhuman ? 1 : 0;
        this.setState({ players });
    };

    updateOpponents = object => {
        const opponents = object.players.value;
        const nonhuman = object.robots.value;
        const players = playerAvatars(opponents, nonhuman);
        console.log('update opponents', object, opponents, nonhuman);
        this.setState({ opponents, nonhuman, players });
    };

    render() {
        if (!this.props.state.showSettings) return null;

        const { radius, players } = this.state;
        const avatars = players.map(o => o.el);


        return (
            <div className="ui">
                <div className="ui-settings">
                    {logo("settings")}
                    <Range
                        key="radius"
                        min={1}
                        max={4}
                        value={radius}
                        label="Matrix size"
                        format={v => (v+2) + 'x' + (v+2)}
                        notify={this.handleRadiusChange}
                    />
                    <Opponents 
                        notify={this.updateOpponents} />

                    <div className="avatars">{avatars}</div>
                    <div className="ui-cta-primary" onClick={this.handleSave}>
                        PLAY
                    </div>
                </div>
            </div>
        );
    }
}
export default Settings;

