import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomId: null,
  roomName: null,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    }
  },
});

export const { setRoomId } = roomSlice.actions;
export const { setRoomName } = roomSlice.actions;

export default roomSlice.reducer;
