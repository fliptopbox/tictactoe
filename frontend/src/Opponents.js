import React from "react";
import Range from "./Range";

class Opponents extends React.Component {
  constructor(notify) {
    super();
    this.state = {
      players: { min: 2, max: 4, value: 2 },
      robots: { min: 0, max: 2, value: 1 }
    };
  }

  updateValue(key, value) {
    const obj = this.state[key];
    const { notify } = this.props;
    const next = { [key]: { ...obj, value } };
    this.setState(next, () => notify(this.state));
  }

  numberAsWord(v = 0) {
    const numbers = ["zero", "one", "two", "three", "four"];
    return numbers[v];
  }

  refreshRobotSlider = v => {
    if (this.state.robots.max === v) return;
    console.log("humans refreshRobotSlider", v);
    let obj = { ...this.state.robots, max: v };
    this.setState({ robots: obj });
  };

  render() {
    const { players, robots } = this.state;
    return (
      <div>
        <Range
          label="opponents"
          {...players}
          color="green"
          format={this.numberAsWord}
          notify={v => {
            this.refreshRobotSlider(v);
            this.updateValue("players", v);
          }}
        />

        <Range
          label="non-humans"
          {...robots}
          color="blue"
          format={this.numberAsWord}
          notify={v => this.updateValue("robots", v)}
        />
      </div>
    );
  }
}
export default Opponents;
