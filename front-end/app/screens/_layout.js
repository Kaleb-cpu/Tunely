import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="player/[url]" options={{ title: 'Player' }} />
      <Stack.Screen name="*" options={{ title: 'Not Found' }} />
    </Stack>
  );
}

function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Page Not Found</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold' },
});