import React, { useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import AppContext, { Actions } from "../AppContext";
import Icon from "react-native-vector-icons/FontAwesome";

const OrderDetail = ({ navigation, route }) => {
  const order = route.params;
  const { state, dispatch } = useContext(AppContext);

  const handleReturnOrder = () => {
    dispatch({ type: Actions.SHOW_LOADING });
    (async () => {
      try {
        const res = await state.api.patch(
          "/user/" + state.user.id + "/orders/" + order._id + "/return"
        );
        if (res && res.data && res.data.code == 0) {
          dispatch({ type: Actions.HIDE_LOADING });
          navigation.goBack();
        } else {
          dispatch({ type: Actions.HIDE_LOADING });
        }
      } catch (error) {
        console.error(error);
        dispatch({ type: Actions.HIDE_LOADING });
      }
    })();
  };

  const handleWriteReview = (product_id) => {
    const products = state.products;
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === product_id) {
        navigation.navigate("AddReview", products[i]);
      }
    }
  };

  const getImage = (item_id) => {
    const products = state.products;
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === item_id) {
        return products[i].images;
      }
    }
  };

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

  // Render each item in the cart
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.itemImage}
            source={{ uri: `${getImage(item._id)}` }}
          />
          <View style={{ flexDirection: "colmn" }}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>${item.price.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={() => handleWriteReview(item._id)}
        >
          <View style={{ flexDirection: "row" }}>
            <Icon name="star-o" size={16} color="grey" />
            <Text style={styles.writeReviewButtonText}>Write a review</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.orderIdText}>Order#{order._id}</Text>
      <Text style={styles.text}>Date: {getFormattedOrderTime(order.time)}</Text>
      <Text style={styles.text}>Status: {order.status}</Text>
      <Text style={styles.text}>Total: ${order.total.toFixed(2)}</Text>
      <Text style={styles.text}>
        Payment method: ${getPaymentString(order.payment)}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          order.status === "canceled" ? { borderColor: "lightgray" } : null,
        ]}
        onPress={handleReturnOrder}
        disabled={order.status === "canceled"}
      >
        <Text
          style={[
            styles.buttonText,
            order.status === "canceled" ? { color: "lightgray" } : null,
          ]}
        >
          Start a return
        </Text>
      </TouchableOpacity>

      <Text style={styles.blockTitle}>{order.products.length} items</Text>
      <FlatList
        data={order.products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
  },
  button: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  listContent: {
    flexGrow: 1,
    padding: 8,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 8,
  },
  writeReviewButton: {
    borderWidth: 0,
  },
  writeReviewButtonText: {
    color: "black",
    textAlign: "center",
    textDecorationLine: "underline",
    marginLeft: 2,
    marginTop: 1,
  },
};

export default OrderDetail;
