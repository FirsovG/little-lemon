import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./screens/Onboarding";
import SplashScreen from "./screens/Splash";
import ProfileScreen from "./screens/Profile";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const readLoginState = async () => {
    setIsLoggedIn((await AsyncStorage.getItem("IS_LOGGED_IN")) || false);
    setIsLoading(false);
  };

  useEffect(() => {
    readLoginState();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading && <Stack.Screen name="Loading" component={SplashScreen} />}
        {isLoggedIn && (
          <Stack.Screen name="Profile" component={ProfileScreen} />
        )}
        {!isLoggedIn && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
