import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppContext, { Actions } from "../AppContext";

const UsersList = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  const getFormattedOrderTime = (time) => {
    const orderTime = new Date(time);
    const formattedOrderTime = orderTime.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
    return formattedOrderTime;
  };

  // fetch data from server
  const refreshData = () => {
    (async () => {
      try {
        const res = await state.api.get("/users");
        if (res && res.data && res.data.code == 0) {
          // remove self
          const users = res.data.data || [];
          for (let i = 0; i < users.length; i++) {
            if (users[i]._id === state.user.id) {
              users.splice(i, 1);
              break;
            }
          }
          setUsers(users);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

  const handleDisable = async (item) => {
    dispatch({ type: Actions.SHOW_LOADING });
    try {
      // submit to server and refresh
      await state.api.patch("/users/" + item._id, { disable: !item.disable });
      dispatch({ type: Actions.HIDE_LOADING });
      // fetch data from server
      refreshData();
    } catch (err) {
      console.log(err);
      dispatch({ type: Actions.HIDE_LOADING });
    }
  };

  const handleAddAdminUser = () => {
    navigation.navigate("Add");
  };

  const renderUserItem = ({ item }) => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.usersDetails}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.text}>{item._id}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.text}>{item.role}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>Disable:</Text>
            <Text style={styles.text}>{item.disable ? "True" : "False"}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.text}>{getFormattedOrderTime(item.time)}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDisable(item)}
          >
            <Text style={styles.buttonText}>
              {item.disable ? "Enable" : "Disable"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddAdminUser}>
        <Text style={styles.addButtonText}>Add an admin user</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    flexGrow: 1,
    padding: 8,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  usersDetails: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 6,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
    marginTop: 5,
    width: 100,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4287f5",
    padding: 10,
    borderRadius: 16,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 8,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default UsersList;
