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
import { createFileFromBase64 } from "../../utils/fileUtils"; 


// Function to handle platform-specific file URI formatting
const getPlatformUri = (uri) => {
  if (Platform.OS === "web") {
    return uri.replace("file://", ""); // Ensure proper URI format for web
  }
  if (Platform.OS === "android") {
    return uri; // For Android, it should work as is
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

  const formatReleaseDate = (releaseDate) => {
    if (!releaseDate) return ""; // Ensure releaseDate is not empty

    const dateParts = releaseDate.split("/");
    if (dateParts.length === 3) {
      const [month, day, year] = dateParts;

      // Validate that day, month, and year are valid numbers
      if (
        !isNaN(month) &&
        !isNaN(day) &&
        !isNaN(year) &&
        month > 0 &&
        month <= 12 &&
        day > 0 &&
        day <= 31
      ) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    // If invalid, return an empty string or handle as per requirements
    Alert.alert("Error", "Invalid release date format. Use MM/DD/YYYY.");
    return "";
  };

  const uploadSong = async () => {
    if (!artist || !title || !genre || !releaseDate || !songFile) {
      Alert.alert(
        "Error",
        "Please fill in all fields and upload the required files."
      );
      return;
    }
  
    const formattedReleaseDate = formatReleaseDate(releaseDate);
    const formData = new FormData();
    formData.append("artist", artist);
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("releaseDate", formattedReleaseDate);
  
    // Check if songFile is an object and has valid properties
    if (songFile && songFile.uri && songFile.name && songFile.type) {
      // If songFile URI contains base64 string
      if (songFile.uri.startsWith("data:")) {
        const response = await fetch(songFile.uri);  // Fetch the base64 data as a Blob
        const blob = await response.blob();  // Convert the base64 string into a Blob
  
        // Now create a new file-like object for the Blob
        const file = new File([blob], songFile.name, {
          type: songFile.type,
        });
  
        // Add the Blob (converted file) to FormData
        formData.append("song", file);
      } else {
        // Handle non-base64 files as is
        formData.append("song", {
          uri: songFile.uri,
          name: songFile.name,
          type: songFile.type,
        });
      }
  
      console.log("Song File Object:", songFile); // Debugging
    } else {
      console.error("Invalid song file:", songFile);
      Alert.alert("Error", "Invalid song file. Please select a valid file.");
      return;
    }
  
    // Optionally, handle cover image if it exists
    if (coverFile) {
      formData.append("cover", {
        uri: coverFile.uri,
        name: coverFile.name,
        type: coverFile.type,
      });
    }
  
    // Log form data for debugging
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
        placeholder="Release Date (YYYY-MM-DD)"
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
