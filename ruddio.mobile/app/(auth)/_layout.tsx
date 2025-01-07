import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="username"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="pattern"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
