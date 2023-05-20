import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Env from "../Env";
import AppContext, { Actions } from "../AppContext";

const ProductsList = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);

  const onAddToCart = (item) => {
    const cart = [...state.cart];

    let found = false;
    for (let i = 0; i < cart.length; i++) {
      if (item._id == cart[i]._id) {
        cart[i].quantity++;
        found = true;
        break;
      }
    }

    if (!found) {
      cart.push({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }

    dispatch({ type: Actions.CART, payload: cart });
  };

  const onDeleteProduct = (item) => {
    Alert.alert("Confirm", "Do you want to delete this product?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Yes",
        onPress: async () => {
          console.log("OK Pressed");
          dispatch({ type: Actions.SHOW_LOADING });
          // submit to server and refresh
          await axios.delete(Env.API + "products/" + item._id);
          // update local context data
          const temp = [...state.products];
          temp.splice(temp.indexOf(temp), 1);
          dispatch({ type: Actions.PRODUCTS, payload: temp });
          // fetch data from server
          refreshData();
        },
      },
    ]);
  };

  const onEditProduct = (item) => {
    navigation.navigate("Edit", item);
  };

  // fetch data from server
  const refreshData = () => {
    (async () => {
      try {
        const res = await axios.get(Env.API + "products");
        if (res && res.data && res.data.code == 0) {
          dispatch({ type: Actions.PRODUCTS, payload: res.data.data || [] });
        }
      } catch (error) {
        console.error(error);
      }
    })();
  };
  useEffect(() => {
    refreshData();
  }, []);

  const onAddProduct = () => {
    navigation.navigate("Add");
  };

  // Render each product item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.productItem}>
        <Image source={{ uri: `${item.images}` }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>

        {state.user.role === "customer" ? (
          // Customer
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onAddToCart(item)}
            >
              <Text style={styles.buttonText}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Admin
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={() => onEditProduct(item)}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red" }]}
              onPress={() => onDeleteProduct(item)}
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
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 30 : 0,
        paddingBottom: 200,
      }}
    >
      <FlatList
        data={state.products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />

      {/* Admin */}
      {state.user.role === "admin" && (
        <TouchableOpacity style={styles.addButton} onPress={onAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      )}
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
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: "#888",
  },
  productCategory: {
    fontSize: 14,
    color: "#888",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "green",
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    backgroundColor: "blue",
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

export default ProductsList;
