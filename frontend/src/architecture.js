/*
{
    game: {
        gid: "zyx098def654",
        type: "tictactoe" | "rubikcube"
        players: [ player0, player1 ... playerN ]
        theme: "ttt-space-theme"
        radius: 1,
        vitory: "face" | "sequence" | "consecutive"
    },
}
*/

import { ADD_PLAYER, GAME_START, GAME_PLAY, OCCUPY, TWIST } from "./actions";
import { uuid } from "./utilities";

function now() {
  return new Date().valueOf();
}

export { createPlayer };
function createPlayer(name, type) {
  /*
    player: {
        pid: "abc123def456",
        name: "kilroy was here",
        avatar: "image-src",
        axis: true
        type: "human", "random", "ai"
    }
*/

  type = type || (!name ? "random" : "human");
  name = name || getAnonymous();

  return {
    playerId: uuid("p"),
    name,
    axis: true,
    type
  };
}

export { players };
function players(state = [], action = {}) {
  switch (action.type) {
    case "CREATE_PLAYER":
      state = [...state, action.data];

    default:
      break;
  }
  return [...state];
}

function getAnonymous() {
  const names = [
    "JJ Kilroy",
    "Bob Marley",
    "Peter Pan",
    "Tinkerbell",
    "Captin Hook"
  ];
  return names[(Math.random() * names.length) >> 0];
}

export { createGame };
function createGame(playerId) {
  if (!playerId) return null;

  return {
    gameId: uuid("g"),
    players: [playerId]
  };
}

const initializeGame = {
  gameId: uuid("g"),
  opponents: [],
  history: [],

  // matrix properties
  radius: 1,

  dateCreated: new Date().valueOf(),
  dateStart: null
};

export { game };
function game(state, action) {
  if (!state) {
    console.log("create game state");
    return initializeGame;
  }

  let { dateStart, history, opponents } = state;
  const { type, data } = action;
  const { pid } = data || {};

  // can not START with no opponents
  const isReady = state.opponents.length > 1 && history.length === 0;

  // can not modify game after it has started
  // if (dateStart) return state;

  switch (type) {
    case ADD_PLAYER:
      if(history.length) break;

      opponents.push(pid);
      state.opponents = [...opponents];
      break;

    case GAME_START:
      if (!isReady) break;

      dateStart = now();
      history = [
        {pid: null, verb: "start", value: dateStart},
        {pid: null, verb: "elect", value: opponents[0]}
      ];
      state = { ...state, dateStart, history };
      break;

    case OCCUPY:
      history.push({pid, verb: OCCUPY, value: data.value})
      state = { ...state, history };

      break;

    case TWIST:
      history.push({pid, verb: TWIST, value: data.value})
      state = { ...state, history };

      break;
    default:
      break;
  }

  return { ...state };
}

/*

    history: [
        {pid,   verb,       value,    timestamp}
        100,      start,      timestamp
        200,      occupy,     m26,
        201,      occupy,     m24,
        20N,      occupy,     m1,
        200,      surrender,  true,
        201,      turn,       rotation, extend, amount
        20N,      occupy,     m2
        200,      skip,       true
        201,      occupy      m14
        202,      occupy      m3
    ]


*/
