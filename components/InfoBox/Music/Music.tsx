import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getAllPlaylists } from '@/services/playlist';
import { playSong } from '@/services/song';
import { Audio } from 'expo-av';
import PlayingBar from '@/components/PlayingBar/PlayingBar';
import { useMusic } from '@/components/MusicContext/MusicContext';

interface MusicProps {
  onTabPress: (title: string, content: React.ReactNode) => void;
}

interface Playlist {
  id: string;
  Title: string;
  Description: string;
  filePathPlaylist?: string;
  createdAt?: { _seconds: number; _nanoseconds: number };
  updatedAt?: { _seconds: number; _nanoseconds: number };
}

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  img: string;
  description: string;
}

const Music: React.FC<MusicProps> = ({ onTabPress }) => {
  const [playlistsData, setPlaylistsData] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const currentSong = currentPlaylist[currentSongIndex];
  const currentSongTitle = currentSong ? currentSong.title : '';
  const currentSongArtist = currentSong ? currentSong.artist : '';

  // Lưu trạng thái âm thanh vào AsyncStorage
  const saveMusicState = async () => {
    const state = {
      currentPlaylist,
      currentSongIndex,
      isPlaying,
    };
    await AsyncStorage.setItem('musicState', JSON.stringify(state));
  };

  // Tải lại trạng thái âm thanh từ AsyncStorage
  const loadMusicState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('musicState');
      if (savedState) {
        const { currentPlaylist, currentSongIndex, isPlaying } = JSON.parse(savedState);
        setCurrentPlaylist(currentPlaylist);
        setCurrentSongIndex(currentSongIndex);
        setIsPlaying(isPlaying);
        if (currentPlaylist.length > 0) {
          loadAndPlaySong(currentPlaylist[currentSongIndex].url);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải trạng thái nhạc:', error);
    }
  };

  useEffect(() => {
    const newSound = new Audio.Sound();
    setSound(newSound);
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    // Tải playlist và trạng thái nhạc khi ứng dụng được mở
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
            setError('Lỗi khi lấy danh sách playlist: ' + response.mes);
          }
        }
      } catch (error) {
        setError('Lỗi khi lấy danh sách playlist.');
      } finally {
        setLoading(false);
      }
    };

    loadPlaylistsFromStorage();
    loadMusicState(); // Đọc trạng thái nhạc từ AsyncStorage
  }, []);

  const loadAndPlaySong = async (url: string) => {
    if (sound) {
      try {
        await sound.unloadAsync();
        await sound.loadAsync({ uri: url });
        await sound.playAsync();
        setIsPlaying(true);
        saveMusicState(); // Lưu trạng thái mỗi khi có sự thay đổi
      } catch (error) {
        console.error('Lỗi khi phát nhạc:', error);
        setError("Không thể phát nhạc");
      }
    } else {
      console.warn("Âm thanh chưa được tải");
    }
  };

  const handlePlaylistClick = async (playlistId: string) => {
    try {
      let songs = await playSong(playlistId);
      songs = songs.map((song: any) => ({
        ...song,
        url: song.Url,
      }));

      if (songs.length > 0) {
        setCurrentPlaylist(songs);
        setCurrentSongIndex(0);
        if (songs[0] && songs[0].url) {
          loadAndPlaySong(songs[0].url);
        } else {
          console.error('Bài hát đầu tiên không có URL.');
        }
      } else {
        console.error('Playlist này không có bài hát nào.');
      }
    } catch (error) {
      console.error('Lỗi khi phát playlist:', error);
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
      saveMusicState(); // Lưu trạng thái khi nhấn play/pause
    } else {
      console.warn("Âm thanh chưa được tải");
    }
  };

  const handleNextSong = () => {
    if (currentSongIndex < currentPlaylist.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      loadAndPlaySong(currentPlaylist[nextIndex].url);
    } else {
      setIsPlaying(false);
    }
    saveMusicState(); // Lưu trạng thái khi chuyển bài
  };

  const handleVolumeChange = (value: number) => {
    if (sound) {
      sound.setVolumeAsync(value);
    }
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

          <PlayingBar
            songTitle={currentSongTitle}
            songArtist={currentSongArtist}
            isPlaying={isPlaying}
            handlePlayPause={handlePlayPause}
            handleVolumeChange={handleVolumeChange}
            currentSongUrl={currentSong?.url || ''}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
});

export default Music;
