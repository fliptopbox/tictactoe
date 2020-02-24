import React from 'react';
import './range.scss';

class Range extends React.Component {
    constructor(props) {
        super();

        // cast numbers as Integers
        props = {...props,
            min: Number(props.min),
            max: Number(props.max),
            value: Number(props.value || props.min)
        }

        let {
            min,
            max,
            value,
            color = 'white',
            label = 'unknown',
            format = null,
            notify
        } = props;

        // format the value callback
        format =
            format ||
            function(x) {
                return x;
            };

        // replace the default emit callback
        if (notify) this.notify = notify.bind(this);

        // set initial value to minium unless it is provided
        value = value || min;
        const percent = this.getPercentage(min, max, value);

        this.state = {
            format,
            label,
            color,
            min,
            max,
            percent,
            value
        };
    }

    getPercentage(min, max, value) {
        return ((value - min) / (max - min)) * 100;
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps && this.state.max !== nextProps.max) {
            let { value } = this.state;
            const { min, max } = nextProps;

            value = Math.min(value, max);
            const percent = this.getPercentage(min, max, value);
            this.setState({ min, max, value, percent });
        }
        return true;
    }

    notify = () => this.state;

    emitChange(prev) {
        // only emit to subscribers if the values are different

        const { value } = this.state;
        if (prev === value) return;

        this.notify(value, this.state);
    }

    handleChange = e => {
        // console.log("handleChange", e.target.value);
        const { value } = e.target;
        const rounded = this.getValue(Number(value));
        const prev = this.state.value;
        const fn = () => this.emitChange(prev);
        this.setState({ percent: Number(value), value: rounded }, fn);
    };

    snapToInteger = () => {
        const { value, min, max } = this.state;
        const prev = value;
        const percent = ((value - min) / (max - min)) * 100;
        const fn = () => this.emitChange(prev);
        this.setState({ percent }, fn);
    };

    getValue(value) {
        const { max, min } = this.state;
        const float = Number(value) / 100;
        return Math.round(float * (max - min)) + min;
    }

    render() {
        const { label, percent, value, color, format } = this.state;

        return (
            <div className="range" style={{ '--dot': color }}>
                <div className="range-label">
                    <em>{label}</em>
                </div>
                <div
                    className="range-slider"
                    style={{ '--percent': `${percent * 0.94}%` }}>
                    <input
                        value={percent}
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        onChange={this.handleChange}
                        onMouseUp={this.snapToInteger}
                    />
                    <div className="range-track" />
                </div>
                <div className="range-value">
                    <em>{format(value)}</em>
                </div>
            </div>
        );
    }
}

export default Range;
