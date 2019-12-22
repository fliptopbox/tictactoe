export default gameState;
function gameState(context) {
    return { save: save.bind(context), load: load.bind(context) };
}

function save(key) {
    // export state and matrix
    let { state, earth } = this;
    const matrix = [].concat(...earth).map(o => {
        const shallow = { ...o };
        delete shallow.mesh;
        return shallow;
    });

    const json = {
        state,
        matrix
    };

    localStorage[key] = JSON.stringify(json, null, 4);
}

function load(object) {
    if (typeof object === "string") {
        object = localStorage[object] || object;
        object = JSON.parse(object);
    }

    const occupy = this.occupy.bind(this);
    let { state, matrix } = object;

    // merge the JSON data into the existing terrain data
    // and render the updated cube
    this.state = { ...state };

    const emulate = {};
    this.state.players.forEach(p => (emulate[p.playerId] = p));

    matrix = matrix.filter(o => o.owner);
    matrix.forEach(row => {
        const { id, owner } = row;
        this.earth[id] = {
            ...this.earth[id],
            ...row
        };

        occupy.call(this, `m${id}`, emulate[owner]);
    }, this);

    console.log(this.state)
    this.generateScene();
    this.setState({ts: new Date().valueOf()});
}
