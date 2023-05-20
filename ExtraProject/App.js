import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useReducer, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppContext, { reducer, Actions } from "./AppContext";
import LoginScreen from "./components/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductScreen from "./components/ProductScreen";
import FullScreenLoader from "./components/FullScreenLoader";
import CustomerScreen from "./components/CustomerScreen";

const USER_KEY = "CS571-202305-ExtraProject-UserInfo";

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    user: null,
    cart: [],
    order: [],
    products: [],
  });

  // Load user info
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem(USER_KEY);
      if (data) {
        dispatch({ type: Actions.LOGIN, payload: JSON.parse(data) });
      } else {
        dispatch({ type: Actions.HIDE_LOADING });
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
      {state.isLoading && <FullScreenLoader />}
      <NavigationContainer>
        {state.user === null && <LoginScreen />}
        {state.user && <CustomerScreen />}
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
