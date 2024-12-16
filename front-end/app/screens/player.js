import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from "react-native";

export default function FullPlayer({ route }) {
  const { songId } = route.params; // Get the song ID from route params
  const [songDetails, setSongDetails] = useState(null);

  useEffect(() => {
    // Fetch song details using songId
    const fetchSongDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/songs/play/${songId}`);
        const data = await response.json();
        setSongDetails(data); // Assuming the response contains the song details
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    if (songId) {
      fetchSongDetails();
    }
  }, [songId]);

  const handlePlay = () => {
    // Simulate the play action
    console.log(`Playing song with ID: ${songId}`);
    // Here, you could use a library like react-native-sound to play the song.
  };

  return (
    <View style={styles.container}>
      {songDetails ? (
        <>
          <Text style={styles.header}>Now Playing</Text>
          <Text style={styles.songDetails}>{songDetails.title}</Text>
          <Text style={styles.artist}>{songDetails.artist}</Text>
          <Text style={styles.album}>{songDetails.album}</Text>
          <Button title="Play" onPress={handlePlay} />
        </>
      ) : (
        <Text style={styles.songDetails}>Loading song details...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", alignItems: "center", padding: 20 },
  header: { color: "white", fontSize: 20, marginBottom: 20 },
  songDetails: { color: "white", fontSize: 18, marginBottom: 10 },
  artist: { color: "#aaa" },
  album: { color: "#888" },
});
