import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getAllPreset} from '@/services/presets';
import { updateBackgroundMusic } from '@/features/player/playerSlice';
import { useDispatch } from 'react-redux';

interface PresetProps {
  onTabPress: (content: React.ReactNode) => void;
}

interface Preset {
  image: string;
  id: string;
  name: string;
  description: string;
  visualVideoUrl: string | null;
  visualImgUrl: string | null;
  playlistId: string;
  sounds: { soundUrl: string; soundVol: number; soundTitle: string }[];
  vip: boolean;
}

const Preset: React.FC<PresetProps> = ({ onTabPress }) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handlePresetSelect = (preset: Preset) => {
    if (preset.visualVideoUrl && preset.sounds && preset.sounds.length > 0) {
      dispatch(updateBackgroundMusic({
        musicUrl: preset.sounds[0].soundUrl,
        backgroundUrl: preset.visualVideoUrl,
      }));
    } else {
      console.error("Preset data is incomplete:", preset); 
    }
  };

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const fetchedPresets = await getAllPreset();
        setPresets(fetchedPresets);
        console.log(fetchedPresets[0])
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  if (loading) {
    return ;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>Error: {error}</Text>;
  }

    return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.presetBox}
            onPress={() => handlePresetSelect(preset)} 
          >
            {preset.visualImgUrl && (
              <Image source={{ uri: preset.visualImgUrl }} style={styles.presetImage} />
            )}
            <View style={styles.titleContainer}> 
              <Text style={styles.presetName}>{preset.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  grid: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
  },
  presetBox: {
    width: '48%', 
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  presetImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    borderRadius: 10,
    alignItems: 'center',
  },
  presetName: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding:6,
    borderRadius: 10,
  },
});

export default Preset;