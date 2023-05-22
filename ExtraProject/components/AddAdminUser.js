import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableHighlight,
  Text,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SHA256 } from "crypto-js";
import AppContext, { Actions } from "../AppContext";

const AddAdminUser = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const onSubmit = async () => {
    dispatch({ type: Actions.SHOW_LOADING });
    try {
      // Hash the password
      const hashedPassword = SHA256(password).toString();
      // Send signup request with hashed password
      const res = await state.api.post("/users/addadmin", {
        email: email,
        password: hashedPassword,
      });
      dispatch({ type: Actions.HIDE_LOADING });
      // reset data
      const obj = res.data;
      if (obj.code === 0) {
        setSignupError("");
        setEmail("");
        setPassword("");
        navigation.goBack();
      } else {
        setSignupError("Error occurred during submit");
      }
    } catch (error) {
      // Handle signup error
      console.error(error);
      dispatch({ type: Actions.HIDE_LOADING });
      setSignupError("Error occurred during submit");
    }
  };

  return (
    <KeyboardAwareScrollView>
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
          onPress={onSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>

        {signupError ? (
          <Text style={styles.errorText}>{signupError}</Text>
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
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#4287f5",
    padding: 10,
    borderRadius: 16,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 8,
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

export default AddAdminUser;
