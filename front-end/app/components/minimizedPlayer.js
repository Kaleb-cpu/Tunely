import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MinimizedPlayer() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/player")} style={styles.container}>
      <Text style={styles.songName}>Now Playing: Song Name</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#333", padding: 15 },
  songName: { color: "white", textAlign: "center" },
});
