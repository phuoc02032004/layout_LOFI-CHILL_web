import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import soundReducer from './soundSlice'; 


const store = configureStore({
  reducer: {
    sound: soundReducer,
  },
});

const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default SoundProvider;