import { StandardMaterial, Color3 } from 'babylonjs';
import hexToRGB from './hexToRGB';

const matlib = {
    core: {
        diffuseColor: '#ff0000'
        // specularColor: new Color3(0.5, 0.6, 0.87),
        // emissiveColor: new Color3(0, 0, 0),
        // ambientColor: new Color3(0.23, 0.98, 0.53)
    },
    solid: {
        diffuseColor: new Color3(1, 0, 1)
        // specularColor: new Color3(0.5, 0.6, 0.87),
        // emissiveColor: new Color3(0, 0, 0),
        // ambientColor: new Color3(0.23, 0.98, 0.53)
    },
    wire: {
        diffuseColor: new Color3(1, 0, 1),
        // specularColor: new Color3(0.5, 0.6, 0.87),
        // emissiveColor: new Color3(0, 0, 0),
        // ambientColor: new Color3(0.23, 0.98, 0.53),
        wireframe: true
    },
    black: {
        diffuseColor: "#000000",
        wireframe: false
    },
    white: {
        diffuseColor: "#ffffff",
        wireframe: false
    },
    surface: {
        diffuseColor: new Color3(0, 0, 0),
        // specularColor: new Color3(0, 0, 0),
        emissiveColor: new Color3(0, 0, 0),
        // ambientColor: new Color3(0, 0, 0),
        wireframe: true
    }
};

export default materials;
function materials({ scene }) {
    return function(id) {
        if (!matlib[id]) return null;

        const m = new StandardMaterial(id, scene);
        const props = matlib[id];

        Object.keys(props).forEach(k => {
            let value = props[k];
            let hex = /^#[0-9a-f]{3,6}$/.test(value || '');
            let rgb = hex ? hexToRGB(value) : null;
            let [r, g, b] = rgb || [];

            value = rgb ? new Color3(r, g, b) : value;

            m[k] = value;
        });
        return m;
    };
}
