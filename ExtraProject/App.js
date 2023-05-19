import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useReducer, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppContext, { reducer, Actions } from "./AppContext";
import LoginScreen from "./components/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "CS571-202305-ExtraProject-UserInfo";

export default function App() {
  const [state, dispatch] = useReducer(reducer, { user: null, order: [] });

  // Load user info
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem(USER_KEY);
      if (data) {
        dispatch({ type: Actions.LOGIN, payload: JSON.parse(data) });
      }
    })();
  }, []);

  // Save or remove user info to async storage
  useEffect(() => {
    (async () => {
      const info = state.user;
      if (info === null) {
        await AsyncStorage.removeItem(USER_KEY);
      } else {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(info));
      }
    })();
  }, [state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <NavigationContainer>
        {state.user === null && <LoginScreen />}
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
