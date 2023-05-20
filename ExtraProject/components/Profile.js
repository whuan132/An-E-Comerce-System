import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AppContext, { Actions } from "../AppContext";

const Profile = ({}) => {
  const { state, dispatch } = useContext(AppContext);

  const onLogout = () => {
    dispatch({ type: Actions.LOGOUT });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{state.user.email}</Text>

      <Text style={styles.label}>ID:</Text>
      <Text style={styles.text}>{state.user.id}</Text>

      <Text style={styles.label}>Role:</Text>
      <Text style={styles.text}>{state.user.role}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
