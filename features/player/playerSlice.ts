import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '@/types/types';


interface PlayerState {
  currentPlaylist: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  currentPlaylist: [],
  currentSongIndex: 0,
  isPlaying: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.currentPlaylist = action.payload;
      state.currentSongIndex = 0;
    },
    playSong: (state, action: PayloadAction<number>) => {
      state.currentSongIndex = action.payload;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextSong: (state) => {
        if (state.currentSongIndex < state.currentPlaylist.length - 1) {
          state.currentSongIndex++;
        } else {
          state.isPlaying = false;
          state.error = "Hết bài hát rồi!"; 
        }
      },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetPlayer: (state) => {
        state.currentPlaylist = [];
        state.currentSongIndex = 0;
        state.isPlaying = false;
        state.error = null;
      },
  },
});

export const { setPlaylist, playSong, togglePlayPause, nextSong, setError, resetPlayer  } = playerSlice.actions;
export default playerSlice.reducer;