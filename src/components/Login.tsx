import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import authService from "../services/authService";

interface LoginProps {
  onLoginSuccess: (company: string) => void;
  onSwitchToRegister: () => void; // Callback to switch to register mode
}

const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      console.log("Logging in the user");
      await authService.loginUser(company, email, password);
      onLoginSuccess(company); // Pass company name on success
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
        label="Company"
        value={company}
        onChangeText={setCompany}
        mode="outlined"
        style={styles.input}
      />
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
