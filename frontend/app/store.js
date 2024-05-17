import { configureStore } from '@reduxjs/toolkit'
import winnerReducer from '../src/features/winner/winnerSlice.js'
export const store = configureStore({
  reducer: {
    winner: winnerReducer
  },
  
})