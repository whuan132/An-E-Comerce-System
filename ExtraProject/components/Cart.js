import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import AppContext, { Actions } from "../AppContext";

const Cart = () => {
  const { state, dispatch } = useContext(AppContext);
  const [totalPrice, setTotalPrice] = useState(0);

  const increaseQuantity = (item) => {
    const cart = [...state.cart];
    item.quantity++;
    dispatch({ type: Actions.CART, payload: cart });
  };

  const decreaseQuantity = (item) => {
    const cart = [...state.cart];
    item.quantity--;
    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }
    dispatch({ type: Actions.CART, payload: cart });
  };

  const onCheckout = () => {};

  useEffect(() => {
    // Calculate the total price of all items in the cart
    const temp = state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(temp);
  }, [state.cart]);

  const getImage = (item_id) => {
    const products = state.products;
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === item_id) {
        return products[i].images;
      }
    }
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
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseQuantity(item)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 30 : 0,
        paddingBottom: 200,
      }}
    >
      <FlatList
        data={state.cart}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />

      <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
      <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
        <Text style={styles.checkoutButtonText}>Continue to checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginRight: 40,
    textAlign: "right",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 16,
    paddingHorizontal: 8,
  },
  checkoutButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 16,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 8,
  },
  checkoutButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Cart;
