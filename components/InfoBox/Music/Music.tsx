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
  const isInitialLoad = useRef(true); 
  const currentSong = currentPlaylist[currentSongIndex];
  const currentSongTitle = currentSong?.title || '';
  const currentSongArtist = currentSong?.artist || '';
  const currentMusicUrl = useSelector((state: any) => state.player.currentMusicUrl); 
  useEffect(() => {
    const loadMusic = async () => {
        if (currentMusicUrl) {
            try {
                await loadAndPlaySong(currentMusicUrl, (playbackStatus) => {
                    if (playbackStatus.didJustFinish && playbackStatus.isLoaded) {
                        dispatch(nextSong());
                    }
                    if (!playbackStatus.isLoaded && playbackStatus.error) {
                        handleError(playbackStatus.error);
                    }
                });
            } catch (error) {
                console.error("Error loading song:", error);
                handleError("Lỗi khi tải bài hát!");
            }
        }
    };

    loadMusic();
}, [currentMusicUrl, loadAndPlaySong, dispatch]);

  useEffect(() => {
    sound.current = new Audio.Sound();
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
        sound.current = null; 
      }
    };
  }, []);

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
    const currentSong = currentPlaylist[currentSongIndex];
    const url = currentSong?.url;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (url && url !== prevSongUrl.current) {
      prevSongUrl.current = url;
      const loadSong = async () => {
        try {
          await loadAndPlaySong(url, (playbackStatus) => {
            if (playbackStatus.didJustFinish && playbackStatus.isLoaded) {
              dispatch(nextSong());
            }
            if (!playbackStatus.isLoaded && playbackStatus.error) {
              handleError(playbackStatus.error);
            }
          });
        } catch (error) {
          console.error("Error loading song:", error);
          handleError("Lỗi khi tải bài hát!");
        }
      };
      loadSong();
    } else if (!url && currentPlaylist.length > 0) {
      dispatch(setError('URL của bài hát không tồn tại!'));
    }
    //This will only run when the currentSongIndex changes.
  }, [currentSongIndex, currentPlaylist, loadAndPlaySong, dispatch]);
  const handlePlaylistClick = async (playlistId: string) => {
    try {
      const songs = await playSong(playlistId);
      console.log(songs);
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
       {currentPlaylist.length > 0 && (
        <View style={styles.musicPlayer}>
          <Text style={styles.songTitle}>{currentSongTitle}</Text>

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

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  playlistsList: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  playlistItem: {
    marginBottom: 15,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#ccc',
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
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 10,
  },
  playPauseButton: {
    fontFamily: 'Poppins-Bold',
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
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  songArtist: {
    fontSize: 16,
    color: 'white',
  },
  resetButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  resetText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Music;