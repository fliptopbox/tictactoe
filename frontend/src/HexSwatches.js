import React from 'react';

export default HexSwatches;

function HexSwatches({ state, earth }) {
    console.log("hex swatch", state, earth);
    if (!earth) return null;
    const hexes = earth
        .filter(c => c.type)
        .map((o, i) => {
            const { hexColor } = o.mesh.material;
            const bgcolor = { background: hexColor };
            return (
                <span className="swatch" key={'hx' + i} style={bgcolor}></span>
            );
        });

    return <div className="ui-terrain">{hexes}</div>;
}
