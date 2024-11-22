import { createSlice } from '@reduxjs/toolkit';
import {Sound} from '@/types/types'

interface SoundState {
  sounds: Sound[];
  soundVolumes: { [key: string]: number };
  playingSounds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SoundState = {
  sounds: [],
  soundVolumes: {},
  playingSounds: [],
  loading: false,
  error: null,
};

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    setSounds: (state, action) => {
      state.sounds = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSoundVolume: (state, action) => {
      const { url, volume } = action.payload;
      state.soundVolumes[url] = volume;
    },
    playSound: (state, action) => {
      state.playingSounds.push(action.payload);
    },
    pauseSound: (state, action) => {
      state.playingSounds = state.playingSounds.filter(url => url !== action.payload);
    },
    resetSounds: (state) => {
      state.playingSounds = [];
      state.soundVolumes = {};
      state.error = null;
    },
  },
});

export const { setSounds, setLoading, setError, setSoundVolume, playSound, pauseSound, resetSounds } = soundSlice.actions;
export default soundSlice.reducer;