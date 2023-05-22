import { createStackNavigator } from "@react-navigation/stack";
import AddProduct from "./AddProduct";
import ProductsList from "./ProductsList";
import ProductDetail from "./ProductDetail";
import AddReview from "./AddReview";
import UsersList from "./UsersList";
import AddAdminUser from "./AddAdminUser";

const Stack = createStackNavigator();
const UsersScreen = () => {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={UsersList}
        options={{ title: "Users" }}
      />
      <Stack.Screen
        name="Add"
        component={AddAdminUser}
        options={{ title: "Add an admin user" }}
      />
    </Stack.Navigator>
  );
};

export default UsersScreen;
