import { createStackNavigator } from "@react-navigation/stack";
import AddProduct from "./AddProduct";
import ProductsList from "./ProductsList";

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
    </Stack.Navigator>
  );
};

export default ProductScreen;
