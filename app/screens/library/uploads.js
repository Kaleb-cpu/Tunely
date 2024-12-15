import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function UploadsScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [songFile, setSongFile] = useState(null);

  const pickSong = async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
  
      console.log("Document Picker Response:", response); // Debugging
  
      // Check if response contains 'assets' array
      if (response.assets && response.assets.length > 0) {
        const file = response.assets[0]; // Access the first file in the assets array
        setSongFile({
          uri: file.uri,
          name: file.name || "unknown.mp3",
          type: file.mimeType || "audio/mpeg", // Ensure MIME type is set
        });
        console.log("Song file set successfully:", file);
      } else if (response.type === "success") {
        // Fallback for cases where assets array isn't present
        setSongFile({
          uri: response.uri,
          name: response.name || "unknown.mp3",
          type: "audio/mpeg",
        });
      } else {
        Alert.alert("Error", "No file was selected.");
      }
    } catch (error) {
      console.error("Error picking song file:", error);
      Alert.alert("Error", "Failed to pick the song file.");
    }
  };
  
  const uploadSong = async () => {
    if (!title || !songFile) {
      Alert.alert("Error", "Title and song file are required.");
      console.log("Title:", title);  // Debugging
      console.log("Song File:", songFile);  // Debugging
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("genre", genre);
    formData.append("song", {
      uri: songFile.uri,
      name: songFile.name,
      type: songFile.type,
    });
  
    try {
      const response = await fetch("http://10.0.0.177:3005/api/upload-song", {
        method: "POST",
        body: formData,
      });
  
      const responseText = await response.text(); // Get raw response body
      console.log("Server Response Text:", responseText); // Debugging
  
      // Try to parse the response only if it seems like JSON
      if (response.ok) {
        const result = JSON.parse(responseText); // Only parse if response is JSON
        Alert.alert("Success", "Song uploaded successfully!");
        router.push("/library");
      } else {
        Alert.alert("Error", responseText || "Failed to upload song.");
      }
    } catch (error) {
      console.error("Error uploading song:", error);
      Alert.alert("Error", "Failed to upload the song. Please try again.");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Uploads</Text>

      <TextInput
        style={styles.input}
        placeholder="Song Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        style={styles.input}
        placeholder="Album"
        value={album}
        onChangeText={setAlbum}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />

      <TouchableOpacity onPress={pickSong} style={styles.button}>
        <Text style={styles.buttonText}>
          {songFile ? `Selected: ${songFile.name}` : "Select a Song File"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={uploadSong} style={styles.button}>
        <Text style={styles.buttonText}>Upload Song</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/library/addAlbum")} style={styles.button}>
        <Text style={styles.buttonText}>Add a New Album</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  header: { fontSize: 24, color: "white", marginBottom: 20 },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: { backgroundColor: "#2F80ED", padding: 15, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
