import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

// Function to handle platform-specific file URI formatting
const getPlatformUri = (uri) => {
  if (Platform.OS === "web") {
    return uri.replace("file://", ""); // Ensure proper URI format for web
  }
  if (Platform.OS === "android") {
    return uri;  // For Android, it should work as is
  }
  return uri.replace("file://", ""); // Handle for iOS (removes 'file://' prefix)
};


export default function AddSongScreen() {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Function to pick a song file
  const pickSongFile = async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });

      console.log("Document Picker Response:", response); // Debugging

      // Check if response contains 'assets' array
      if (response.assets && response.assets.length > 0) {
        const file = response.assets[0]; // Access the first file in the assets array
        setSongFile({
          uri: getPlatformUri(file.uri),
          name: file.name || "unknown.mp3",
          type: file.mimeType || "audio/mpeg", // Ensure MIME type is set
        });
        console.log("Song file set successfully:", file);
      } else if (response.type === "success") {
        // Fallback for cases where assets array isn't present
        setSongFile({
          uri: getPlatformUri(response.uri),
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

  // Function to pick a cover file
  const pickCoverFile = async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      if (response.type === "success") {
        setCoverFile({
          uri: getPlatformUri(response.uri),
          name: response.name || "unknown.jpg",
          type: response.mimeType || "image/jpeg",
        });
        Alert.alert("Cover File Selected", response.name);
      } else {
        Alert.alert("Error", "No file was selected.");
      }
    } catch (error) {
      console.error("Error picking cover file:", error);
      Alert.alert("Error", "Failed to pick the cover file.");
    }
  };

  // Function to upload song details
  const uploadSong = async () => {
    if (!artist || !title || !genre || !releaseDate || !songFile) {
      Alert.alert(
        "Error",
        "Please fill in all fields and upload the required files."
      );
      return;
    }

    const formData = new FormData();
    formData.append("artist", artist);
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("releaseDate", releaseDate);
    formData.append("song", {
      uri: getPlatformUri(songFile.uri),
      name: songFile.name,
      type: songFile.type,
    });

    if (coverFile) {
      formData.append("cover", {
        uri: getPlatformUri(coverFile.uri),
        name: coverFile.name,
        type: coverFile.type,
      });
    }

    console.log("FormData before upload:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await fetch("http://10.0.0.177:3005/api/upload-song", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      console.log("Server Response:", responseText);

      if (response.ok) {
        Alert.alert("Success", "Song uploaded successfully!");
        // Optionally, reset form fields
        setArtist("");
        setTitle("");
        setGenre("");
        setReleaseDate("");
        setSongFile(null);
        setCoverFile(null);
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
      <Text style={styles.header}>Add a New Song</Text>

      <TextInput
        placeholder="Artist Name"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        placeholder="Song Title"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Genre"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        placeholder="Release Date (mm/dd/yyyy)"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={releaseDate}
        onChangeText={setReleaseDate}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickCoverFile}>
        <Text style={{ color: "#2F80ED" }}>
          {coverFile ? `Cover: ${coverFile.name}` : "Upload Song Cover"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={pickSongFile}>
        <Text style={{ color: "#2F80ED" }}>
          {songFile ? `File: ${songFile.name}` : "Upload Song File"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={uploadSong}>
        <Text style={styles.submitText}>Submit Song</Text>
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
    marginTop: 10,
    borderRadius: 5,
  },
  uploadButton: { marginTop: 15, alignItems: "center" },
  submitButton: {
    backgroundColor: "#2F80ED",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
