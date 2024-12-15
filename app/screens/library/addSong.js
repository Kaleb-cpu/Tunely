import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function AddSongScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a New Song</Text>

      <TextInput placeholder="Artist Name" style={styles.input} placeholderTextColor="#aaa" />
      <TextInput placeholder="Song Title" style={styles.input} placeholderTextColor="#aaa" />

      <Text style={styles.label}>Genre</Text>
      <TextInput placeholder="Pop" style={styles.input} placeholderTextColor="#aaa" />

      <TextInput placeholder="Release Date (mm/dd/yyyy)" style={styles.input} placeholderTextColor="#aaa" />

      <TouchableOpacity style={styles.uploadButton}>
        <Text style={{ color: "#2F80ED" }}>Upload Song Cover</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton}>
        <Text style={{ color: "#2F80ED" }}>Upload Song File</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Song</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  header: { fontSize: 24, color: "white", marginBottom: 20 },
  label: { color: "white", marginTop: 10 },
  input: { backgroundColor: "#333", color: "white", padding: 10, marginTop: 10, borderRadius: 5 },
  uploadButton: { marginTop: 15, alignItems: "center" },
  submitButton: { backgroundColor: "#2F80ED", padding: 15, borderRadius: 8, marginTop: 20 },
  submitText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
