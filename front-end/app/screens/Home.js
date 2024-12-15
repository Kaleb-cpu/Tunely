import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const Home = () => {
  const data = [
    { title: 'Types of genre', subtitle: 'Trending Music', color: '#FFD700' },
    { title: 'Types of genre', subtitle: 'Trending Music', color: '#6B8E23' },
    { title: 'Types of genre', subtitle: 'Trending Music', color: '#00FFFF' },
    { title: 'Types of Party', subtitle: 'Playlist', color: '#008080' },
    { title: 'Types of Party', subtitle: 'Playlist', color: '#00FF00' },
    { title: 'Types of Party', subtitle: 'Playlist', color: '#FF1493' },
    { title: 'Types of Workout', subtitle: 'Playlist', color: '#B22222' },
    { title: 'Types of Workout', subtitle: 'Playlist', color: '#696969' },
    { title: 'Types of Workout', subtitle: 'Playlist', color: '#006400' },
  ];

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: item.color }]}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.contentContainer}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232327',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  item: {
    width: Dimensions.get('window').width / 3 - 20,
    height: 100,
    margin: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  itemSubtitle: {
    fontSize: 10,
    color: 'white',
  },
});

export default Home;
