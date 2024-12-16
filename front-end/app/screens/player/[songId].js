import { useRouter } from 'expo-router';  // Use useRouter to access the router object
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

export default function Player() {
  const router = useRouter();  // Use useRouter to access the router object
  const { songId } = router.params;  // Access dynamic parameter directly from router.params

  const [song, setSong] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!songId) return;  // Only proceed if songId is available

    const fetchSong = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://10.0.0.177:3005/api/songs/${songId}`);
        const data = await response.json();

        if (response.ok) {
          setSong(data);
        } else {
          console.error('Failed to fetch song:', data.message);
        }
      } catch (error) {
        console.error('Error fetching song:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSong();
  }, [songId]);  // Depend on songId so it updates when songId changes

  const handlePlayPause = async () => {
    if (sound) {
      try {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  useEffect(() => {
    if (song && song.song_url) {
      const loadSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: song.song_url },
            { shouldPlay: false }
          );
          setSound(sound);
        } catch (error) {
          console.error('Error loading sound:', error);
        }
      };

      loadSound();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [song]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0095ff" />
      </View>
    );
  }

  if (!song) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Song not found!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{song.title}</Text>
      <Text>{song.artist}</Text>
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
    </View>
  );
}
