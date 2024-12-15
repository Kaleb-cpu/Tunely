import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function UploadsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Uploads</Text>

      <TouchableOpacity onPress={() => router.push("/library/addSong")} style={styles.button}>
        <Text style={styles.buttonText}>Add a New Song</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert("Add a new album coming soon!")} style={styles.button}>
        <Text style={styles.buttonText}>Add a New Album</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  header: { fontSize: 24, color: "white", marginBottom: 20 },
  button: { backgroundColor: "#2F80ED", padding: 15, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
