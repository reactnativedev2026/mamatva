import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="language" />
      <Stack.Screen name="stage" />
      <Stack.Screen name="pregnancy" />
      <Stack.Screen name="baby-gender" />
      <Stack.Screen name="notification" />
    </Stack>
  );
}
