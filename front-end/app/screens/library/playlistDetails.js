import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

export default function PlaylistDetails({ route }) {
  const { playlist } = route.params;

  return (
    <View style={styles.container}>
      {/* Playlist Header */}
      <View style={styles.header}>
        {playlist.image && (
          <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
        )}
        <Text style={styles.title}>{playlist.title}</Text>
        {playlist.description && (
          <Text style={styles.description}>{playlist.description}</Text>
        )}
      </View>

      {/* Songs List */}
      <FlatList
        data={playlist.songs} // Playlist songs array
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Text style={styles.songTitle}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No songs in this playlist yet.</Text>
        }
      />

      {/* Add Song Button (Optional) */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => alert("Add Song functionality not implemented")}
      >
        <Text style={styles.addButtonText}>+ Add Song</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  playlistImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 4,
  },
  songItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    marginVertical: 6,
  },
  songTitle: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    width: "60%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
