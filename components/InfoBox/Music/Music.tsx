import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { getAllPlaylists } from '@/services/playlist';
import { playSong } from '@/services/song';
import { Audio } from 'expo-av';
import { setPlaylist, playSong as playSongAction, togglePlayPause, nextSong, setError } from '@/features/player/playerSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist } from '@/types/types';
import { useMusic } from '@/components/MusicContext/MusicContext';
import { resetPlayer } from '@/features/player/playerSlice';

interface MusicProps {
  onTabPress?: (title: string, content: React.ReactNode) => void; 
}

const Music: React.FC<MusicProps> = ({ onTabPress, ...props }) => {
  const [playlistsData, setPlaylistsData] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentPlaylist, currentSongIndex, isPlaying, error } = useSelector((state: any) => state.player);
  const dispatch = useDispatch();
  const sound = useRef<Audio.Sound | null>(null);
  const { loadAndPlaySong, togglePlayPause, isPlaying: isPlayingContext, pauseSong, resumeSong, unloadSong } = useMusic();
  const prevSongUrl = useRef<string | null>(null);
  
  useEffect(() => {
    sound.current = new Audio.Sound();
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
        sound.current = null; 
      }
    };
  }, []);
  const currentSong = currentPlaylist[currentSongIndex];
  const currentSongTitle = currentSong?.title || '';
  const currentSongArtist = currentSong?.artist || '';

  useEffect(() => {
    const loadPlaylistsFromStorage = async () => {
      try {
        const storedPlaylists = await AsyncStorage.getItem('playlists');
        if (storedPlaylists) {
          setPlaylistsData(JSON.parse(storedPlaylists));
        } else {
          const response = await getAllPlaylists();
          if (response.err === 0) {
            setPlaylistsData(response.playlist);
            await AsyncStorage.setItem('playlists', JSON.stringify(response.playlist));
          } else {
            handleError('Lỗi khi lấy danh sách playlist: ' + response.mes);
          }
        }
      } catch (error) {
        handleError('Lỗi khi lấy danh sách playlist.');
      } finally {
        setLoading(false);
      }
    };

    loadPlaylistsFromStorage();
  }, []);

  useEffect(() => {
    if (currentPlaylist && currentPlaylist.length > 0 && currentSongIndex >= 0) {
      const url = currentPlaylist[currentSongIndex]?.url;
      if (url && url !== prevSongUrl.current) { // Chỉ tải lại nếu URL khác
        prevSongUrl.current = url;           // Cập nhật URL hiện tại
        loadAndPlaySong(url);                // Tải và phát bài hát
      } else if (!url) {
        console.error('URL của bài hát không tồn tại!');
        dispatch(setError('URL của bài hát không tồn tại!'));
      }
    }
  }, [currentPlaylist, currentSongIndex, loadAndPlaySong, dispatch]);

  const handlePlaylistClick = async (playlistId: string) => {
    try {
      const songs = await playSong(playlistId);
      console.log(songs);
      console.log(songs[0]);
      console.log(songs[0].url);
      if (!songs || songs.length === 0) {
        handleError('Playlist này không có bài hát nào.');
        return;
      }
      if (!songs[0]?.url) {
        handleError('Bài hát đầu tiên không có URL.');
        return;
      }
      dispatch(setPlaylist(songs)); 
    } catch (e: any) {
      handleError(e.message);
    }
  };

  
  const handleError = (message: string) => {
    Alert.alert('Error', message);
    dispatch(setError(message));
  };

 const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleNextSong = () => {
    dispatch(nextSong());
  };

  const handleReset = () => {
    dispatch(resetPlayer()); 
    unloadSong();
    prevSongUrl.current = null; 
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.playlistsList}>
          {playlistsData.length > 0 ? (
            playlistsData.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                style={styles.playlistItem}
                onPress={() => handlePlaylistClick(playlist.id)}
              >
                <Image source={{ uri: playlist.filePathPlaylist }} style={styles.playlistImage} />
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistName}>{playlist.Title}</Text>
                  <Text style={styles.playlistDescription}>{playlist.Description}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPlaylistsText}>Không có playlist nào để hiển thị.</Text>
          )}
        </View>
      )}

      {currentPlaylist.length > 0 && (
        <View style={styles.musicPlayer}>
          <Text style={styles.songTitle}>{currentSongTitle}</Text>
          <Text style={styles.songArtist}>{currentSongArtist}</Text>

          <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
            <Text style={styles.playPauseText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextSong} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Đã thêm màu nền
    padding: 10,
  },
  playlistsList: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  playlistItem: {
    marginBottom: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
  },
  playlistImage: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  playlistInfo: {
    padding: 10,
  },
  playlistName: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  playlistDescription: {
    fontSize: 14,
    color: 'white',
  },
  noPlaylistsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  musicPlayer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playPauseButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  playPauseText: {
    color: 'white',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
  },
  songTitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 5,
  },
  songArtist: {
    fontSize: 16,
    color: 'white',
  },
  resetButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10, // Add some margin to separate the button
  },
  resetText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Music;