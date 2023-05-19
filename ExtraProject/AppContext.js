import React, { createContext } from "react";

const AppContext = createContext();

// Actions
const Actions = {
  LOGIN: "login",
  LOGOUT: "logout",
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case Actions.LOGIN:
      return { ...state, user: action.payload };
    case Actions.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default AppContext;
export { Actions, reducer };
