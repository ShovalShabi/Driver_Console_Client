import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import UserDTO from "../dto/UserDTO";
import authService from "../services/authService";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onCancel: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      onRegisterSuccess();
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
