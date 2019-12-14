import React, { Component } from 'react';
import { Texture, Engine, Scene, VolumetricLightScatteringPostProcess } from 'babylonjs';

export default class Canvas extends Component {
    constructor({ sceneDidMount, engineOptions, adaptToDeviceRatio }) {
        super();
        this.scene = null;
        this.engine = null;
        this.canvas = null;

        this.sceneDidMount = sceneDidMount;
        this.engineOptions = engineOptions;
        this.adaptToDeviceRatio = adaptToDeviceRatio;
    }

    onResizeWindow = () => {
        const { engine } = this;
        if (engine) engine.resize();
    };

    componentDidMount() {
        let {
            scene,
            sceneDidMount,
            canvas,
            engine,
            engineOptions,
            adaptToDeviceRatio
        } = this;

        if (typeof sceneDidMount !== 'function') {
            console.error('sceneDidMount function not available');
            return null;
        }

        engine = new Engine(canvas, true, engineOptions, adaptToDeviceRatio);
        scene = new Scene(engine);
        sceneDidMount({ scene, engine, canvas });

        // Resize the babylon engine when the window is resized
        window.addEventListener('resize', this.onResizeWindow);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResizeWindow);
    }

    onCanvasLoaded = c => {
        if (c) this.canvas = c;
    };

    render() {
        // 'rest' can contain additional properties that you can flow through to canvas:
        // (id, className, etc.)
        let { width = '100%', height = '100%' } = this.props;
        let opts = { ...this.props.opts };

        return (
            <canvas
                id="renderCanvas"
                {...opts}
                ref={this.onCanvasLoaded}
                touch-action="none"
            />
        );
    }
}
