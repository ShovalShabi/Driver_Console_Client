import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const handleLogin = () => {
    // Perform login logic here

    // On success, call the onLoginSuccess callback
    onLoginSuccess();
  };

  return (
    <View style={styles.container}>
      <Title>Driver Login</Title>
      <TextInput label="Email" mode="outlined" style={styles.input} />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <TextInput label="Line Number" mode="outlined" style={styles.input} />
      <TextInput label="Starting Point" mode="outlined" style={styles.input} />
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>
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
});

export default Login;
