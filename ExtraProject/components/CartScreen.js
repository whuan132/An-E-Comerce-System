import { createStackNavigator } from "@react-navigation/stack";
import Cart from "./Cart";

const Stack = createStackNavigator();
const CartScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Cart">
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ title: "My Cart" }}
      />
    </Stack.Navigator>
  );
};

export default CartScreen;
