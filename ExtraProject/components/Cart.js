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

const Cart = ({ navigation }) => {
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

  const onCheckout = () => {
    navigation.navigate("Checkout");
  };

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
    <View style={styles.container}>
      {state.cart.length <= 0 && (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      )}

      {state.cart.length > 0 && (
        <>
          <FlatList
            data={state.cart}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.blockContainer}>
            <Text style={styles.totalPrice}>
              Total: ${totalPrice.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={onCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Continue to checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 16,
    fontWeight: "bold",
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
    marginLeft: 8,
    marginTop: 16,
    marginBottom: 8,
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

export default Cart;
