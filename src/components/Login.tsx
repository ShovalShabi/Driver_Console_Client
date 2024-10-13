import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { loginUser } from "../states/userReducer";

interface LoginProps {
  onSwitchToRegister: () => void; // Callback to switch to register mode
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      console.log(`Attempt for logging in the user ${email}`);
      const user = await authService.loginUser(email, password);
      console.log(`The user ${email} logged in successfully!`);
      dispatch(loginUser(user));
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Failed to login into the system"); // Set error message

      // Automatically hide the error message after 3 seconds
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Title>Driver Login</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      {/* Display error message */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>

      {/* Hypertext to switch to registration */}
      <Text style={styles.link} onPress={onSwitchToRegister}>
        Don't have an account? Register here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 8,
  },
  link: {
    color: "#1e90ff",
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default Login;
