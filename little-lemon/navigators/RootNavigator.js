import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingScreen from "../screens/Onboarding";
import SplashScreen from "../screens/Splash";
import ProfileScreen from "../screens/Profile";

const Stack = createNativeStackNavigator();
const AuthContext = React.createContext();

const RootNavigator = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "LOGGED_IN":
          return {
            isLoggedIn: true,
            isLoading: false,
          };
        case "LOGGED_OUT":
          return {
            isLoggedIn: false,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isLoggedIn: false,
    }
  );

  const authContextProvider = React.useMemo(
    () => ({
      logIn: () => {
        dispatch({ type: "LOGGED_IN" });
      },
      logOut: () => {
        dispatch({ type: "LOGGED_OUT" });
      },
    }),
    []
  );

  ToBoolean = (string) => {
    if (string === null) {
      return false;
    } else {
      return string === "true";
    }
  };

  const readLoginState = async () => {
    if (ToBoolean(await AsyncStorage.getItem("IS_LOGGED_IN"))) {
      dispatch({ type: "LOGGED_IN" });
    } else {
      dispatch({ type: "LOGGED_OUT" });
    }
  };

  useEffect(() => {
    readLoginState();
  }, []);

  return (
    <AuthContext.Provider value={authContextProvider}>
      <Stack.Navigator initialRouteName="Loading">
        {state.isLoading && (
          <Stack.Screen name="Loading" component={SplashScreen} />
        )}
        {state.isLoggedIn && (
          <Stack.Screen name="Profile" component={ProfileScreen} />
        )}
        {!state.isLoggedIn && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export { RootNavigator, AuthContext };
