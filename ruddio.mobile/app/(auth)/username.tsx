import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const UsernameScreen = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return;
    }

    router.push("/(auth)/pattern");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default UsernameScreen;
