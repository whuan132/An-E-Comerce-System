import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableHighlight,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Env from "../Env";
import AppContext, { Actions } from "../AppContext";

const AddProduct = ({ navigation, route }) => {
  const data = route.params;
  const { state, dispatch } = useContext(AppContext);
  const [product, setProduct] = useState({
    name: data ? data.name : "",
    image: data ? data.images : "",
    category: data ? data.category : "",
    price: data ? data.price : 0,
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (name, value) => {
    if (name === "price" && isNaN(value)) {
      value = 0.0;
    }
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleTakePicture = async (event) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.log("Camera permission not granted");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      width: 100,
      height: 100,
      base64: true,
    });

    if (!result.canceled && !!result.assets[0]) {
      const base64String = result.assets[0].base64;
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: `data:image/jpg;base64,${base64String}`,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (product.name == "") {
        setErrorMessage("Name is null");
        return;
      }
      if (product.category == "") {
        setErrorMessage("Category is null");
        return;
      }
      if (product.image == "") {
        setErrorMessage("Image is null");
        return;
      }
      if (product.price <= 0) {
        setErrorMessage("Price less than 0");
        return;
      }

      // Submit to server
      let res = null;
      if (!data) {
        // Add
        const temp = {
          name: product.name,
          images: product.image,
          category: product.category,
          price: product.price,
        };
        dispatch({ type: Actions.SHOW_LOADING });
        res = await axios.post(Env.API + "products", temp);
        // update local context data
        if (res.data.code === 0) {
          temp._id = res.data.data.insertedId;
          const tempProducts = [...state.products, temp];
          dispatch({ type: Actions.PRODUCTS, payload: tempProducts });
        }
      } else {
        // Edit
        const temp = {};
        let count = 0;
        for (let e in product) {
          if (product[e] != data[e]) {
            temp[e] = product[e];
            count++;
          }
        }
        if (count == 0) {
          setErrorMessage("Anything doesn't change");
          return;
        }
        dispatch({ type: Actions.SHOW_LOADING });
        res = await axios.patch(Env.API + "products/" + data._id, temp);
        // update local context data
        if (res.data.code === 0) {
          const tempProducts = [...state.products];
          for (let e in product) {
            if (product[e] != data[e]) {
              data[e] = product[e];
            }
          }
          dispatch({ type: Actions.PRODUCTS, payload: tempProducts });
        }
      }

      // Handle successful
      const obj = res.data;
      if (obj.code === 0) {
        setProduct({ ...product, name: "", image: "", category: "", price: 0 });
        setErrorMessage(null);
        navigation.goBack();
      } else {
        dispatch({ type: Actions.HIDE_LOADING });
        setErrorMessage(obj.data);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={product.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={product.category}
          onChangeText={(value) => handleChange("category", value)}
        />
        <Button title="Take Picture" onPress={handleTakePicture} />
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.image} />
        )}
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={product.price.toString()}
          onChangeText={(value) => handleChange("price", parseFloat(value))}
          keyboardType="numeric"
        />
        <TouchableHighlight
          style={styles.button}
          underlayColor="#DDDDDD"
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {data ? "Update" : "Add Product"}
          </Text>
        </TouchableHighlight>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginTop: 8,
    textAlign: "center",
  },
});

export default AddProduct;
