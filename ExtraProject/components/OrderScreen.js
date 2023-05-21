import { createStackNavigator } from "@react-navigation/stack";
import OrderList from "./OrderList";
import OrderDetail from "./OrderDetail";
import AddReview from "./AddReview";

const Stack = createStackNavigator();
const OrderScreen = () => {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={OrderList}
        options={{ title: "My Orders" }}
      />
      <Stack.Screen
        name="Detail"
        component={OrderDetail}
        options={{ title: "Order" }}
      />
      <Stack.Screen
        name="AddReview"
        component={AddReview}
        options={{ title: "Add Review" }}
      />
    </Stack.Navigator>
  );
};

export default OrderScreen;
