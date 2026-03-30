import { Stack } from "expo-router";

export default function TrainingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="practice" />
      <Stack.Screen name="completion" />
    </Stack>
  );
}
