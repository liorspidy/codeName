import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerId: null,
  playerName: null,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerId: (state, action) => {
      state.playerId = action.payload;
    },
    setPlayerName: (state, action) => {
      state.playerName = action.payload;
    },
  },
});

export const { setPlayerId } = playerSlice.actions;
export const { setPlayerName } = playerSlice.actions;

export default playerSlice.reducer;
