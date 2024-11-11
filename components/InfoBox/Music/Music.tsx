import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getAllPlaylists } from '@/services/playlist';
import { playSong } from '@/services/song';
import { Audio } from 'expo-av';

interface MusicProps {
  onTabPress: (title: string, content: React.ReactNode) => void;
  onCurrentSongUrlChange: (url: string) => void; 
}

interface Playlist {
  id: string;
  Title: string;
  Description: string;
  filePathPlaylist?: string;
}

interface Song {
  id: string;
  Title: string;
  Artist: string;
  Url: string;
  urlImg: string;
}

const Music: React.FC<MusicProps> = ({ onTabPress, onCurrentSongUrlChange }) => {
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await getAllPlaylists();
        if (response.err === 0) {
          setPlaylistData(response.playlist);
        } else {
          setError('Lỗi khi lấy danh sách playlist: ' + response.mes);
        }
      } catch (error) {
        setError('Lỗi khi lấy danh sách playlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const loadAndPlaySong = async (url: string) => {
    if (sound) await sound.unloadAsync();

    const newSound = new Audio.Sound();
    setSound(newSound);
    try {
      await newSound.loadAsync({ uri: url }); 
      await newSound.playAsync();
      setIsPlaying(true);
      onCurrentSongUrlChange(url);
    } catch (error) {
      console.error('Lỗi khi phát nhạc:', error);
      // Xử lý lỗi, ví dụ: hiện thông báo cho người dùng
      setError("Không thể phát nhạc"); 
    }
  };

  const handlePlaylistClick = async (playlistId: string) => {
    console.log('Playlist được chọn có ID:', playlistId);
  
    try {
      const songs = await playSong(playlistId);
      console.log('Danh sách bài hát trong playlist:', songs);
  
      if (songs.length > 0) {
        setCurrentPlaylist(songs);
        setCurrentSongIndex(0);
        console.log('Bài hát đầu tiên trong playlist:', songs[0]);
        
        // Đảm bảo `url` được truyền đúng
        loadAndPlaySong(songs[0].Url); 
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
    } else {
      console.warn("Âm thanh chưa được tải");
    }
  };

  const handleNextSong = () => {
    if (currentSongIndex < currentPlaylist.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      loadAndPlaySong(currentPlaylist[nextIndex].Url);
    } else {
      setIsPlaying(false);
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
          {playlistData.map((playlist) => (
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
          ))}
        </View>
      )}

      {currentPlaylist.length > 0 && (
        <View style={styles.musicPlayer}>
          <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
            <Text style={styles.playPauseText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextSong} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
          <Text style={styles.songTitle}>{currentPlaylist[currentSongIndex]?.Title}</Text>
          <Text style={styles.songArtist}>{currentPlaylist[currentSongIndex]?.Artist}</Text>
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
    height: 150,
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
    marginBottom: 10,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  songArtist: {
    fontSize: 14,
    color: 'white',
  },
});

export default Music;