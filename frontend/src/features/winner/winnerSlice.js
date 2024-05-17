import { createSlice } from '@reduxjs/toolkit';

export const winnerSlice = createSlice({
  name: 'winner',
  initialState: {
    hasWinner: false,
  },
  reducers: {
    setWinner: (state) => {
      state.hasWinner = true;
    },
    resetWinner: (state) => {
      state.hasWinner = false;
    },
  },
});

export const { setWinner, resetWinner } = winnerSlice.actions;

export const selectWinner = (state) => state.winner.hasWinner;

export default winnerSlice.reducer;
