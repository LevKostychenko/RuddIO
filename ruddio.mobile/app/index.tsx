import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkRegistration = async () => {
      const isRegistered = await AsyncStorage.getItem("isRegistered");
      if (isRegistered === "true") {
        // router.push("/home");
      } else {
        router.push("/(auth)/username");
      }
    };

    checkRegistration();
  }, []);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
