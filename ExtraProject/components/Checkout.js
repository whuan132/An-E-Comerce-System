import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AppContext, { Actions } from "../AppContext";

const Checkout = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const getTotalPrice = () => {
    return state.cart.reduce(
      (total, item) => (total += item.price * item.quantity),
      0
    );
  };

  const getImage = (item_id) => {
    const products = state.products;
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === item_id) {
        return products[i].images;
      }
    }
  };

  const handleCheckout = async () => {
    dispatch({ type: Actions.SHOW_LOADING });
    try {
      const obj = {
        products: state.cart,
        total: getTotalPrice(),
        payment: selectedPaymentMethod,
      };
      const res = await state.api.post(
        "/user/" + state.user.id + "/orders",
        obj
      );
      // update local context data
      if (res.data.code === 0) {
        dispatch({ type: Actions.CART, payload: [] });
        // back
        navigation.goBack();
      } else {
        dispatch({ type: Actions.HIDE_LOADING });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: Actions.HIDE_LOADING });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        style={styles.itemImage}
        source={{ uri: `${getImage(item._id)}` }}
      />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>
    </View>
  );

  const paymentMethods = [
    { id: "1", name: "Credit Card", icon: "credit-card" },
    { id: "2", name: "PayPal", icon: "paypal" },
    { id: "3", name: "Apple Pay", icon: "apple" },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={state.cart}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.itemsContainer}
      />

      <View style={styles.blockContainer}>
        <Text style={styles.blockTitle}>Payment method</Text>
        {paymentMethods.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.paymentMethodContainer,
              selectedPaymentMethod === item.id && styles.selectedPaymentMethod,
            ]}
            onPress={() => setSelectedPaymentMethod(item.id)}
          >
            <Icon
              name={item.icon}
              size={24}
              color={selectedPaymentMethod === item.id ? "#4287f5" : "#D3D3D3"}
            />
            <Text style={styles.paymentMethodName}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            selectedPaymentMethod === "" ? { backgroundColor: "#D3D3D3" } : {},
          ]}
          onPress={handleCheckout}
          disabled={selectedPaymentMethod === ""}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  blockContainer: {
    padding: 16,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemsContainer: {
    flexGrow: 1,
    padding: 8,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  itemImage: {
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    backgroundColor: "#E8F0FE",
    borderRadius: 8,
    padding: 8,
  },
  paymentMethodName: {
    marginLeft: 8,
    fontSize: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: "#4287f5",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Checkout;
