import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
} from "react-native";

const LoginScreen = ({ onLogin }) => {
  return (
    <ImageBackground
      source={require("../assets/images/welcome.jpg")}
      style={styles.background}
    >
      <View style={styles.contentContainer}>
        {/* Create Account Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create an account</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={onLogin} // Update authentication state
        >
          <Text style={[styles.buttonText, styles.loginText]}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "black",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  loginText: {
    color: "white",
  },
});

export default LoginScreen;
