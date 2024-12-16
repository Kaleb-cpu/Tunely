import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const createFileFromBase64 = async (base64Data, fileName) => {
  // Handle native (iOS/Android)
  if (Platform.OS !== 'web') {
    const path = FileSystem.documentDirectory + fileName;
    try {
      await FileSystem.writeAsStringAsync(path, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return path;
    } catch (error) {
      throw new Error('Error creating file from base64 data: ' + error.message);
    }
  }

  // Handle web
  else {
    // For the web, create a Blob and download it
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return url; // Returning the Blob URL on the web
  }
};
