import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3005/api/songs/search?query=${searchQuery}`);
      const data = await response.json();

      if (response.ok) {
        setSongs(data.songs);
      } else {
        Alert.alert('Error', data.message || 'No results found');
      }
    } catch (error) {
      console.error('Error searching for songs:', error);
      Alert.alert('Error', 'Failed to fetch songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSongItem = ({ item }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => router.push(`/player?songId=${item.id}`)}  // Navigate to player with songId
    >
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.songArtist}>By: {item.artist}</Text>
      <Text style={styles.songAlbum}>Album: {item.album}</Text>
      <Text style={styles.songGenre}>Genre: {item.genre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a song..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title={loading ? 'Searching...' : 'Search'} onPress={handleSearch} disabled={loading} />
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.songList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    color: '#fff',
  },
  songList: {
    marginTop: 20,
  },
  songItem: {
    backgroundColor: '#2e2e2e',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  songArtist: {
    fontSize: 14,
    color: '#bbb',
  },
  songAlbum: {
    fontSize: 14,
    color: '#bbb',
  },
  songGenre: {
    fontSize: 14,
    color: '#bbb',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
  },
});
