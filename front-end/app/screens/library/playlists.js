import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native'; 

export default function Playlists() {
  const navigation = useNavigation(); 
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Function to create a new playlist
  const createPlaylist = () => {
    if (!newPlaylist.title.trim()) {
      Alert.alert("Error", "Playlist title cannot be empty.");
      return;
    }

    setPlaylists([
      ...playlists,
      {
        id: Date.now().toString(),
        title: newPlaylist.title,
        description: newPlaylist.description,
        image: newPlaylist.image,
        userId: "12345", 
        songs: [],
        likes: 0,
        comments: [],
      },
    ]);
    setNewPlaylist({ title: "", description: "", image: null });
    setModalVisible(false);
  };

  // Function to pick an image for the playlist
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPlaylist({ ...newPlaylist, image: result.assets[0].uri });
    }
  };

  // Function to handle playlist selection and navigate to details
  const handlePlayPlaylist = (playlist) => {
    navigation.navigate("PlaylistDetails", { playlist });
  };

  // Function to handle adding a comment to a playlist
  const handleAddComment = () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Comment cannot be empty.");
      return;
    }

    // Add the new comment to the selected playlist's comments array
    const updatedPlaylists = playlists.map((playlist) =>
      playlist.id === selectedPlaylist.id
        ? {
            ...playlist,
            comments: [...playlist.comments, newComment],
          }
        : playlist
    );
    setPlaylists(updatedPlaylists);
    setNewComment("");
    setCommentModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playlists</Text>

      <TouchableOpacity
        style={styles.createPlaylistButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal to create a new playlist */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Playlist Title"
              placeholderTextColor="#aaa"
              value={newPlaylist.title}
              onChangeText={(text) =>
                setNewPlaylist({ ...newPlaylist, title: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Playlist Description"
              placeholderTextColor="#aaa"
              value={newPlaylist.description}
              onChangeText={(text) =>
                setNewPlaylist({ ...newPlaylist, description: text })
              }
            />
            <Button title="Pick Image" onPress={pickImage} />
            {newPlaylist.image && (
              <Image
                source={{ uri: newPlaylist.image }}
                style={styles.imagePreview}
              />
            )}
            <TouchableOpacity style={styles.createButton} onPress={createPlaylist}>
              <Text style={styles.createButtonText}>Create Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for adding comments */}
      <Modal
        transparent={true}
        visible={commentModalVisible}
        animationType="slide"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add a Comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Comment"
              placeholderTextColor="#aaa"
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleAddComment}
            >
              <Text style={styles.createButtonText}>Add Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCommentModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* List of playlists */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlist}
            onPress={() => handlePlayPlaylist(item)}
          >
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.playlistImage} />
            )}
            <Text style={styles.playlistText}>{item.title}</Text>
            {item.description && (
              <Text style={styles.playlistDescription}>{item.description}</Text>
            )}
            <TouchableOpacity
              style={styles.commentButton}
              onPress={() => {
                setSelectedPlaylist(item);
                setCommentModalVisible(true);
              }}
            >
              <Text style={styles.commentButtonText}>Add Comment</Text>
            </TouchableOpacity>

            {/* Display playlist comments */}
            {item.comments.length > 0 && (
              <View style={styles.commentsContainer}>
                {item.comments.map((comment, index) => (
                  <Text key={index} style={styles.commentText}>
                    {comment}
                  </Text>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Playlists Created Yet</Text>
        }
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  createPlaylistButton: {
    backgroundColor: "#4CAF50",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#444",
    color: "#fff",
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 12,
    alignSelf: "center",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  playlist: {
    backgroundColor: "#333",
    margin: 8,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    width: "45%",
  },
  playlistImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  playlistDescription: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
  commentButton: {
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  commentsContainer: {
    marginTop: 10,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  commentText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
