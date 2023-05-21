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
import AppContext, { Actions } from "../AppContext";
import Icon from "react-native-vector-icons/FontAwesome";

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
          await state.api.delete("/products/" + item._id);
          // update local context data
          const temp = [...state.products];
          temp.splice(temp.indexOf(item), 1);
          dispatch({ type: Actions.PRODUCTS, payload: temp });
          // fetch data from server
          refreshData();
        },
      },
    ]);
  };

  // fetch data from server
  const refreshData = () => {
    (async () => {
      try {
        const res = await state.api.get("/products");
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
  const onEditProduct = (item) => {
    navigation.navigate("Edit", item);
  };
  const onProductDetail = (item) => {
    navigation.navigate("Detail", item);
  };

  // Render each product item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.productItem}>
        <TouchableOpacity onPress={() => onProductDetail(item)}>
          <Image
            source={{ uri: `${item.images}` }}
            style={styles.productImage}
          />
        </TouchableOpacity>
        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Icon
                key={i}
                name="star"
                size={16}
                color={i <= item.review.score ? "#FFD700" : "#D3D3D3"}
              />
            ))}
          </View>

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
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    padding: 8,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    backgroundColor: "#4287f5",
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
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
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
});

export default ProductsList;
