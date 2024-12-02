import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  id: string;
  ArtistId: string;
  Title: string;
  Url: string;
  Description: string;
  urlImg: string;
  filePath: string;
  filePathImg: string;
}

interface PlayerState {
  currentPlaylist: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  error: string | null;
  currentMusicUrl: string | null; 
  currentBackgroundUrl: string | null; 
}

const initialState: PlayerState = {
  currentPlaylist: [],
  currentSongIndex: 0,
  isPlaying: false,
  error: null,
  currentMusicUrl: null, 
  currentBackgroundUrl: null, 
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.currentPlaylist = action.payload;
      state.currentSongIndex = 0;
      state.currentMusicUrl = state.currentPlaylist.length > 0 ? state.currentPlaylist[0].Url : null; 
    },
    playSong: (state, action: PayloadAction<number>) => {
      state.currentSongIndex = action.payload;
      state.currentMusicUrl = state.currentPlaylist[state.currentSongIndex]?.Url || null; 
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextSong: (state) => {
      if (state.currentSongIndex < state.currentPlaylist.length - 1) {
        state.currentSongIndex++;
        state.currentMusicUrl = state.currentPlaylist[state.currentSongIndex].Url;
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
      state.currentMusicUrl = null; 
      state.currentBackgroundUrl = null; 
    },
    updateBackgroundMusic: (state, action: PayloadAction<{ musicUrl: string; backgroundUrl: string }>) => {
      state.currentMusicUrl = action.payload.musicUrl;
      state.currentBackgroundUrl = action.payload.backgroundUrl;
    },
  },
});

export const {
  setPlaylist,
  playSong,
  togglePlayPause,
  nextSong,
  setError,
  resetPlayer,
  updateBackgroundMusic, 
} = playerSlice.actions;

export default playerSlice.reducer;