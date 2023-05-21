import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useReducer, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppContext, { reducer, Actions, Keys } from "./AppContext";
import LoginScreen from "./components/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductScreen from "./components/ProductScreen";
import FullScreenLoader from "./components/FullScreenLoader";
import CustomerScreen from "./components/CustomerScreen";

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    user: null,
    cart: [],
    order: [],
    products: [],
    api: null,
  });

  const loadCart = async (user) => {
    const cartData = await AsyncStorage.getItem(Keys.CART_KEY + "#" + user.id);
    if (cartData) {
      dispatch({ type: Actions.CART, payload: JSON.parse(cartData) });
    }
  };

  // Load user info
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem(Keys.USER_KEY);
      if (data) {
        const user = JSON.parse(data);
        if (user && !!user.id && !!user.token) {
          dispatch({ type: Actions.LOGIN, payload: user });
          // cart
          loadCart(user);
        } else {
          await AsyncStorage.removeItem(Keys.USER_KEY);
          dispatch({ type: Actions.LOGOUT });
        }
      } else {
        dispatch({ type: Actions.HIDE_LOADING });
      }
    })();
  }, []);

  // Save or remove user info to async storage
  useEffect(() => {
    (async () => {
      if (state.user === null) {
        await AsyncStorage.removeItem(Keys.USER_KEY);
      } else {
        const user = state.user;
        await AsyncStorage.setItem(Keys.USER_KEY, JSON.stringify(user));
        // cart
        loadCart(user);
      }
    })();
  }, [state.user]);

  // Api changed
  useEffect(() => {
    const api = state.api;
    if (api) {
      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 403) {
            dispatch({ type: Actions.LOGOUT });
            return;
          }
          return Promise.reject(error);
        }
      );
    }
  }, [state.api]);

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
