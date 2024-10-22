import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import UserDTO from "../dto/UserDTO";
import authService from "../services/authService";

interface RegisterProps {
  /** Callback to trigger when the registration is successful. */
  onRegisterSuccess: () => void;
  /** Callback to trigger when the user cancels the registration process. */
  onCancel: () => void;
}

/**
 * Register component for creating a new driver account.
 *
 * This component allows users to fill out registration details such as first name, surname,
 * company, email, and password, and submit them to create a new driver account.
 *
 * @component
 * @param {RegisterProps} props - Props containing callbacks for successful registration and cancel actions.
 * @returns {React.ReactElement} The rendered Register component.
 */
const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onCancel }) => {
  // Local state variables for registration fields
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles the registration process when the "Register" button is pressed.
   * Creates a new user object and attempts to register the user through the auth service.
   */
  const handleRegister = async () => {
    const newUser: UserDTO = {
      firstName,
      surname,
      company,
      organizationEmail: email,
      password,
    };
    try {
      await authService.registerUser(company, newUser);
      onRegisterSuccess(); // Trigger success callback on successful registration
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <Title>Driver Registration</Title>
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        label="Surname"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      <TextInput
        label="Company"
        value={company}
        onChangeText={setCompany}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" style={styles.button} onPress={handleRegister}>
        Register
      </Button>
      <Button mode="outlined" style={styles.button} onPress={onCancel}>
        Cancel
      </Button>
    </View>
  );
};

// Styles for the Register component
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

export default Register;
