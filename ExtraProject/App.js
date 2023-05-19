import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useReducer, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppContext, { reducer, Actions } from "./AppContext";
import LoginStack from "./components/LoginStack";

export default function App() {
  const [state, dispatch] = useReducer(reducer, { user: null, order: [] });
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <NavigationContainer>
        {state.user === null && <LoginStack />}
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
