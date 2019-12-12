import { createStore, combineReducers, applyMiddleware } from "redux";

import { game, players, createPlayer, createGame } from "./architecture";
import {
  CREATE_PLAYER,
  ADD_PLAYER,
  GAME_START,
  OCCUPY,
  TWIST
} from "./actions";


const logger = ({getState, dispatch}) => next => action => {
  console.log("will dispatch", action);

  // Call the next dispatch method in the middleware chain.
  const returnValue = next(action);

  console.log("state after dispatch", getState());

  // This will likely be the action itself, unless
  // a middleware further in chain changed it.
  return returnValue;
};

const reducers = combineReducers({ game, players });
const store = createStore(reducers, applyMiddleware(logger));

const p1 = createPlayer("Bob Marley", "human");
const p2 = createPlayer();
// const p3 = createPlayer();

store.dispatch({ type: CREATE_PLAYER, data: p1 });
store.dispatch({ type: CREATE_PLAYER, data: p2 });

store.dispatch({ type: ADD_PLAYER, data: { pid: p1.playerId } });
store.dispatch({ type: ADD_PLAYER, data: { pid: p2.playerId } });

store.dispatch({ type: GAME_START });

store.dispatch({ type: OCCUPY, data: { pid: p1.playerId, value: "m26" } });
store.dispatch({ type: OCCUPY, data: { pid: p2.playerId, value: "m1" } });
store.dispatch({ type: OCCUPY, data: { pid: p1.playerId, value: "m25" } });
store.dispatch({
  type: TWIST,
  data: { pid: p2.playerId, value: [{ exent: 1, amount: 1, rotation: "x" }] }
});

store.getState();
