import { View, Text, StyleSheet } from "react-native";

export default function LikedTracksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liked Tracks</Text>
      <Text style={styles.subHeader}>This page is under construction.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" },
  header: { fontSize: 24, color: "white", fontWeight: "bold", marginBottom: 10 },
  subHeader: { fontSize: 16, color: "white", opacity: 0.8 },
});
