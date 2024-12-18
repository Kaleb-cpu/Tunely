import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import Home from "./screens/Home";
import Search from "./screens/Search";
import Library from "./screens/Library";
import Profile from "./screens/Profile";
import Landing from "./screens/Landing";
import CreateAccount from "./screens/CreateAccount"; 
import LogIn from "./screens/LogIn"; 


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Main App Navigator (Tabs)
const MainApp = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Search") {
          iconName = focused ? "search" : "search-outline";
        } else if (route.name === "Library") {
          iconName = focused ? "library" : "library-outline";
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#0095ff",
      tabBarInactiveTintColor: "black",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Search" component={Search} />
    <Tab.Screen name="Library" component={Library} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);

// App Component with Conditional Navigation
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Set authentication state to true
  };
  return (
    <>
      {isAuthenticated ? (
        // Show main app if authenticated
        <MainApp /> 
      ) : (
        // Show login/welcome screen if not authenticated
        <Stack.Navigator>
          <Stack.Screen
            name="Signin"
            options={{ headerShown: false }}
          >
            {() => <Landing onLanding={() => setIsAuthenticated(false)} />}
          </Stack.Screen>
          <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: true }} />
          <Stack.Screen name="Login">
            {(props) => <LogIn {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>

        </Stack.Navigator>
      )}
    </>
  );
};

export default App;
