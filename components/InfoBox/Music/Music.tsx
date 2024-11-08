import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getAllPlaylists } from '@/services/playlist';
import { playSong } from '@/services/song';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface MusicProps {
  onTabPress: (title: string, content: React.ReactNode) => void;
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

const Music: React.FC<MusicProps> = ({ onTabPress }) => {
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSongUrl, setCurrentSongUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([]);
  
  const audioRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await getAllPlaylists();
        if (response.err === 0) {
          setPlaylistData(response.playlist);
        } else {
          setError('Error fetching playlists: ' + response.mes);
        }
      } catch (error) {
        setError('Error fetching playlists.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePlaylistClick = async (playlistId: string) => {
    try {
      const songs: Song[] = await playSong(playlistId);
  
      console.log('Response from playSong API:', songs);
  
      if (songs.length > 0) {
        setCurrentPlaylist(songs);
        setCurrentSongIndex(0);
        setCurrentSongUrl(songs[0].Url);
        setCurrentTime(0);
        setIsPlaying(false);
  
        console.log('Loading first song URL:', songs[0].Url);
  
        if (sound) {
          await sound.unloadAsync();
        }
  
        // Create the Audio.Sound instance
        const newSound = new Audio.Sound();
  
        try {
          // Load the sound asynchronously
          await newSound.loadAsync({ uri: songs[0].Url }); 
          console.log('Sound loaded successfully:', songs[0].Url);
          // Set the sound AFTER it's loaded
          setSound(newSound); 
  
          // Play the sound
          if (sound) { 
            audioRef.current = sound;
            await sound.playAsync(); // Play after loading
            setIsPlaying(true); 
          } else {
            console.error('Sound object is null.');
          }
        } catch (error) {
          console.error('Error loading sound:', error);
        }
      } else {
        console.error('No songs available in this playlist.');
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };
  

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        console.log('Audio paused.');
      } else {
        await sound.playAsync();
        console.log('Audio playing.');
      }
      setIsPlaying(!isPlaying);
    } else {
      console.warn('Sound object is null, cannot play/pause.');
    }
  };

  const handleSongEnd = async (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    if (status.didJustFinish && currentSongIndex < currentPlaylist.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      setCurrentSongUrl(currentPlaylist[nextIndex].Url);
      setCurrentTime(0);

      console.log('Song ended, loading next song:', currentPlaylist[nextIndex].Url);

      if (sound) {
        await sound.unloadAsync();
        try {
          await sound.loadAsync({ uri: currentPlaylist[nextIndex].Url });
          await sound.playAsync();
          console.log('Next song loaded and playing:', currentPlaylist[nextIndex].Url);
        } catch (error) {
          console.error('Error loading next sound:', error);
        }
      }
    } else {
      setIsPlaying(false);
      console.log('No more songs in the playlist.');
    }
  };

  const handleTimeUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !status.isBuffering) {
      setCurrentTime(status.positionMillis / 1000);
    }
  };

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        handleTimeUpdate(status);
        handleSongEnd(status);
      });
    }
  }, [sound, currentSongUrl]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.playlistsList}>
          {playlistData.length > 0 ? (
            playlistData.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                style={styles.playlistItem}
                onPress={() => handlePlaylistClick(playlist.id)}
              >
                <Image
                  source={{ uri: playlist.filePathPlaylist }}
                  style={styles.playlistImage}
                />
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistName}>{playlist.Title}</Text>
                  <Text style={styles.playlistDescription}>{playlist.Description}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.loadingText}>No playlists available.</Text>
          )}
        </View>
      )}

      {currentSongUrl && (
        <View style={styles.musicPlayer}>
          <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
            <Text style={styles.playPauseText}>{isPlaying ? 'Pause' : 'Play'}</Text>
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
    height: 10,
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
    fontFamily: 'Poppins-Bold'
  },
  playlistDescription: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular'
  },
  loadingText: {
    textAlign: 'center',
    color: 'white',
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
