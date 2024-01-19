import { combineReducers } from 'redux';
import roomReducer from '../slices/roomSlice';
import playerReducer from '../slices/playerSlice';

const rootReducer = combineReducers({
  room: roomReducer,
  player: playerReducer,
});

export default rootReducer;
