import { Stack, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Arrow from 'react-native-arrow';

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.push("/library/likedTracks")} style={styles.item}>
        <Text style={styles.text}>Liked tracks</Text>
        {/* <Arrow size={9} color={'white'} /> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/library/playlists")} style={styles.item}>
        <Text style={styles.text}>Playlists</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/library/following")} style={styles.item}>
        <Text style={styles.text}>Following</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/library/uploads")} style={styles.item}>
        <Text style={styles.text}>Your uploads</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#232327", padding: 20 },
  header: { fontSize: 24, color: "white", marginBottom: 20 },
  item: { padding: 15, marginBottom: 10, borderRadius: 8, },
  text: { color: "white", fontSize: 20}
});
