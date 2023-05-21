import React, { useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Env from "../Env";
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
        const res = await axios.get(
          Env.API + "user/" + state.user.id + "/orders"
        );
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDetail(item)}
          >
            <Text style={styles.buttonText}>View Detail</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
    marginTop: 5,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default OrderList;
