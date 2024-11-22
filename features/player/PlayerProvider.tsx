import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});

const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default PlayerProvider;