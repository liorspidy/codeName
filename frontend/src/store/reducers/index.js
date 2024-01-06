import { combineReducers } from 'redux';
import roomReducer from '../slices/roomSlice';

const rootReducer = combineReducers({
  room: roomReducer,
});

export default rootReducer;
