import React, { useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppContext, { Actions } from "../AppContext";

const OrderList = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);

  const getFormattedOrderTime = (time) => {
    const orderTime = new Date(time);
    const formattedOrderTime = orderTime.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
    return formattedOrderTime;
  };

  const getPaymentString = (id) => {
    const methods = [
      { id: "1", name: "Credit Card", icon: "credit-card" },
      { id: "2", name: "PayPal", icon: "paypal" },
      { id: "3", name: "Apple Pay", icon: "apple" },
    ];
    return methods[id - 1].name;
  };

  // fetch data from server
  const refreshData = () => {
    (async () => {
      try {
        let api = "user/" + state.user.id + "/orders";
        if (state.user.role === "admin") {
          // admin
          api = "/orders";
        }
        const res = await state.api.get(api);
        if (res && res.data && res.data.code == 0) {
          dispatch({ type: Actions.ORDER, payload: res.data.data || [] });
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

  const handleDetail = (item) => {
    navigation.navigate("Detail", item);
  };

  const handleDelivery = async (item) => {
    dispatch({ type: Actions.SHOW_LOADING });
    try {
      // submit to server and refresh
      await state.api.patch("/orders/" + item._id + "/delivery");
      // update local context data
      item.status = "delivered";
      dispatch({ type: Actions.ORDER, payload: [...state.order] });
      // fetch data from server
      refreshData();
    } catch (err) {
      console.log(err);
      dispatch({ type: Actions.HIDE_LOADING });
    }
  };

  const handleDelete = (item) => {
    Alert.alert("Confirm", "Do you want to delete this order?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Yes",
        onPress: async () => {
          console.log("OK Pressed");
          dispatch({ type: Actions.SHOW_LOADING });
          try {
            // submit to server and refresh
            await state.api.delete("/orders/" + item._id);
            // update local context data
            const temp = [...state.order];
            temp.splice(temp.indexOf(item), 1);
            dispatch({ type: Actions.ORDER, payload: temp });
            // fetch data from server
            refreshData();
          } catch (err) {
            console.log(err);
            dispatch({ type: Actions.HIDE_LOADING });
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.orderContainer}>
        <View style={styles.orderDetails}>
          <Text style={styles.orderTotal}>Total: ${item.total}</Text>
          <Text style={styles.orderText}>Status: {item.status}</Text>
          <Text style={styles.orderText}>
            Date: {getFormattedOrderTime(item.time)}
          </Text>
          <Text style={styles.orderText}>Items: {item.products.length}</Text>
          <Text style={styles.orderText}>
            Payment: {getPaymentString(item.payment)}
          </Text>
        </View>

        {/* Customer */}
        {state.user.role === "customer" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDetail(item)}
            >
              <Text style={styles.buttonText}>View Detail</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Admin */}
        {state.user.role === "admin" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    item.status === "ordered" ? "green" : "lightgrey",
                  borderWidth: 0,
                },
              ]}
              onPress={() => handleDelivery(item)}
              disabled={item.status !== "ordered"}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>
                Delivery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "red", borderWidth: 0 },
              ]}
              onPress={() => handleDelete(item)}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {state.order.length > 0 ? (
        <FlatList
          data={state.order}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContainer: {
    flexGrow: 1,
    padding: 8,
  },
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  orderDetails: {
    flex: 1,
  },
  orderText: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
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
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
    marginTop: 5,
    width: 80,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default OrderList;
