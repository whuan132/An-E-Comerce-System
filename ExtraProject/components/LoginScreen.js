import { createStackNavigator } from "@react-navigation/stack";
import Signin from "./Signin";
import Signup from "./Signup";

const Stack = createStackNavigator();
const LoginScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ title: "Sign In" }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: "Sign Up" }}
      />
    </Stack.Navigator>
  );
};

export default LoginScreen;
