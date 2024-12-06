import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';

const App = () => {
  return (
    <ImageBackground
      source={require('./assets/images/welcome.jpg')} 
      style={styles.background}
    >
      <View style={styles.contentContainer}>
        {/* Buttons */}
        <TouchableOpacity style={styles.button}>
          <Link href="/screens/CreateAccountScreen">
            <Text style={styles.buttonText}>Create an account</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.loginButton]}>
          <Link href="/screens/LoginScreen">
            <Text style={[styles.buttonText, styles.loginText]}>Log in</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  loginText: {
    color: 'white',
  },
});

export default App;
