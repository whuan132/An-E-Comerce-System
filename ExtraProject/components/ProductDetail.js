import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import AppContext, { Actions } from "../AppContext";

const ProductDetail = ({ navigation, route }) => {
  const product_id = route.params._id;
  const { state, dispatch } = useContext(AppContext);
  const [product, setProduct] = useState({
    review: { feedbacks: [], score: 0 },
    price: 0,
    name: "",
    category: "",
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const products = state.products;
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === product_id) {
        setProduct(products[i]);
        setReviews(products[i].review.feedbacks);
        break;
      }
    }
  }, [state.products]);

  const handleAddReview = () => {
    navigation.navigate("AddReview", product);
  };
  const handleAddToCart = () => {
    const cart = [...state.cart];

    let found = false;
    for (let i = 0; i < cart.length; i++) {
      if (product._id == cart[i]._id) {
        cart[i].quantity++;
        found = true;
        break;
      }
    }

    if (!found) {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    dispatch({ type: Actions.CART, payload: cart });
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon
            key={i}
            name="star"
            size={16}
            color={i <= item.stars ? "#FFD700" : "#D3D3D3"}
          />
        ))}
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 30 : 0,
        paddingBottom: 200,
      }}
    >
      <View style={styles.container}>
        <View style={styles.productContainer}>
          <Image
            source={{ uri: `${product.images}` }}
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Icon
                  key={i}
                  name="star"
                  size={16}
                  color={i <= product.review.score ? "#FFD700" : "#D3D3D3"}
                />
              ))}
            </View>
            <Text style={styles.productCategory}>{product.category}</Text>

            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          </View>
        </View>

        {state.user.role === "customer" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddReview}>
              <Text style={styles.buttonIcon}>
                <MaterialCommunityIcons
                  name="message-draw"
                  size={20}
                  color="white"
                />
              </Text>
              <Text style={styles.buttonText}>Add Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
              <Text style={styles.buttonIcon}>
                <MaterialCommunityIcons
                  name="cart-arrow-down"
                  size={20}
                  color="white"
                />
              </Text>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingTop: 16,
    backgroundColor: "#F5F5F5",
  },
  productContainer: {
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  productDetails: {
    marginTop: 16,
  },
  productPrice: {
    fontSize: 14,
  },
  productCategory: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewsContainer: {
    marginTop: 16,
    flex: 1,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewContainer: {
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  reviewStars: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  reviewComment: {
    fontSize: 16,
    paddingRight: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4287f5",
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    marginRight: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetail;
