import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableHighlight,
  Text,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { SHA256 } from "crypto-js";
import Env from "../Env";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleSignup = async () => {
    try {
      // Hash the password
      const hashedPassword = SHA256(password).toString();

      // Send signup request with hashed password
      const res = await axios.post(Env.API + "user/signup", {
        email: email,
        password: hashedPassword,
      });

      const obj = res.data;
      if (obj.code === 0) {
        // Handle successful signup response
        console.log(obj);
        setSignupError("");
        setEmail("");
        setPassword("");
        navigation.goBack();
      } else {
        setSignupError("Error occurred during signup");
      }
    } catch (error) {
      // Handle signup error
      console.error(error);
      setSignupError("Error occurred during signup");
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
      <TouchableHighlight
        style={styles.button}
        underlayColor="#DDDDDD"
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableHighlight>
      {signupError ? <Text style={styles.errorText}>{signupError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
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
    marginTop: 8,
    textAlign: "center",
  },
});

export default Signup;
