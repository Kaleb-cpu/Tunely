import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Switch, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const [name, setName] = useState('John Doe');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionGranted(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need your permission to access your photo library to upload a profile picture.'
        );
      }
    };
    requestPermissions();
  }, []);

  const handleProfilePictureChange = async () => {
    if (!permissionGranted) {
      Alert.alert('Permission Denied', 'Please allow access to your photo library in settings.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log('Selected Image URI:', result.uri); // Log the URI to confirm it's valid
      setProfileImage(result.uri);
    } else {
      console.log('Image selection canceled.');
    }
  };

  const handleSaveChanges = () => {
    Alert.alert('Changes Saved', 'Your profile information has been updated.');
  };

  return (
    <View style={[styles.container, darkMode && styles.darkMode]}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleProfilePictureChange}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/images/placeholder.jpg')}
            style={styles.profilePicture}
            onError={(error) => console.log('Image load error:', error)}
          />
        </TouchableOpacity>
        <Text style={[styles.text, styles.profileName]}>{name}</Text>
        <TextInput
          style={styles.input}
          placeholder="Change Name"
          onChangeText={setName}
          value={name}
        />
        <TouchableOpacity style={styles.editButton} onPress={handleProfilePictureChange}>
          <Text style={styles.editButtonText}>Edit Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={[styles.text, styles.sectionTitle]}>Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={() => setDarkMode((prev) => !prev)} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch value={notifications} onValueChange={() => setNotifications((prev) => !prev)} />
        </View>

        <Button title="Save Changes" onPress={handleSaveChanges} color="#1DB954" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  darkMode: {
    backgroundColor: '#1e1e1e',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0', 
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileName: {
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingsSection: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
});
