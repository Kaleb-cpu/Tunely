import { View, Text, StyleSheet } from "react-native";

export default function FullPlayer() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Now Playing</Text>
      <View style={styles.albumArt}></View>
      <Text style={styles.songDetails}>Song Name</Text>
      <Text style={styles.artist}>Artist Name</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", alignItems: "center", padding: 20 },
  header: { color: "white", fontSize: 20, marginBottom: 20 },
  albumArt: { width: 250, height: 250, backgroundColor: "#444", marginBottom: 20 },
  songDetails: { color: "white", fontSize: 18, marginBottom: 10 },
  artist: { color: "#aaa" },
});
