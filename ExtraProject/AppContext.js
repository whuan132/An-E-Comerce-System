import React, { createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Env from "./Env";

const AppContext = createContext();
const CART_KEY = "CS571-202305-ExtraProject-Cart";

// Actions
const Actions = {
  LOGIN: "login",
  LOGOUT: "logout",

  PRODUCTS: "products",

  SHOW_LOADING: "show_loading",
  HIDE_LOADING: "hide_loading",

  CART: "cart",
};

const Keys = {
  USER_KEY: "CS571-202305-ExtraProject-UserInfo",
  CART_KEY: "CS571-202305-ExtraProject-Cart",
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case Actions.LOGIN:
      return { ...state, user: action.payload, isLoading: true };

    case Actions.LOGOUT:
      return { ...state, user: null, order: [], cart: [], isLoading: false };

    case Actions.PRODUCTS:
      return { ...state, products: action.payload, isLoading: false };

    case Actions.SHOW_LOADING:
      return { ...state, isLoading: true };

    case Actions.HIDE_LOADING:
      return { ...state, isLoading: false };

    case Actions.CART:
      const user = state.user;
      if (user && user.id) {
        (async () => {
          await AsyncStorage.setItem(
            Keys.CART_KEY + "#" + user.id,
            JSON.stringify(action.payload)
          );
        })();
      }
      return { ...state, cart: action.payload };

    default:
      return state;
  }
};

export default AppContext;
export { Actions, reducer, Keys };
