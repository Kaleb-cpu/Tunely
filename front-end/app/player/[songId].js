import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function Player() {
  const { songId } = useLocalSearchParams();

  const [song, setSong] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state to show loading indicator
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);

  useEffect(() => {
    if (!songId) {
      console.error("No songId found in params");
      return;
    }

    const fetchSong = async () => {
      setIsLoading(true); // Set loading true while fetching the song
      try {
        const response = await fetch(
          `http://10.0.0.177:3005/api/songs/play/${songId}`
        );
        const data = await response.json();
        if (response.ok) {
          setSong(data); // Set song data on success
        } else {
          console.error("Failed to fetch song:", data.message);
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setIsLoading(false); // Set loading false after fetching
      }
    };

    fetchSong();
  }, [songId]);

  useEffect(() => {
    if (song && song.songUrl) { // Make sure song is loaded
      const loadSound = async () => {
        try {
          const { sound, status } = await Audio.Sound.createAsync(
            { uri: song.songUrl }, // Use the song's URL
            { shouldPlay: false }
          );

          if (status.isLoaded) {
            setSound(sound); // Set sound
            setIsSoundLoaded(true);
            setIsLoading(false); // Set loading false once sound is ready
          } else {
            console.error("Sound not loaded:", status.error);
          }
        } catch (error) {
          console.error("Error loading sound:", error.message);
          setIsLoading(false); // Stop loading in case of error
        }
      };

      loadSound();
    }

    return () => {
      if (sound) {
        sound.unloadAsync().catch((error) => console.error("Error unloading sound:", error));
      }
    };
  }, [song]); // Runs every time the song changes

  const handlePlayPause = async () => {
    if (!sound) {
      console.error("Sound is not loaded yet.");
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        console.error("Sound is not loaded properly.");
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0095ff" />
      </View>
    );
  }

  if (!song) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Song not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nowPlayingText}>NOW PLAYING</Text>
      <View style={styles.albumArtContainer}>
        <View style={styles.albumArt} />
      </View>
      <Text style={styles.songTitle}>{song.title}</Text>
      <Text style={styles.artistName}>{song.artist}</Text>

      <View style={styles.controlsContainer}>
        <TouchableOpacity>
          <Ionicons name="shuffle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={40}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="repeat" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNavContainer}>
        <Ionicons name="home-outline" size={24} color="white" />
        <Ionicons name="search-outline" size={24} color="white" />
        <Ionicons name="library-outline" size={24} color="white" />
        <Ionicons name="person-outline" size={24} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  nowPlayingText: {
    color: "white",
    fontSize: 14,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  albumArtContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#333",
    borderRadius: 100,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  albumArt: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0095ff",
    borderRadius: 100,
  },
  songTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  artistName: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  playButton: {
    backgroundColor: "#1DB954",
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
