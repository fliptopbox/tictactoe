import { DynamicTexture, StandardMaterial, Color3 } from 'babylonjs';
import hexToRGB from './hexToRGB';

const matlib = {
    core: {
        diffuseColor: '#ff0000',
        emissiveColor: '#550000',
        ambientColor: '#000000',
        visibility: 0.3,
        wireframe: true
        // specularColor: new Color3(0.5, 0.6, 0.87),
        // emissiveColor: new Color3(0, 0, 0),
        // ambientColor: new Color3(0.23, 0.98, 0.53)
    },
    ground: {
        diffuseColor: "#222222"
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
    red: {
        diffuseColor: '#FF0011',
        ambientColor: '#000011',
        emissiveColor: '#111111',
        wireframe: false
    },
    black: {
        diffuseColor: '#111111',
        emissiveColor: '#000000',
        wireframe: false
    },
    white: {
        diffuseColor: '#eeeeee',
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
    return function(id, text) {
        if (!matlib[id]) return null;

        let m = new StandardMaterial(id, scene);
        const props = matlib[id];
        const font = 'bold 20px Arial';
        const color = /white/i.test(id) ? 'black' : 'white';

        if (text) {
            console.log('dyn', text);
            let dynTex = new DynamicTexture(
                'dtex',
                { width: 150, height: 150 },
                scene,
                true
            );

            m.diffuseTexture = dynTex;
            dynTex.drawText(
                text,
                10,
                40,
                font,
                color,
                props.diffuseColor,
                true,
                true
            );

            m.diffuseTexture.uOffset = 0;
            m.diffuseTexture.vOffset = 0;
        }

        Object.keys(props).forEach(k => {
            let value = props[k];
            let hex = /^#[0-9a-f]{3,6}$/i.test(value || '');
            let rgb = hex ? hexToRGB(value) : null;
            let [r, g, b] = rgb || [];

            value = rgb ? new Color3(r, g, b) : value;

            // skip dynTexture cube w. diffuseColor
            if (k === 'diffuseColor' && text) return;
            m[k] = value;
        });
        return m;
    };
}
