import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { SHA256 } from "crypto-js";
import AppContext, { Actions } from "../AppContext";
import Env from "../Env";

const Signin = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  const handleLogin = async () => {
    try {
      const hashedPassword = SHA256(password).toString();
      const res = await axios.post(Env.API + "user/signin", {
        email: email,
        password: hashedPassword,
      });

      // Handle successful login response
      const obj = res.data;
      if (obj.code === 0) {
        console.log(res.data);
        setLoginError("");
        dispatch({ type: Actions.LOGIN, payload: obj });
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      // Handle login error
      console.error(error);
      setLoginError("Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {loginError && <Text style={styles.errorText}>{loginError}</Text>}

      <TouchableHighlight
        style={styles.button}
        underlayColor="#DDDDDD"
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.signupButton}
        underlayColor="#DDDDDD"
        onPress={handleSignup}
      >
        <Text style={styles.signupButtonText}>Create Account</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    width: 200,
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
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  signupButton: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  signupButtonText: {
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
  },
});

export default Signin;
