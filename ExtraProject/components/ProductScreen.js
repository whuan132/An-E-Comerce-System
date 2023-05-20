import { createStackNavigator } from "@react-navigation/stack";
import AddProduct from "./AddProduct";
import ProductsList from "./ProductsList";
import ProductDetail from "./ProductDetail";
import AddReview from "./AddReview";

const Stack = createStackNavigator();
const ProductScreen = () => {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={ProductsList}
        options={{ title: "Products" }}
      />
      <Stack.Screen
        name="Add"
        component={AddProduct}
        options={{ title: "Add Product" }}
      />
      <Stack.Screen
        name="Edit"
        component={AddProduct}
        options={{ title: "Edit Product" }}
      />
      <Stack.Screen
        name="Detail"
        component={ProductDetail}
        options={{ title: "Product Detail" }}
      />
      <Stack.Screen
        name="AddReview"
        component={AddReview}
        options={{ title: "Add Review" }}
      />
    </Stack.Navigator>
  );
};

export default ProductScreen;
