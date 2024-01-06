import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomId: null,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
  },
});

export const { setRoomId } = roomSlice.actions;

export default roomSlice.reducer;
