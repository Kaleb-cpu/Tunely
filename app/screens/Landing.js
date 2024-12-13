import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
} from "react-native";

const Landing = () => {
  const navigation = useNavigation(); // Access the navigation object


  const handleCreateAccount = () => {
    navigation.navigate("CreateAccount"); // Navigate to the Create Account screen
  
  };
  const handleLogin = () => {
    navigation.navigate("Login"); // Navigate to the Login screen
  };
  return (
    <ImageBackground
      source={require("../assets/images/welcome.jpg")}
      style={styles.background}
    >
      <View style={styles.contentContainer}>
        {/* Create Account Button */}
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create an account</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity
          style={[styles.button, styles.landingButton]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, styles.landingText]}>Log in</Text>
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
  landingButton: {
    backgroundColor: "black",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  landingText: {
    color: "white",
  },
});

export default Landing;
