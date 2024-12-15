import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function UploadsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Uploads</Text>

      {/* Navigate to AddSongScreen */}
      <TouchableOpacity
        onPress={() => router.push("/library/addSong")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add a Song</Text>
      </TouchableOpacity>

      {/* Navigate to a new screen for adding an album */}
      <TouchableOpacity
        onPress={() => router.push("/library/addAlbum")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add an Album</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20, justifyContent: "center" },
  header: { fontSize: 24, color: "white", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#2F80ED", padding: 15, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
