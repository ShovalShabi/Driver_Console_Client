import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { loginUser } from "../states/userReducer";

interface LoginProps {
  /** Callback to switch to the registration mode. */
  onSwitchToRegister: () => void;
}

/**
 * Login component for the driver.
 *
 * Allows the driver to log in by providing email and password.
 * Upon successful login, the user's information is dispatched to the Redux store.
 *
 * @component
 * @param {LoginProps} props - Props containing the callback to switch to the register mode.
 * @returns {React.ReactElement} The rendered login component.
 */
const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  // Local state variables for email, password, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  /**
   * Handles the login process when the "Login" button is pressed.
   * If successful, the user's credentials are dispatched to the Redux store.
   * If failed, an error message is displayed.
   */
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

      {/* Email input field */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />

      {/* Password input field */}
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

      {/* Login button */}
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>

      {/* Link to switch to registration */}
      <Text style={styles.link} onPress={onSwitchToRegister}>
        Don't have an account? Register here.
      </Text>
    </View>
  );
};

// Styles for the Login component
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
