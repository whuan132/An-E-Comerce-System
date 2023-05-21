import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProductScreen from "./ProductScreen";
import CartScreen from "./CartScreen";
import Profile from "./Profile";
import OrderScreen from "./OrderScreen";
import AppContext from "../AppContext";

const Tab = createBottomTabNavigator();

const CustomerScreen = () => {
  const { state } = useContext(AppContext);
  return (
    <Tab.Navigator
      initialRouteName="Products"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Products"
        component={ProductScreen}
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="store" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCart"
        component={CartScreen}
        options={{
          title: "My Cart",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
          tabBarBadge: state.cart.length > 0 ? state.cart.length : null,
        }}
      />
      <Tab.Screen
        name="MyOrder"
        component={OrderScreen}
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-list"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default CustomerScreen;
