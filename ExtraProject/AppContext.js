import React, { createContext } from "react";
import axios from "axios";
import Env from "./Env";

const AppContext = createContext();

// Actions
const Actions = {
  LOGIN: "login",
  LOGOUT: "logout",
  PRODUCTS: "products",
  SHOW_LOADING: "show_loading",
  HIDE_LOADING: "hide_loading",
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case Actions.LOGIN:
      return { ...state, user: action.payload, isLoading: false };

    case Actions.LOGOUT:
      return { ...state, user: null };

    case Actions.PRODUCTS:
      return { ...state, products: action.payload, isLoading: false };

    case Actions.SHOW_LOADING:
      return { ...state, isLoading: true };

    case Actions.HIDE_LOADING:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default AppContext;
export { Actions, reducer };
