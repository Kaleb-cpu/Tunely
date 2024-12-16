import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for navigation

export default function MyUploadsScreen() {
  const [uploads, setUploads] = useState([]);
  const router = useRouter();
  useEffect(() => {
    console.log("Fetching uploads...");
    fetch("http://10.0.0.177:3005/api/myuploads")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUploads(data);
      })
      .catch((error) => console.error("Error fetching uploads:", error));
  }, []);

  // Render each upload item
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.artist}</Text>
      <Text style={styles.cell}>{item.title}</Text>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => {
          const sanitizedUrl = item.song_url.replace(/\\/g, "/");
          router.push(`/player?url=${encodeURIComponent(sanitizedUrl)}`);
        }}
      >
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Uploads</Text>

      {/* Table header */}
      <View style={styles.row}>
        <Text style={styles.headerCell}>Artist</Text>
        <Text style={styles.headerCell}>Song Title</Text>
        <Text style={styles.headerCell}>Play</Text>
      </View>

      {/* List of uploads */}
      <FlatList
        data={uploads}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2F80ED",
    paddingBottom: 10,
  },
  headerCell: {
    flex: 1,
    color: "#2F80ED",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  playButton: {
    backgroundColor: "#2F80ED",
    paddingVertical: 8,
    paddingHorizontal: 1,
    borderRadius: 8,
    alignSelf: "center",
    flex: 1,
  },
  playButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
