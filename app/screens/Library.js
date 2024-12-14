import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Library({ navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [playlistImage, setPlaylistImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      setPlaylists([
        ...playlists,
        {
          id: Date.now().toString(),
          name: newPlaylistName,
          description: newPlaylistDescription,
          image: playlistImage,
          songs: [],
        },
      ]);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setPlaylistImage(null);
      setModalVisible(false);  
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPlaylistImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Library</Text>

      <TouchableOpacity
        style={styles.createPlaylistButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Playlist Name"
              placeholderTextColor="#aaa"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Playlist Description"
              placeholderTextColor="#aaa"
              value={newPlaylistDescription}
              onChangeText={setNewPlaylistDescription}
            />
            <Button title="Pick Image" onPress={pickImage} />
            {playlistImage && <Image source={{ uri: playlistImage }} style={styles.imagePreview} />}
            <TouchableOpacity style={styles.createButton} onPress={createPlaylist}>
              <Text style={styles.createButtonText}>Create Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlist}
            onPress={() => navigation.navigate('PlaylistDetails', { playlist: item })}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.playlistImage} />}
            <Text style={styles.playlistText}>{item.name}</Text>
            {item.description && <Text style={styles.playlistDescription}>{item.description}</Text>}
          </TouchableOpacity>
        )}
        numColumns={2} 
        ListEmptyComponent={<Text style={styles.emptyText}>No Playlists Created Yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  createPlaylistButton: {
    backgroundColor: '#4CAF50',
    width: 100,
    height: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 12,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  playlist: {
    backgroundColor: '#333',
    width: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  playlistDescription: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});
