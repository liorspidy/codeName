import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerName: null,
  playerEmail: null,
  playerRole: null,
  playerTeam: null,
  token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerDetails: (state, action) => {
      state.playerName = action.payload.name;
      state.playerEmail = action.payload.email;
      state.token = action.payload.token;
      state.playerRole = action.payload.role;
      state.playerTeam = action.payload.team;
    }
  },
});

export const { setPlayerDetails } = playerSlice.actions;

export default playerSlice.reducer;
