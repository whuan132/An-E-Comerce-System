import { createStackNavigator } from "@react-navigation/stack";
import Cart from "./Cart";
import Checkout from "./Checkout";

const Stack = createStackNavigator();
const CartScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Cart">
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ title: "My Cart" }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{ title: "Checkout" }}
      />
    </Stack.Navigator>
  );
};

export default CartScreen;
